import * as R from 'ramda';
import { codeGenAction, codeGenEffect } from './codegen';
// import { NgrxStruct } from './models/models';
import { writeFile } from './node-utils';

type Reducer<State, T> = (payload: T) => (state: State) => State;

let obj/*: NgrxStruct*/ = {
  foo: { // <number>() => ({
    state: 'number', // state type; TODO: generate using AST from above generic?
    init: 0, // initial state value
    reducers: { // reducer functions, with payload type explicit for now
      add: ['number', `R.add`], // convert both to string using AST? // better yet, infer payload type for reducer function given State in/out?
      subtract: ['number', `R.subtract`],
    },
    selectors: { // selector functions from state$, probably using `obs.select`, `R.map(R.prop(k))` or `combineSelectors`
      id: `R.map(R.identity)`,
    },
    effects: {
      log: {
        // initial payload value
        init: 0,
        // limit effect calling interval (default: 0, unlimited)
        debounce: 0,
        // whether this is a read operation (ignore all but last)
        read: false,
        // fallback value to use instead of emitting failure, define either this or `fail`. type matches fn.obs value , along with `complete` reducer param if no `fn.complete`. 
        fallback: 0,
        // fn: effect function returning different possible results, param type matching `init` (if specified) and effect action payload.
        // obs: observable with the result (or error) for the given payload. result will be passed to `complete` reducer unless overridden by `fn.complete`.
        // complete: // optional value to pass as a parameter to the `complete` reducer, with matching type. if not specified, the default or value of `fn.obs` (if successful) is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
        // fail: // optional value to pass as a parameter to the `fail` reducer, with matching type. if not specified, the error is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
        fn: `(pl: number) => {
      let blah = pl;
      return {
        obs: Observable.from([0]),
        complete: blah,
        fail: 'bar',
      };
    }`,
        // reducer triggered on effect completion, with param type matching `fn.complete` (if available) or `fallback` + `fn.complete`.
        complete: `(state, pl: number) => pl`,
        // reducer triggered on effect failure, define either this or `fallback`. param type matches `fn.fail` if available, otherwise `Error`.
        fail: `(state, pl: string) => pl.length`,
      },
      bar: {
        fn: `(pl: number) => ({ obs: Observable.from([0]) })`,
        complete: `(state, pl: number) => pl`,
      },
    },
  }, // )
};

let files = R.mapObjIndexed((domain, domainName: string) => {
  let actions = codeGenAction(R.map(R.head)(domain['reducers']), domainName);
  let effects = codeGenEffect(domain['effects'], domainName);
  return { actions, effects };
})(obj);
// console.log(files);
R.forEachObjIndexed((domain, domainName: string) => {
  const getFile = (name: string) => `ngrx_gen/${domainName}/${name}.ts`;
  writeFile(getFile('actions'), domain['actions']);
  writeFile(getFile('effects'), domain['effects']);
})(files);

