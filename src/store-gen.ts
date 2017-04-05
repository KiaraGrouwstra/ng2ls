import * as R from 'ramda';
import * as codegen from './codegen';
// import { NgrxStruct } from './models/models';
import { writeFile } from './node-utils';
import { Obj } from './models/models';

type Reducer<State, T> = (payload: T) => (state: State) => State;

let obj/*: NgrxStruct*/ = {
  foo: { // <number>() => ({
    state: 'number', // state type; TODO: generate using AST from above generic?
    init: 0, // initial state value
    // models owned by this domain. motivation for inclusion: allows reducer files to automatically import all types for the model.
    models: {
      Bar: '{ x: number; y: string; }',
    },
    // reducer functions, with payload type explicit for now
    reducers: {
      add: ['number', `R.add`], // convert both to string using AST? // better yet, infer payload type for reducer function given State in/out?
      subtract: ['number', `R.subtract`],
    },
    // selector functions from state$, probably using `obs.select`, `R.map(R.prop(k))` or `combineSelectors`
    selectors: {
      // simple: { // simple selectors, will wrap in R.map()
        id: `R.identity`,
        inc: `R.inc`,
      // },
      // combined: { // selectors combining previous selectors, supplied as tuple of [deps, fn]
        mult: [
          // combined selectors, names matching selectors defined above
          ['id', 'inc'],
          // combining function, array param ordered as above
          `([id, inc]) => id * inc`
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
        // fallback value to use instead of emitting failure, define either this or `fail`. type matches fn.obs value , along with `ok` reducer param if no `fn.ok`.
        fallback: 0,
        // fn: effect function returning different possible results, param type matching `init` (if specified) and effect action payload.
        // obs: observable with the result (or error) for the given payload. result will be passed to `ok` reducer unless overridden by `fn.ok`.
        // ok: // optional value to pass as a parameter to the `ok` reducer, with matching type. if not specified, the default or value of `fn.obs` (if successful) is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
        // fail: // optional value to pass as a parameter to the `fail` reducer, with matching type. if not specified, the error is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
        fn: ['number', `(pl: number) => {
    let blah = pl;
    return {
      obs: Observable.from([0]),
      ok: (v) => blah,
      fail: (e) => 'bar',
    };
  }`],
        // reducer triggered on effect completion, with param type matching `fn.ok` (if available) or `fallback` + `fn.ok`.
        ok: ['number', `(state, pl: number) => pl`],
        // reducer triggered on effect failure, define either this or `fallback`. param type matches `fn.fail` if available, otherwise `Error`.
        fail: ['string', `(state, pl: string) => pl.length`],
      },
      bar: {
        fn: ['number', `(pl: number) => ({ obs: Observable.from([0]) })`],
        ok: ['number', `(state, pl: number) => pl`],
      },
    },
  }, // )
};

let files = R.mapObjIndexed((domain: any, k: string): Obj<string> =>
  R.mapObjIndexed((concern: (domain: any, name: string) => string, domainName: string) => concern(domain, k))(<any> R.omit(['pipes'], codegen))
)(obj);
R.forEachObjIndexed((domain: Obj<string>, domainName: string) => {
  const getFile = (name: string) => `ngrx_gen/${domainName}/${name}.ts`;
  R.forEachObjIndexed((content: string, name: string) => {
    writeFile(getFile(name), content);
  })(domain);
})(files);

