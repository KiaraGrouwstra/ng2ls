import * as R from 'ramda';
// import * as codegen from './codegen';
// import { NgrxStruct } from './models/models';
// import { writeFile } from './node-utils';
import { Obj } from './models/models';
import { mapSyncActions, actionTp } from './actions/actions';
import { combineSelectors, reducerFn } from './reducers/reducers';
import { Observable } from 'rxjs';
import { Injectable, Type } from '@angular/core';
import { Http } from '@angular/http';
import { makeEffect } from './effects/effects';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';


type Reducer<State, T> = (payload: T) => (state: State) => State;

interface Bar {
  x: number;
  y: string;
}


let obj/*: NgrxStruct*/ = {
  foo: {
    init: 0, // initial state value
    // reducer functions, with payload type explicit for now
    reducers: {
      add: R.add, // convert both to string using AST? // better yet, infer payload type for reducer function given State in/out?
      subtract: R.subtract,
    },
    // selector functions from state$, probably using `obs.select`, `R.map(R.prop(k))` or `combineSelectors`
    selectors: {
      // simple: { // simple selectors, will wrap in R.map()
        id: R.identity,
        inc: R.inc,
      // },
      // combined: { // selectors combining previous selectors, supplied as tuple of [deps, fn]
        mult: [
          // combined selectors, names matching selectors defined above
          ['id', 'inc'],
          // combining function, array param ordered as above
          ([id, inc]) => id * inc
        ],
      // },
    },
    effects: {
      log: {
        // initial payload value
        init: 0,
        // limit effect calling interval (default: 0, unlimited)
        debounce: 0,
        // whether this is a read operation (ignore all but last)
        read: false,
        // fallback value to use instead of emitting failure, define either this or `ng`. type matches fn.obs value , along with `ok` reducer param if no `fn.ok`.
        fallback: 0,
        // fn: effect function returning different possible results, param type matching `init` (if specified) and effect action payload.
        // obs: observable with the result (or error) for the given payload. result will be passed to `ok` reducer unless overridden by `fn.ok`.
        // ok: // optional value to pass as a parameter to the `ok` reducer, with matching type. if not specified, the default or value of `fn.obs` (if successful) is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
        // ng: // optional value to pass as a parameter to the `ng` reducer, with matching type. if not specified, the error is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
        fn: (pl: number) => {
          let blah = pl;
          return {
          obs: Observable.from([0]),
          ok: blah,
          ng: 'bar',
          };
        },
        // reducer triggered on effect completion, with param type matching `fn.ok` (if available) or `fallback` + `fn.ok`.
        ok: (state, pl: number) => pl,
        // reducer triggered on effect failure, define either this or `fallback`. param type matches `fn.ng` if available, otherwise `Error`.
        ng: (state, pl: string) => pl.length,
      },
    },
  },
  
  foo2: {
    init: 0, // initial state value
    // reducer functions, with payload type explicit for now
    reducers: {
      add: R.add, // convert both to string using AST? // better yet, infer payload type for reducer function given State in/out?
      subtract: R.subtract,
    },
    // selector functions from state$, probably using `obs.select`, `R.map(R.prop(k))` or `combineSelectors`
    selectors: {
      // simple: { // simple selectors, will wrap in R.map()
        id: R.identity,
        inc: R.inc,
      // },
      // combined: { // selectors combining previous selectors, supplied as tuple of [deps, fn]
        mult: [
          // combined selectors, names matching selectors defined above
          ['id', 'inc'],
          // combining function, array param ordered as above
          ([id, inc]) => id * inc
        ],
      // },
    },
    effects: {
      log: {
        // initial payload value
        init: 0,
        // limit effect calling interval (default: 0, unlimited)
        debounce: 0,
        // whether this is a read operation (ignore all but last)
        read: false,
        // fallback value to use instead of emitting failure, define either this or `ng`. type matches fn.obs value , along with `ok` reducer param if no `fn.ok`.
        fallback: 0,
        // fn: effect function returning different possible results, param type matching `init` (if specified) and effect action payload.
        // obs: observable with the result (or error) for the given payload. result will be passed to `ok` reducer unless overridden by `fn.ok`.
        // ok: // optional value to pass as a parameter to the `ok` reducer, with matching type. if not specified, the default or value of `fn.obs` (if successful) is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
        // ng: // optional value to pass as a parameter to the `ng` reducer, with matching type. if not specified, the error is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
        fn: (pl: number) => {
          let blah = pl;
          return {
          obs: Observable.from([0]),
          ok: blah,
          ng: 'bar',
          };
        },
        // reducer triggered on effect completion, with param type matching `fn.ok` (if available) or `fallback` + `fn.ok`.
        ok: (state, pl: number) => pl,
        // reducer triggered on effect failure, define either this or `fallback`. param type matches `fn.ng` if available, otherwise `Error`.
        ng: (state, pl: string) => pl.length,
      },
    },
  },
};

export class DomainEffectBase {}
export function getEffClass(effects, actions, k): Type<DomainEffectBase> {
  @Injectable()
  class DomainEffect implements DomainEffectBase {
    constructor(
      private http: Http,
      private actions$: Actions,  
    ) {
      R.forEachObjIndexed(
        (eff: any, ek: string) => {
          const getAction = (kk: string) => `${k}.${kk}`;
          let { init, debounce, read, fallback, ng, ok, fn } = eff;
          let failAction = ng && getAction(`${k}Ng`);
          let opts = { init, debounce, read, fallback, failAction };
          let fn2 = makeEffect.call(this, <any>{type: actionTp(k, ek), action:actions[ek]}, <any>actions[`${ek}Ok`], eff.fn, <any>opts );
          let key = getAction(ek) + '$';
          this[key] = fn2;
        },
        effects||{}  
      );
    }
    
  };
    
  R.forEachObjIndexed(
    (eff: any, ek: string) => {
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
    },
    effects||{} 
  );
  
  
  return DomainEffect;
}

export let genNgrx = R.mapObjIndexed((domain: any, k: string) =>
  // R.mapObjIndexed((part: any, domainName: string) => {
  //     // ...
  //     // actions: use `mapSyncActions` on `reducers`' keys + effects' keys + ok/ng; see actions.ts, actions.spec.ts, foo.ts, ngrx_gen/foo/actions.ts (/ codegen.ts)
  //     // reducers: use `mapReducers` on `reducers` + effects' ok/ng, see reducers.ts, reducers.spec.ts, ngrx_gen/foo/reducers.ts (/ codegen.ts)
  //     // selectors: see ngrx_gen/foo/reducers.ts (/ codegen.ts)
  //     // effects: just make these files manually? then maybe simplify structure here, e.g. here just `effects: { log: { ok: (state, pl: number) => pl, ng: (state, pl: string) => pl.length } }`
  //     // dispatchers: see ngrx_gen/foo/actions.ts (/ codegen.ts)
  //     // difference with before: generation dynamic instead of codegen, ignoring Action types (`MyAction<T>` -> just `Action`). manually type dispatcher part afterwards.
  //   },
  //   domain
  // )
  {
    var actKeys = Array.prototype.concat.call(
      [],
      Object.keys( domain.reducers ),
      R.flatten<string>(
        Object.keys( domain.effects ).map(
          x => [ `${x}Ok`, `${x}Ng` ]
        )
      )
    );
    var reducerEff = R.mapObjIndexed(
      (eff, k) => {
        return ['ok', 'ng'].filter(
          R.flip(R.prop)(eff)
        ).reduce(
          (acc, okng) => {
            var captial = [okng.slice(0, 1).toUpperCase(), okng.slice(1).toLowerCase()].join('');
            acc[`${k}${captial}`] = eff[okng];
            return acc;
          },
          {}
        );
      },
      domain.effects || {}  
    );
    
    let reducers = R.fromPairs(
      R.toPairs(
        R.merge(domain.reducers, <any>R.mergeAll(R.values(reducerEff)))
      ).map(
        ([key, val]): [string, any] => ([actionTp(k, key), val])
      )
    );
    
    let actions = mapSyncActions({[k]: actKeys});
    
    let selectorParts = partitionObj( R.is(Function), domain.selectors||{} );
    let non_combined = R.map( (fn:any) => R.map(fn), selectorParts[0] );
    let combined = R.map(
      (multi) => {
        return combineSelectors( <any>R.map( R.flip(R.prop)(non_combined), multi[0]), multi[1] )
      },
      selectorParts[1]  
    );
    
    
    return {
      actions: actions[k].actions,
      reducers: reducerFn(reducers, domain.init),
      selectors: R.merge(non_combined, combined),
      dispatchers: (store: Observable<any>&{dispatch: (pl: any)=>any}) => {
        let dispatch = store.dispatch.bind(store);
        return R.map(
          (act: any) => {
            return (pl: any) => dispatch( new act(pl) );
          },
          actions[k].actions
        );
      },
      effects: getEffClass(domain.effects, actions[k].actions, k)
    };
  }
);

export let generated = genNgrx(obj);

function partitionObj( pred, ctx ) {
  let pairs = R.toPairs( ctx );
  return R.partition( <any>R.pipe(R.nth(1), pred), pairs ).map( R.fromPairs );
};
