"use strict";
var R = require('ramda');
var book_1 = require('../actions/book');
var collection_1 = require('../actions/collection');
var reducers_1 = require('../reducers');
var SEARCH_COMPLETE = book_1.ActionTypes.SEARCH_COMPLETE, LOAD = book_1.ActionTypes.LOAD, SELECT = book_1.ActionTypes.SELECT;
var LOAD_SUCCESS = collection_1.ActionTypes.LOAD_SUCCESS;
;
exports.initialState = {
    ids: [],
    entities: {},
    selectedBookId: null,
};
// T[] -> { [k]: T }, by a certain property as key
var byProp = function (k) { return R.pipe(R.map(function (v) { return [R.prop(k, v), v]; }), R.fromPairs); };
// (state, action: book.Actions | collection.Actions): State
var mergeBooks = function (state, books) {
    var newBooks = books.filter(function (book) { return !state.entities[book.id]; });
    var newBookIds = newBooks.map(R.prop('id'));
    var newBookEntities = byProp('id')(newBooks);
    return {
        ids: state.ids.concat(newBookIds),
        entities: R.merge(state.entities, newBookEntities),
        selectedBookId: state.selectedBookId,
    };
};
exports.reducers = (_a = {},
    _a[SEARCH_COMPLETE] = mergeBooks,
    _a[LOAD_SUCCESS] = mergeBooks,
    _a[LOAD] = function (state, book) { return state.ids.includes(book.id) ? state : {
        ids: state.ids.concat([book.id]),
        entities: R.merge(state.entities, (_a = {},
            _a[book.id] = book,
            _a
        )),
        selectedBookId: state.selectedBookId,
    }; var _a; },
    _a[SELECT] = function (state, selectedBookId) { return ({
        ids: state.ids,
        entities: state.entities,
        selectedBookId: selectedBookId,
    }); },
    _a
);
var getBookEntities = R.map(R.prop('entities'));
var getBookIds = R.map(R.prop('ids'));
var getSelectedBookId = R.map(R.prop('selectedBookId'));
exports.selectors = {
    selectedBook: reducers_1.combineSelectors([getBookEntities, getSelectedBookId], function (_a) {
        var books = _a[0], id = _a[1];
        return books[id];
    }),
    allBooks: reducers_1.combineSelectors([getBookEntities, getBookIds], function (_a) {
        var entities = _a[0], ids = _a[1];
        return ids.map(function (id) { return entities[id]; });
    }),
};
var _a;
