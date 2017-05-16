import { Observable } from 'rxjs';
export { Type } from '@angular/core';
export { Action } from '@ngrx/store';
import { State } from '../reducers';
import { Reducer } from '../reducers/reducers';

export interface Obj<T> {
  [k: string]: T;
}

export type AppState = State;

export type SimpleSelector<T> = (state: T) => any;
export type CombinedSelector = [string[], (...args: any[]) => any];

// const genFn = (hasError, hasFail, hasComplete) => `
//   (v: T) => {
//     obs: Observable<U>${hasError && ' | Observable<Error>'},
//     ${hasComplete && 'complete: V,'}
//     ${hasFail && 'fail: W,'}
//   }
// `;

export interface NgrxDomain<TState> {
  // object of classes for Dependency Injection in effect classes (key -> property name)
  di: Obj<Type<any>>;
  // initial state value
  init?: TState;
  reducers?: Obj<Reducer<any>>;
  // selector functions from state$, probably using `obs.select`, `R.map(R.prop(k))` or `combineSelectors`
  // selectors combining previous selectors, supplied as tuple of [deps, fn]
  // - deps: combined selectors, names matching selectors defined above
  // - fn: combining function, array param ordered as above
  // simple selectors
  selectors?: Obj< CombinedSelector | SimpleSelector<TState> >;
  effects?: Obj<{
    // Effect<T,U>
    // initial payload value
    init?: /*T*/any,
    // limit effect calling interval (default: 0, unlimited)
    debounce?: number,
    // whether this is a read operation (ignore all but last)
    read?: boolean,
    // fallback value to use instead of emitting failure, define either this or `fail`. type matches fn.obs value, along with `ok` reducer param if no `fn.ok`.
    fallback?: /*U*/any,
    // fn: effect function returning different possible results, param type matching `init` (if specified) and effect action payload.
    fn: (pl: /*T*/any) => (Observable</*U*/any|Error> | {
      // obs: observable with the result (or error) for the given payload. result will be passed to `ok` reducer unless overridden by `fn.ok`.
      obs: Observable</*U*/any|Error>,
      // ok: // optional value to pass as a parameter to the `ok` reducer, with matching type. if not specified, the default or value of `fn.obs` (if successful) is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
      ok?: (v: /*U*/any) => /*V*/any,
      // fail: // optional value to pass as a parameter to the `fail` reducer, with matching type. if not specified, the error is passed instead. used to e.g. pass the effect param to the failure error instead of the error (such as the book the user attempted to add/remove, but couldn't).
      fail?: (e: Error) => /*W*/any,
    }),
    // reducer triggered on effect completion, with param type matching `fn.ok` (if available) or `fallback` + `fn.ok`.
    ok?: Reducer</*U|V*/any>,
    // reducer triggered on effect failure, define either this or `fallback`. param type matches `fn.fail` if available, otherwise `Error`.
    fail?: Reducer</*W*/any|Error>,
  }>;
}

// export interface NgrxStruct {
//   domains: Obj<
//     { // <State>() => 
//       state: string, // State
//       init: State,
//       reducers: Obj<
//         [string /*type*/, string /*Reducer<State, T>*/]
//       >,
//       selectors: Obj<
//         string /*<T>(Observable<State>) => T*/, // (using R.map(R.prop) or combineLatest)
//       >,
//       effects: Obj<
//         <T,U,V,W>(
//           {
//             init?: T,
//             debounce?: number,
//             read?: boolean,
//           } & (
//             (
//               (
//                 {
//                   fallback: U,
//                   fn: (v: T) => {
//                     obs: string/*Observable<U>*/,
//                     complete: string/*V*/,
//                   },
//                 } | {
//                   fn: (v: T) => {
//                     obs: string/*Observable<U> | Observable<Error>*/,
//                     complete: string/*V*/,
//                     fail: string/*W*/,
//                   },
//                   fail: string/*Reducer<State, W>*/,
//                 } | {
//                   fn: (v: T) => {
//                     obs: string/*Observable<U> | Observable<Error>*/,
//                     complete: string/*V*/,
//                   },
//                   fail: string/*Reducer<State, Error>*/,
//                 }
//               ) & {
//                 complete: string/*Reducer<State, V>*/,
//               }
//             ) | (
//               (
//                 {
//                   fallback: U,
//                   fn: (v: T) => {
//                     obs: string/*Observable<U>*/,
//                   },
//                 } | {
//                   fn: (v: T) => {
//                     obs: string/*Observable<U> | Observable<Error>*/,
//                     fail: string/*W*/,
//                   },
//                   fail: string/*Reducer<State, W>*/,
//                 } | {
//                   fn: (v: T) => {
//                     obs: string/*Observable<U> | Observable<Error>*/,
//                   },
//                   fail: string/*Reducer<State, Error>*/,
//                 }
//               ),
//               & {
//                 complete: string/*Reducer<State, U>*/,
//               }
//             )
//           )
//         ),
//       >,
//     // }
//   >
// }
