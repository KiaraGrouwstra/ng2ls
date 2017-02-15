import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
// import { Book } from '../models/models';
export type Book = { id: string };
import { ActionTypes as bookActions } from '../actions/book';
import { ActionTypes as collActions } from '../actions/collection';
let { SEARCH_COMPLETE, LOAD, SELECT } = bookActions;
let { LOAD_SUCCESS } = collActions;

export interface State {
  ids: string[];
  entities: { [id: string]: Book };
  selectedBookId: string | null;
};

export const initialState: State = {
  ids: [],
  entities: {},
  selectedBookId: null,
};

// T[] -> { [k]: T }, by a certain property as key
let byProp = (k: string) => R.pipe(R.map(<T>(v: T) => [R.prop(k, v), v]), R.fromPairs);
// (state, action: book.Actions | collection.Actions): State

let mergeBooks = (state: State, books: Book[]) => {
  const newBooks = books.filter((book: Book) => !state.entities[book.id]);
  const newBookIds = newBooks.map(R.prop('id'));
  const newBookEntities = byProp('id')(newBooks);
  return {
    ids: [ ...state.ids, ...newBookIds ],
    entities: R.merge(state.entities, newBookEntities),
    selectedBookId: state.selectedBookId,
  };
}

export let reducers = {
  [SEARCH_COMPLETE]: mergeBooks,
  [LOAD_SUCCESS]: mergeBooks,

  [LOAD]: (state: State, book: Book) => state.ids.includes(book.id) ? state : {
    ids: [ ...state.ids, book.id ],
    entities: R.merge(state.entities, {
      [book.id]: book,
    }),
    selectedBookId: state.selectedBookId,
  },

  [SELECT]: (state: State, selectedBookId: number) => ({
    ids: state.ids,
    entities: state.entities,
    selectedBookId,
  }),
}

let getBookEntities = R.map(R.prop('entities'));
let getBookIds = R.map(R.prop('ids'));
let getSelectedBookId = R.map(R.prop('selectedBookId'));

export let selectors = {
  selectedBook(state$: Observable<State>) {
    return combineLatest<{ [id: string]: Book }, string>(
      state$.let(getBookEntities),
      state$.let(getSelectedBookId)
    )
    .map(([ entities, selectedBookId ]) => entities[selectedBookId])
  },
  allBooks(state$: Observable<State>) {
    return combineLatest<{ [id: string]: Book }, string[]>(
      state$.let(getBookEntities),
      state$.let(getBookIds)
    )
    .map(([ entities, ids ]) => ids.map(id => entities[id]));
  },
};
