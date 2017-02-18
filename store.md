type Reducer<T> = <T>(State, T) => State;

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
      <T,U,V,W>({
        init?: T,
        debounce?: number,
        isRead?: boolean,
      } & ((({
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
      }),
      & {
        complete: Reducer<V>,
      }) | (({
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
      }),
      & {
        complete: Reducer<U>,
      }))),
    >,
  }
>