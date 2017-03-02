"use strict";
var actions_1 = require('./actions');
var tp = 'Foo';
// // Types:
// // level 0 solution, except map would fail for inference:
// // export const Types = R.map(type)({
// //   SEARCH:           '[Foo] Search',
// //   SEARCH_COMPLETE:  '[Foo] Search Complete',
// //   LOAD:             '[Foo] Load',
// // });
// // level 1 solution:
// const a = R.pipe(actionTp(tp), type);
// export const Types = {
//   SEARCH: a('Search'),
//   SEARCH_COMPLETE: a('Search Complete'),
//   LOAD: a('Load'),
// };
// // level 2 solution: needs ramda typings
// // export const Types = make.types(tp, ['Search', 'Load']);
// // separate Actions: used in components, though effects prefer actions paired with types
// let mk = R.curry(makeAction)(tp);
// export let actions = {
//   // level 1 solution
//   index: makeAction<string>(tp, 'index'),
//   // level 2 solution: depends on Ramda typings
//   create: mk<string>('create'),
// };
// Pairs version, offers greater convenience to reducers (packaged together, at cost of `.action` in each type)
var b = actions_1.makeBoth(tp);
exports.pairs = {
    search: b('Search'),
    searchComplete: b('Search Complete'),
};
// separating (automation needs heterogeneous map)
exports.Types = {
    search: exports.pairs.search.type,
    searchComplete: exports.pairs.searchComplete.type,
};
exports.actions = {
    search: exports.pairs.search.action,
    searchComplete: exports.pairs.searchComplete.action,
};
// // level 3 solution, all together:
// import { actionFactory, Action, Obj, Type } from './actions';
// let types = ['Search', 'Remove', 'Create', 'Update'];
// export default actionFactory('Foo', types);
