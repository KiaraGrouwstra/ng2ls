"use strict";
var actions_1 = require('./actions');
var defaultActions = [
    'Search',
];
var types = {
    foos: ['Overview'],
};
exports.actions = actions_1.mapAsyncActions(types);
// export let bars = actionFactory('bars', defaultActions);
