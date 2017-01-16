"use strict";
// import * as R from 'ramda';
var actions_1 = require("./actions");
var util_1 = require("../util");
var FOO = 'foo';
var fixt = { type: '[book] create', payload: FOO };
var checkAction = function (a, b) { return expect(util_1.pojofy(a)).toEqual(util_1.pojofy(b)); };
describe('makeAction', function () {
    it('should create an ActionClass', function () {
        // let cls = makeAction('book', 'create');
        var cls = actions_1.makeAction('book', 'create');
        checkAction(new cls(FOO), fixt);
    });
});
// from down here it gets too smart for TS to follow currently:
describe('actionFactory', function () {
    it('should create actions in batch', function () {
        var cls = actions_1.actionFactory('book', ['create']).actions.create;
        checkAction(new cls(FOO), fixt);
    });
});
describe('mapSyncActions', function () {
    it('should create actions in batch', function () {
        var cls = actions_1.mapSyncActions({ book: ['create'] }).book.create;
        checkAction(new cls(FOO), fixt);
    });
});
describe('mapAsyncActions', function () {
    it('should create actions in batch', function () {
        // let cls = mapActions({ book: ['create'] }).book.create;
        var cls = actions_1.mapAsyncActions({ book: ['create'] }).book.actions.create;
        checkAction(new cls(FOO), fixt);
    });
});
