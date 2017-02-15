import * as R from 'ramda';
import { makeAction } from '../actions/actions';
import { reducerFn, mapReducers, mapStructReducers } from './reducers';
let cls = makeAction('book', 'create');
let action = new cls('foo');

describe('reducerFn', () => {
  it('should make a reducer function from a type map and initial state', () => {
    let reducer = reducerFn({ inc: R.inc }, 0);
    // Action:: { type, payload }
    expect(reducer(0, { type:'inc' })).toEqual(1);
  })
})

describe('mapReducers', () => {
  it('should map [ReducerMap, State] tuples to `(State, Action) ~> State` reducers', () => {
    let reducerObj = mapReducers({ inc: R.inc });
    expect(reducerObj['inc'](0, { type: 'inc', payload: null })).toEqual(1);
  })
})

describe('mapStructReducers', () => {
  it('should map [ReducerStructMap, State] tuples to `(State, Action) ~> State` reducers', () => {
    let reducerObj = mapStructReducers({
      fixed: { fixed: 123 },
      set: { set: R.identity },
      update: { update: R.dec },
      edit: { edit: (state: number, amount: number) => state + amount },
      misc: { misc: R.inc },
    });
    expect(reducerObj['edit'](0, { type: 'edit', payload: 2 })).toEqual(1);
  })
})
