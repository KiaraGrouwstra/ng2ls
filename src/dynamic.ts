import * as R from 'ramda';
import * as L from 'partial.lenses';
import * as codegen from './codegen';
// import { NgrxStruct } from './models/models';
import { writeFile } from './node-utils';
import { lookup, arr2obj } from './js';
import { firstUpper } from './util';
import { Obj } from './models/models';
import { mapSyncActions } from './actions/actions';
import { Observable } from 'rxjs';
import { combineSelectors } from './reducers/reducers';

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
    // effects: just make these files manually? then maybe simplify structure here, e.g. here just `effects: { log: { ok: (state, pl: number) => pl, fail: (state, pl: string) => pl.length } }`
    dispatchers: (store: Observable<Actions>) => R.map((action) => (pl) => store.dispatch(action(pl)))(actions),
    // difference with before: generation dynamic instead of codegen, ignoring Action types (`MyAction<T>` -> just `Action`). manually type dispatcher part afterwards.
  };
});

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
