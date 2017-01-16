import * as R from 'ramda';
import { makeAction } from '../actions/actions';
import { reducerFn, mapReducers, mapStructReducers } from './reducers';
let cls = makeAction('book', 'create');
let action = new cls('foo');

describe('reducerFn', () => {
  it('should make a reducer function from a type map and initial state', () => {
    let reducer = reducerFn({ inc: R.inc }, 0);
    // Action:: { type, payload }
    expect(reducer(undefined, { type:'inc' })).toEqual(1);
  })
})

describe('mapReducers', () => {
  it('should map [ReducerMap, State] tuples to `(State, Action) ~> State` reducers', () => {
    let reducer = mapReducers({ inc: R.inc }, 0);
    expect(reducer({ type: 'inc', payload: null }, undefined)).toEqual(1);
  })
})

describe('mapStructReducers', () => {
  it('should map [ReducerStructMap, State] tuples to `(State, Action) ~> State` reducers', () => {
    let reducer = mapStructReducers({
      fixed: { fixed: 123 },
      set: { set: R.identity },
      update: { update: R.dec },
      edit: { edit: (state: number, amount: number) => state + amount },
      misc: { misc: R.inc },
    }, 0);
    expect(reducer({ type: 'inc', payload: null }, undefined)).toEqual(1);
  })
})
