"use strict";
var R = require("ramda");
var util_1 = require("../util");
;
exports.toPayload = function (action) { return action.payload; };
// create an action type string
exports.actionTp = R.curry(function (typeName, action) { return "[" + typeName + "] " + action; }); // type()
// create the Complete string for an action
var derivedAction = R.map(function (tp) {
    return function (action) { return action + "_" + tp; };
})({
    complete: 'Complete',
    fail: 'Failed',
});
// create an action class
function makeAction(typeName, actionName) {
    var tn = exports.actionTp(typeName, actionName);
    return (function () {
        function class_1(payload) {
            this.payload = payload;
            this.type = tn;
        }
        return class_1;
    }());
}
exports.makeAction = makeAction;
exports.make = {
    actions: function (name, actions) { return util_1.arr2obj(function (action) { return makeAction(name, action); })(actions); },
    // ^ where to get this T?: http://orizens.com/wp/topics/simple-action-creators-for-ngrxstore-in-angular-2/
    types: function (name, actions) { return R.fromPairs(actions.map(function (act) { return [act.toUpperCase(), exports.actionTp(name, act)]; })); },
};
// create actions for given types and a name
exports.actionFactory = function (name, actions) { return R.map(function (fn) { return fn(name, actions); })(exports.make); };
// create actions for given types and a name
function effectfulAction(types) {
    var reducer = function (arr, fn) { return arr.concat(types.map(fn, types)); };
    return R.values(derivedAction).reduce(reducer);
}
exports.effectfulAction = effectfulAction;
// create actions in batch
exports.mapSyncActions = R.mapObjIndexed(R.flip(exports.actionFactory));
exports.mapAsyncActions = R.mapObjIndexed(function (v, k) { return R.pipe(effectfulAction, R.curry(exports.actionFactory)(k))(v); });
// attempt to flip the structure to put actions and their types together
// make an action pair (type string / Action ctor)
// export let makeBoth = R.curry(<T>(name: string, action: string): ActionPair<T> => ({
exports.makeBoth = function (name) { return function (action) { return ({
    type: exports.actionTp(name, action),
    action: makeAction(name, action),
}); }; };
// make pairs in batch. missing types!
exports.pairFactory = function (name, actions) { return actions.map(function (a) { return exports.makeBoth(name)(a); }); };
exports.pairObjFactory = function (name, actions) { return util_1.arr2obj(function (a) { return exports.makeBoth(name)(a); })(actions); };
/*
let baseline = class { type = 'shoe'; constructor(public payload: string) {} };
let improved = makeAction<string>('shoe', 'make');

// attempt to preserve typing through data structures:

export interface Tp<T> {
  tp: T;
}
let c = <T>(): Type<Tp<T>> => class implements Tp<T> {
  tp: T;
}
let tpCls = c<string>();
// v like makeAction<T>, except in that it has converted the type parameter into a function parameter.
// this allows one to use values from data structures rather than having to manually invoke each time.
let makeTypedAction = <T>(typeName: string, actionName: string, cls: Type<Tp<T>>): ActionCtor<T> => makeAction<T>(typeName, actionName);
let typedAction = makeTypedAction('shoe', 'make', c<string>());
// ^ note this is no step up over `makeAction` syntax-wise, and the use-case of being able to store the type in data structures depends on TS support for heterogeneous map()...
// v failed attempt to factor out function application:
// let unfinished = c<string>;
// let typedAction2 = makeTypedAction('shoe', 'make', unfinished());

// INFO LOSS: <any>?, ActionInfo with ActionClass rather than heterogeneous object of MyAction<T>
// create actions for given types and a name
export let typedActionFactory = (name: string, actions: Obj<Type<Tp<any>>>): ActionInfo => ({
  actions: R.mapObjIndexed((cls: Type<Tp<any>>, action: string) => makeTypedAction(name, action, cls))(actions),
  types: R.fromPairs(R.keys(actions).map((act: string): [string, string] => [act.toUpperCase(), actionTp(name, act)])),
});
// typedActionFactory('shoe', { make: c<string>() });

// INFO LOSS: no way TS can follow key mutations
export let mapKeys = R.curry((fn: (str: string) => string, obj: Object) => R.zipObj(R.map(fn, R.keys(obj)), R.values(obj)));
// create actions for given types and a name
// INFO LOSS: reduce, mapKeys, probably merge
export function typedEffectfulAction(types: Obj<Type<Tp<any>>>): Obj<Type<Tp<any>>> {
  let reducer = (obj: Obj<Type<Tp<any>>>, fn: (action: string) => string) => R.merge(mapKeys(fn)(obj))(obj);
  return R.values(derivedAction).reduce(reducer, types);
}

// create actions in batch
// INFO LOSS: heterogeneous map
export let mapTypedSyncActions: (actionGroups: Obj<Obj<Type<Tp<any>>>>) => Obj<ActionInfo> =
    R.mapObjIndexed(R.flip(typedActionFactory));
export let mapTypedAsyncActions: (actionGroups: Obj<Obj<Type<Tp<any>>>>) => Obj<ActionInfo> =
    R.mapObjIndexed((v: Obj<Type<Tp<any>>>, k: string): ActionInfo => R.pipe(typedEffectfulAction, R.curry(typedActionFactory)(k))(v));
*/
