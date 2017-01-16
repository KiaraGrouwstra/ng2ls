import { State } from '../reducers';
export { Type } from '@angular/core';
export { Action } from '@ngrx/store';

export interface Obj<T> {
  [k: string]: T;
}

export type AppState = State;
