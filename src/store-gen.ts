import * as R from 'ramda';
import { codeGenAction } from './codegen.js';

const genFn = (hasError, hasFail, hasComplete) => `
  (v: T) => {
    obs: Observable<U>${hasError && ' | Observable<Error>'},
    ${hasComplete && 'complete: V,'}
    ${hasFail && 'fail: W,'}
  }
`;

type Reducer<State, T> = (payload: T) => (state: State) => State;

let obj: NgrxStruct = {
  foos: { // <number>() => ({
    state: 'number', // generate using AST from above generic?
    init: 0,
    reducers: {
      add: ['number', `R.add`], // convert both to string using AST? // better yet, infer payload type for reducer function given State in/out?
    },
    selectors: {
      id: `R.map(R.identity)`,
    },
    effects: {
      log: {
        init: 0,
        debounce: 0,
        isRead: false,
        complete: `(state, pl) => state + pl`,
        fn: (pl: number) => ({
          obs: `Observable.from([0])`,
          complete: `(state, pl) => state + pl`,
          fail: `(state, pl) => state + pl`,
        }),
        fail: `(state, pl) => state + pl`,
      },
    },
  }, // )
};

let files = R.mapObjIndexed((domain, domainName: string) => {
  let actionFile = codeGenAction(R.map(R.head)(domain.reducers), domainName);
  return { actions: actionFile };
})(obj);
console.log(files);

export interface NgrxStruct {
  domains: Obj<
    { // <State>() => 
      state: string, // State
      init: State,
      reducers: Obj<
        [string /*type*/, string /*Reducer<State, T>*/]
      >,
      selectors: Obj<
        string /*<T>(Observable<State>) => T*/, // (using R.map(R.prop) or combineLatest)
      >,
      effects: Obj<
        <T,U,V,W>(
          {
            init?: T,
            debounce?: number,
            isRead?: boolean,
          } & (
            (
              (
                {
                  default: U,
                  fn: (v: T) => {
                    obs: string/*Observable<U>*/,
                    complete: string/*V*/,
                  },
                } | {
                  fn: string/*(v: T) => {
                    obs: string/*Observable<U> | Observable<Error>*/,
                    complete: string/*V*/,
                    fail: string/*W*/,
                  }*/,
                  fail: string/*Reducer<State, W>*/,
                } | {
                  fn: (v: T) => {
                    obs: string/*Observable<U> | Observable<Error>*/,
                    complete: string/*V*/,
                  },
                  fail: string/*Reducer<State, Error>*/,
                }
              ) & {
                complete: string/*Reducer<State, V>*/,
              }
            ) | (
              (
                {
                  default: U,
                  fn: string/*(v: T) => {
                    obs: string/*Observable<U>*/,
                  }*/,
                } | {
                  fn: string/*(v: T) => {
                    obs: string/*Observable<U> | Observable<Error>*/,
                    fail: string/*W*/,
                  }*/,
                  fail: string/*Reducer<State, W>*/,
                } | {
                  fn: string/*(v: T) => {
                    obs: string/*Observable<U> | Observable<Error>*/,
                  }*/,
                  fail: string/*Reducer<State, Error>*/,
                }
              ),
              & {
                complete: string/*Reducer<State, U>*/,
              }
            )
          )
        ),
      >,
    // }
  >
}
