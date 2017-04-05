import * as R from 'ramda';
import * as L from 'partial.lenses';
import * as codegen from './codegen';
// import { NgrxStruct } from './models/models';
import { writeFile } from './node-utils';
import { lookup, arr2obj } from './js';
import { firstUpper } from './util';
import { Obj } from './models/models';
import { mapSyncActions, actionTp } from './actions/actions';
import { combineSelectors } from './reducers/reducers';
import { Observable } from 'rxjs';
import { Injectable, Type } from '@angular/core';
import { Http } from '@angular/http';
import { makeEffect } from './effects/effects';
import { Actions, Effect } from '@ngrx/effects';
import 'reflect-metadata';

export let domainMeta = R.mapObjIndexed((struct, k) => R.pipe(
  R.merge({
    // local id paths, used as an index
    lId: ['id'],
    // remote id paths, used as the URI identifier
    rId: ['id'],
    // local name
    plural: `${k}s`,
    normalizer: R.identity, // associate tables: if this has `product_id`, add `product` as a `get`?
  }),
  R.evolve({
    lId: R.path,
    rId: R.path,
    normalizer: L.rewrite,
  }),
  x => R.assoc('localNav', (v) => [x.plural, x.lId(v), x.normalizer], x),
)(struct));

export class DomainEffectBase {}
export function getEffClass(effects, actions, k): Type<DomainEffectBase> {
  @Injectable()
  class DomainEffect implements DomainEffectBase {

    constructor(
      private http: Http,
      private actions$: Actions,  
    ) {
      R.forEachObjIndexed((eff: any, ek: string) => {
        const getAction = (kk: string) => `${k}.${kk}`;
        let { init, debounce, read, fallback, fail, ok, fn } = eff;
        let failAction = fail && getAction(`${k}Fail`);
        let opts = { init, debounce, read, fallback, failAction };
        let fn2 = makeEffect.call(this, <any>{type: actionTp(k, ek), action:actions[ek]}, <any>actions[`${ek}Ok`], eff.fn, <any>opts );
        let key = getAction(ek) + '$';
        this[key] = fn2;
      })(effects||{});
    }
    
  };
    
  R.forEachObjIndexed((eff: any, ek: string) => {
    const getAction = (kk: string) => `${k}.${kk}`;
    let key = getAction(ek) + '$';
    console.warn('@eff', key);
    Object.defineProperty(
      DomainEffect.prototype,
      key,
      R.merge(
        (<any>Reflect).decorate(
          [Effect()],
          DomainEffect.prototype,
          key,
          Object.getOwnPropertyDescriptor(
            DomainEffect.prototype,
            key 
          )
        ),
        {
          writable: true
        }  
      )
    )
  })(effects||{});
  
  return DomainEffect;
}

// generate ngrx structure. difference with before:
// - generation dynamic instead of codegen
// - ignoring Action types (`MyAction<T>` -> just `Action`)
// - manually type dispatcher part afterwards
export let genNgrx = R.mapObjIndexed((domain: any, k: string) => {
  let actions = mapSyncActions({ [k]: [
    ...Object.keys(domain.reducers),
    ...R.flatten<string>(arr2obj(x => [`${x}Ok`, `${x}Fail`])(domain.effects),)
  ] });
  let effReducers = R.mapObjIndexed((eff, k) =>
    R.pipe(
      R.filter(lookup(eff)),
      R.reduce(
        (acc, okFail) => R.assoc(`${k}${firstUpper(okFail)}`, eff[okFail], acc),
        {}
      ),
    )(['ok', 'fail'])
  )(domain.effects || {});
  return {
    actions,
    reducers: R.mergeAll([domain.reducers, ...R.values(effReducers)]),
    // mapReducers?
    selectors: R.map((selector) =>
      !R.is(Array)(selector) ? R.map(selector) : ([deps, fn]) => combineSelectors(deps, fn)
    )(domain.selectors),
    effects: getEffClass(domain.effects, actions, k),
    dispatchers: (store: Observable<Actions>) => R.map((action) => (pl) => store.dispatch(action(pl)))(actions),
  };
});
