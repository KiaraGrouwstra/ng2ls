import * as R from 'ramda';
import * as L from 'partial.lenses';
import { Observable } from 'rxjs';
import { Injectable, Type } from '@angular/core';
// import { Http } from '@angular/http';
import { Store, Action, combineReducers } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { makeEffect } from './effects/effects';
import * as codegen from './codegen';
import { SimpleSelector, CombinedSelector, NgrxDomain /*, NgrxStruct*/ } from './models/models';
import { writeFile } from './node-utils';
import { lookup, arr2obj, firstUpper } from './js';
import { Obj } from './models/models';
import { make, actionTp } from './actions/actions';
import { combineSelectors, Reducer, reducerFn } from './reducers/reducers';

export interface DomainBasic<T> {
  // local id paths, used as an index
  lId: string[];
  // remote id paths, used as the URI identifier
  rId: string[];
  // local name
  plural: string;
  // associate tables: if this has `product_id`, add `product` as a `get`?
  normalizer: (v: T) => any;
}

export interface DomainPlus<T> {
  // changed
  lId: (o: {}) => any;
  rId: (o: {}) => any;
  // unchanged
  plural: string;
  normalizer: (v: T) => any;
  // new
  localNav: (v: T) => any[]; // L Optic
  set: Reducer<any>;
  remove: Reducer<any>;
  merge: Reducer<any>;
}

export let domainMeta = R.mapObjIndexed((struct, k) => R.pipe(
  R.merge({
    lId: ['id'],
    rId: ['id'],
    plural: `${k}s`,
    normalizer: R.identity,
  }),
  R.evolve({
    lId: R.path,
    rId: R.path,
    normalizer: L.rewrite,
  }),
  (o: DomainPlus<any>) => R.merge(o, {
    localNav: (v) => [o.plural, o.lId(v), o.normalizer]
  }),
  (o: DomainPlus<any>) => R.merge(o, {
    set: (x) => L.set(o.localNav(x), x),
    remove: (x) => L.remove(o.localNav(x)),
    merge: R.pipe(
      /*R*/(xs: any[]) => xs.map(o.normalizer),
      <(r: any[]) => Obj<any>> R.indexBy(o.lId),
      R.flip(R.merge),
      L.modify(o.plural),
    ), // L.merge?
  }),
)(struct));

export class DomainEffectBase {}
export function getEffClass(effects, actions, k: string, ctorParamObj: Obj<Type<any>>): Type<DomainEffectBase> {
  let [keys, classes] = R.pipe(R.toPairs, R.transpose)(ctorParamObj);
  let DomainEffect = class DomainEffect implements DomainEffectBase {

    constructor(
      // private http: Http,
      private actions$: Actions,
    ) {
      const numArgs = 1;
      let args = arguments;
      R.addIndex(R.forEach)((name: string, i: number) => {
        this[name] = args[numArgs + i];
      })(keys);
      R.forEachObjIndexed((eff: any, ek: string) => {
        const getAction = (kk: string) => `${k}.${kk}`;
        let { init, debounce, read, fallback, fail, ok, fn } = eff;
        let failAction = fail && getAction(`${k}Fail`);
        let opts = { init, debounce, read, fallback, failAction };
        let fn2 = makeEffect.call(this, <any> { type: actionTp(k, ek), action: actions[ek] }, <any> actions[`${ek}Ok`], eff.fn.bind(this), <any> opts);
        let key = getAction(ek) + '$';
        this[key] = fn2;
      })(effects||{});
    }
    
  };

  let paramTypes = (<any> Reflect).getMetadata("design:paramtypes", DomainEffect);
  console.log('paramTypes', paramTypes);
  DomainEffect = (<any> Reflect).decorate([
      Injectable(),
      (<any> Reflect).metadata("design:paramtypes", [...paramTypes, ...classes]),
  ], DomainEffect);

  R.forEachObjIndexed((eff: any, ek: string) => {
    const getAction = (kk: string) => `${k}.${kk}`;
    let key = getAction(ek) + '$';
    // console.warn('@eff', key);
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

export interface NgrxInfo {
  actions: Obj<Type<Action>>;
  reducers: Obj<Reducer<any>>;
  selectors: Obj<(state$: Observable<any>) => Observable<any>>;
  effects: Type</*Effect*/any>;
  dispatchers: (store: Store<any>) => Obj<(pl: any) => void>;
  initialState: any;
}

// generate ngrx structure. difference with before:
// - generation dynamic instead of codegen
// - ignoring Action types (`MyAction<T>` -> just `Action`)
// - manually type dispatcher part afterwards
export let genNgrx: (o: Obj<NgrxDomain<any>>) => Obj<NgrxInfo> = R.mapObjIndexed((domain: NgrxDomain<any>, k: string) => {
  let actions: Obj<Type<Action>> = make.actions(k, <string[]> [
    ...Object.keys(domain.reducers),
    ...R.pipe(R.keys, R.chain(x => [x, `${x}Ok`, `${x}Fail`]))(domain.effects || {}),
  ]);
  let effReducers = R.mapObjIndexed((eff, k) =>
    R.pipe(
      R.filter(lookup(eff)),
      R.reduce(
        (acc, okFail: string) => R.assoc(`${k}${firstUpper(okFail)}`, eff[okFail], acc),
        {}
      ),
    )(['ok', 'fail'])
  )(domain.effects || {});
  return {
    actions,
    reducers: <Obj<Reducer<any>>> R.mergeAll([domain.reducers, ...R.values(effReducers)]),
    selectors: R.map((selector: CombinedSelector | SimpleSelector</*TState*/any>) =>
      (selector instanceof Array ?
        (([deps, fn]) => combineSelectors(deps, fn))(selector) :
        /*R.map*/((fn: (v: any) => any) => (obs: Observable<any>) => obs.map(fn))(selector)
      )
    )(domain.selectors || {}),
    effects: getEffClass(domain.effects || {}, actions, k, domain.di || {}),
    dispatchers: (store: Store<any>) => R.map((action: Type<Action>) => (pl) => store.dispatch(new action(pl)), actions),
    initialState: domain.init,
  };
});

export let mergeNgrx = (o: { [k: string]: NgrxInfo }) => <{
  actions: Obj<Obj<Type<Action>>>;
  reducers: Reducer<any>;
  selectors: Obj<Obj<(state$: Observable<any>) => Observable<any>>>;
  effects: Obj<Type</*Effect*/any>>;
  dispatchers: (store: Store<any>) => Obj<Obj<(pl: any) => void>>;
  initialState: Obj<any>;
}> R.pipe(
  arr2obj((k: string) => R.pluck(k, o)),
  R.evolve({
    dispatchers: (dispatchers) => (store: Store<any>) => R.map((fn: Function) => fn(store), dispatchers),
    reducers: R.pipe(R.map(reducerFn), combineReducers),
  }),
)(
  ['actions', 'reducers', 'selectors', 'effects', 'dispatchers', 'initialState']
);
