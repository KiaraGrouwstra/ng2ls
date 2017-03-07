import { State } from '../reducers';
export { Type } from '@angular/core';
export { Action } from '@ngrx/store';

export interface Obj<T> {
  [k: string]: T;
}

export type AppState = State;

// const genFn = (hasError, hasFail, hasComplete) => `
//   (v: T) => {
//     obs: Observable<U>${hasError && ' | Observable<Error>'},
//     ${hasComplete && 'complete: V,'}
//     ${hasFail && 'fail: W,'}
//   }
// `;

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
