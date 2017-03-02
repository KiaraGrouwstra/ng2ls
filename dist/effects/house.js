"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _this = this;
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/startWith');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/toArray');
require('rxjs/add/operator/debounceTime');
var R = require('ramda');
var db_1 = require('@ngrx/db');
var Observable_1 = require('rxjs/Observable');
var of_1 = require('rxjs/observable/of');
var defer_1 = require('rxjs/observable/defer');
var empty_1 = require('rxjs/observable/empty');
var effects_1 = require('./effects');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var effects_2 = require('@ngrx/effects');
var actions_1 = require('../actions/actions');
var actions_2 = require('../actions');
// const book = { SearchAction: class SearchAction { type = 'search'; constructor(public payload: string) {}; } };
// const { SearchAction } = book;
var SearchAction = (function () {
    function SearchAction(payload) {
        this.payload = payload;
        this.type = 'search';
    }
    ;
    return SearchAction;
}());
var collection = {
    LoadAction: (function () {
        function LoadAction(payload) {
            this.payload = payload;
            this.type = 'load';
        }
        ;
        return LoadAction;
    }()),
    LoadFailAction: (function () {
        function LoadFailAction(payload) {
            this.payload = payload;
            this.type = 'LoadFailAction';
        }
        ;
        return LoadFailAction;
    }()),
};
var foo_1 = require('../actions/foo');
// import { TokenService } from '../services'; //, HouseService
var HouseService = (function () {
    function HouseService() {
    }
    HouseService.prototype.query = function () { return Observable_1.Observable.of([]); };
    return HouseService;
}());
exports.HouseService = HouseService;
;
// import { API_DOMAIN } from '../../constants';
var API_DOMAIN = 'http://www.example.com/';
// let fetchDevice = ({ payload: deviceId }) => this.http.get(`${API_DOMAIN}/api/devices/wpu/${deviceId}/overview`);
var HouseEffects = (function () {
    function HouseEffects(http, actions$, // Observable<>
        houseService, db) {
        var _this = this;
        this.http = http;
        this.actions$ = actions$;
        this.houseService = houseService;
        this.db = db;
        /**
         * `dispatch`: doesn't yield actions back to the store so ignore. `defer` makes an observable when subscribed to.
         */
        this.openDB$ = defer_1.defer(function () {
            return _this.db.open('books_app');
        });
        this.search$ = this.actions$
            .ofType(actions_2.actions.houses.types.SEARCH)
            .startWith(new collection.LoadAction()) // trigger this effect immediately on startup
            .debounceTime(300)
            .map(function (action) { return action.payload; }) // book.
            .switchMap(function (projectId) {
            if (projectId === '') {
                return empty_1.empty();
            }
            return _this.http.get(API_DOMAIN + "/api/projects/" + projectId + "/houses");
            // return this.houseService.query()
        })
            .map(effects_1.unJson)
            .map(function (d) { return new actions_2.actions.houses.actions.Search_Complete(d); })
            .catch(function (error) { return of_1.of(new collection.LoadFailAction(error)); }); // vs. Success
        this.search$2 = makeEffect(foo_1.pairs.search, foo_1.pairs.search.action, function (s) { return of_1.of(s); });
        this.search$3 = makeEffect(actions_2.actions.houses.search, actions_2.actions.houses.searchComplete, function (projectId) { return !projectId ? empty_1.empty() : _this.houseService.query(); });
    }
    __decorate([
        effects_2.Effect({ dispatch: false }), 
        __metadata('design:type', Observable_1.Observable)
    ], HouseEffects.prototype, "openDB$", void 0);
    __decorate([
        effects_2.Effect(), 
        __metadata('design:type', Observable_1.Observable)
    ], HouseEffects.prototype, "search$", void 0);
    __decorate([
        // vs. Success
        effects_2.Effect(), 
        __metadata('design:type', Object)
    ], HouseEffects.prototype, "search$2", void 0);
    __decorate([
        effects_2.Effect(), 
        __metadata('design:type', Object)
    ], HouseEffects.prototype, "search$3", void 0);
    HouseEffects = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, effects_2.Actions, HouseService, db_1.Database])
    ], HouseEffects);
    return HouseEffects;
}());
exports.HouseEffects = HouseEffects;
var makeEffect = function (pair, completeAction, mapper, opts) {
    if (opts === void 0) { opts = {}; }
    var init = opts.init, debounce = opts.debounce, read = opts.read, fallback = opts.fallback, failAction = opts.failAction;
    var actions$ = _this.actions$;
    var filtered = actions$.ofType(pair.type); // could the exact action be inferred using a string-based lookup?
    var initialized = init ? filtered.startWith(new (pair.action)(init)) : filtered;
    var payload = initialized
        .debounceTime(debounce || 0)
        .map(actions_1.toPayload);
    var mapped = read ? payload.switchMap(mapper) : payload.mergeMap(mapper); // switchMap cancels previous results
    var defaulted = !R.isNil(fallback) ? mapped.catch(function () { return (Observable_1.Observable.of(fallback)); }) : mapped;
    var created = defaulted.map(function (d) { return new completeAction(d); });
    var caught = failAction instanceof Object ? created.catch(function (error) { return of_1.of(new failAction(error)); }) : created;
    return caught;
};
