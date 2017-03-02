const genFn = (hasError, hasFail, hasComplete) => `
  (v: T) => {
    obs: Observable<U>${hasError && ' | Observable<Error>'},
    ${hasComplete && 'complete: V,'}
    ${hasFail && 'fail: W,'}
  }
`;

type Reducer<T> = (State, T) => State;

# trick to type `R.map(f, { a: b })`: use codegen to write let obj = `(f) => ({ a: f(b) })`, then use with `obj(f)`

const wrapMap = (o) => `(f = R.identity) => ({\n${R.pipe(R.toPairs, R.map(([k, v]) => `  ${k}: f(${JSON.stringify(v)}),`), R.join('\n'))(o)}\n})`;
const wrapMapObjIndexed = (o) => `(f = R.identity) => ({\n${R.pipe(R.toPairs, R.map(([k, v]) => `  ${k}: f(${JSON.stringify(v)}, ${JSON.stringify(k)}),`), R.join('\n'))(o)}\n})`;

```js
// usage:
let o = { a: 'foo' };
wrapMap(o);
// "(f = R.identity) => ({
//   a: f("foo"),
// })"
// // call with default R.identity: returns original object
wrapMapObjIndexed(o);
// "(f = R.identity) => ({
//   a: f("foo", "a"),
// })"
// // call with default R.identity: returns original object
```

let obj = {
  foos: <number>() => ({ // State
    init: 0,
    reducers: {
      add: R.add,
    },
    selectors: {
      id: R.map(R.identity),
    },
    effects: {
      log: {
        init: 0,
        debounce: 0,
        isRead: false,
        complete: (state, pl) => state + pl,
        fn: (pl: number) => ({
          obs: Observable.from([0]),
          complete: (state, pl) => state + pl,
          fail: (state, pl) => state + pl,
        }),
        fail: (state, pl) => state + pl,
      },
    },
  }),
};

export interface NgrxStruct {
  domains: Obj<
    <State>{
      init: State,
      reducers: Obj<
        Reducer<T>
      >,
      selectors: Obj<
        <T>(Observable<State>) => T, // (using R.map(R.prop) or combineLatest)
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
                    obs: Observable<U>,
                    complete: V,
                  },
                } | {
                  fn: (v: T) => {
                    obs: Observable<U> | Observable<Error>,
                    complete: V,
                    fail: W,
                  },
                  fail: Reducer<W>,
                } | {
                  fn: (v: T) => {
                    obs: Observable<U> | Observable<Error>,
                    complete: V,
                  },
                  fail: Reducer<Error>,
                }
              ) & {
                complete: Reducer<V>,
              }
            ) | (
              (
                {
                  default: U,
                  fn: (v: T) => {
                    obs: Observable<U>,
                  },
                } | {
                  fn: (v: T) => {
                    obs: Observable<U> | Observable<Error>,
                    fail: W,
                  },
                  fail: Reducer<W>,
                } | {
                  fn: (v: T) => {
                    obs: Observable<U> | Observable<Error>,
                  },
                  fail: Reducer<Error>,
                }
              ),
              & {
                complete: Reducer<U>,
              }
            )
          )
        ),
      >,
    }
  >
}
