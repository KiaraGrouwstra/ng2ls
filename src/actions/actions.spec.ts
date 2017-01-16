// import * as R from 'ramda';
import { makeAction, actionFactory, effectfulAction, mapSyncActions, mapAsyncActions } from './actions';
import { pojofy } from '../util';
let FOO = 'foo';
let fixt = { type: '[book] create', payload: FOO };
let checkAction = (a: any, b: any) => expect(pojofy(a)).toEqual(pojofy(b));

describe('makeAction', () => {
  it('should create an ActionClass', () => {
    // let cls = makeAction('book', 'create');
    let cls = makeAction<string>('book', 'create');
    checkAction(new cls(FOO), fixt);
  });
});

// from down here it gets too smart for TS to follow currently:

describe('actionFactory', () => {
  it('should create actions in batch', () => {
    let cls = actionFactory('book', ['create']).actions.create;
    checkAction(new cls(FOO), fixt);
  });
});

describe('mapSyncActions', () => {
  it('should create actions in batch', () => {
    let cls = mapSyncActions({ book: ['create'] }).book.create;
    checkAction(new cls(FOO), fixt);
  });
});

describe('mapAsyncActions', () => {
  it('should create actions in batch', () => {
    // let cls = mapActions({ book: ['create'] }).book.create;
    let cls = mapAsyncActions({ book: ['create'] }).book.actions.create;
    checkAction(new cls(FOO), fixt);
  });
});
