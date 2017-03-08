import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { combineSelectors } from '../reducers';

import { Bar } from '../models/foo';
import { ActionTypes as actions } from '../actions/foo';
let { add, subtract, logOk, logNg, barOk } = actions;

export type State = number;

export const initialState: State = 0;

export let reducers = {
  [add]: R.add,
  [subtract]: R.subtract,
  [logOk]: (state, pl: number) => pl,
  [logNg]: (state, pl: string) => pl.length,
  [barOk]: (state, pl: number) => pl,
};

let id = R.map(R.identity);
let inc = R.map(R.inc);
let mult = combineSelectors([id, inc], ([id, inc]) => id * inc);

export let selectors = { id, inc, mult };
