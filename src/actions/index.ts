import { Action } from '@ngrx/store';
import { ActionClass, mapSyncActions, mapAsyncActions, actionFactory } from './actions';
import { Obj } from '../models/models';

let defaultActions = [
  'Search',
  // 'Remove',
  // 'Create',
  // 'Update',
];

type DefaultActions<T> = {
  Search: T;
  Search_Complete: T;
};
type FooActions<T> = {
  Overview: T;
  Overview_Complete: T;
};

type ActionTpl = {
  actions: Obj<ActionClass>;
  types: Obj<string>;
}

type defaultTpl = {
  actions: DefaultActions<ActionClass>;
  types: {
    SEARCH: string,
    SEARCH_COMPLETE: string,
  };
};

// interface StructObj {
//   bars: defaultTpl;
//   foos: {
//     actions: FooActions<ActionClass>;
//     types: {
//       OVERVIEW: string,
//       OVERVIEW_COMPLETE: string,
//     };
//   };
// };
// type StructObj<T> = Obj<{ types: Obj<string>, actions: Obj<ActionClass> }>;
type StructObj<T> = { [k: string]: T } | any;

let types = {
  foos: ['Overview'], // defaultActions
};
export let actions = <StructObj<ActionTpl>> mapAsyncActions(types);

// export let bars = actionFactory('bars', defaultActions);
