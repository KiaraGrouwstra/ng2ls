import * as R from 'ramda';
let $ = require('jquery');
import { Component, OpaqueToken } from '@angular/core';
import { ValidatorFn, FormBuilder, FormControl, FormArray, FormGroup, AbstractControl } from '@angular/forms';
// import { Maybe } from 'sanctuary';
// let CryptoJS = require('crypto-js');
import { Path, NestedArr, NestedObj, Obj, Pred, Type, ObjectMapper, Prop, StringLike, Fn } from './types';

require('materialize-css/dist/js/materialize.min');
// let YAML = require('yamljs');

// make an object from an array with mapper function
export let arr2obj = <T>(fn: (s: StringLike) => T) => (arr: StringLike[]): Obj<T> =>
    R.pipe(
      // Ramda issue... doesn't know what will go in so somehow decides on the last option, functor, while I need the first option, list
      // <(list: ArrayLike<StringLike>) => [string, T][]>
      // <[string, T][]>
      // R.map((k: StringLike): [string, T] => [k.toString(), fn(k)]),
      (list: StringLike[]): [string, T][] => list.map((k: StringLike): [string, T] => [k.toString(), fn(k)]),
      R.fromPairs
    )(arr);

// make a Map from an array with mapper function
export function arr2map<T,U>(arr: Array<T>, fn: (v: T) => U): Map<T,U> {
  return arr.reduce((map, k) => map.set(k, fn(k)), new Map());
}

// execute a function and return the input unchanged, to allow chaining
export function doReturn<T>(fn: (v: T) => void): (v: T) => T {
  return (v) => {
    fn(v);
    return v;
  };
}

// return the hash or get parts of a Location as an object
function urlBit(url: Obj<string>, part: string): Obj<string> {  // : Location
  let par_str = (<string> url[part]).substring(1);
  return fromQuery(par_str);
}

// convert a GET query string (part after `?`) to an object
export function fromQuery(str: string): Obj<string> {
  let params = decodeURIComponent(str).split('&');
  return R.fromPairs(params.map((s: string) => <[string, string]> s.split('=')));
}

// convert an object to a GET query string (part after `?`) -- replaces jQuery's param()
export function toQuery(obj: {}): string {
  let enc = R.map(decodeURIComponent)(obj);
  return R.toPairs(enc).map(R.join('=')).join('&');
}

// let range = (n) => Array(n).fill().map((x,i)=>i);
// let spawn_n = (fn, n = 5, interval = 1000) => range(n).forEach((x) => setTimeout(fn, x * interval));

// 'cast' a function such that in case it receives a bad (non-conformant)
// value for input, it will return a default value of its output type
// intercepts bad input values for a function so as to return a default output value
// ... this might hurt when switching to like Immutable.js though.
export function typed<T>(from: Type<any>[], to: Type<T>, fn: Fn<T>): Fn<T> { //T: (...) => to
  return function() {
    for (let i = 0; i < from.length; i++) {
      let frm = from[i];
      let v = arguments[i];
      if(frm && (R.isNil(v) || v.constructor != frm)) return <T> (new to).valueOf();
    }
    return callFn(fn, this, arguments);
  };
}

// wrapper for setter methods, return if not all parameters are defined
export function combine<T>(fn: Fn<T>, allow_undef: {[key: string]: boolean} = {}): (v: T) => void {
  return function() {
    // let names = /([^\(]+)(?=\))'/.exec(fn.toString()).split(',').slice(1);
    let names = fn.toString().split('(')[1].split(')')[0].split(/[,\s]+/);
    for (let i = 0; i < arguments.length; i++) {
      let v = arguments[i];
      let name = names[i]
        .replace(/_\d+$/, '')   // fixes SweetJS suffixing all names with like _123. this will however break functions already named .*_\d+, e.g. foo_123
        // do not minify the code while uing this function, it will break -- functions wrapped in combine will no longer trigger.
      if(typeof v === 'undefined' && !allow_undef[name]) return; // || R.isNil(v)
    }
    callFn(fn, this, arguments);  //return
  };
}

// simpler guard, just a try-catch wrapper with default value
export function fallback<T>(def: T, fn: Fn<T>): Fn<T> {  //fn: (...) => T
  return function() {
    try {
      return callFn(fn, this, arguments);
    }
    catch(e) {
      console.warn('an error occurred, falling back to default value:', e);
      return def;
    }
  };
}

// just log errors. only useful in contexts with silent crash.
export function tryLog<T>(fn: Fn<T>): Fn<T|undefined> {
  return function() {
    try {
      return callFn(fn, this, arguments);
    }
    catch(e) {
      console.warn('tryLog error:', e);
      return undefined;
    }
  };
}

// create a Component, decorating the class with the provided metadata
// export let FooComp = ng2comp({ component: {}, parameters: [], decorators: {}, class: class FooComp {} })
export function ng2comp<TComp extends Type<any>>(o: { component?: Component, parameters?: Array<OpaqueToken | never /*?*/>, decorators?: Obj<ClassDecorator>, class: TComp }): TComp {
  let { component = {}, parameters = [], decorators = {}, class: cls } = o;
  R.keys(decorators).forEach((k: string) => {
    Reflect.decorate([decorators[k]], cls.prototype, k);
  });
  return Object.assign(cls, {
    annotations: [new Component(component)],
    parameters: parameters.map(x => x instanceof OpaqueToken ? x : [x]),
  });
};

// find the index of an item within a Set (indicating in what order the item was added).
export function findIndexSet<T>(x: any, set: Set<T>): number {
  return Array.from(set).findIndex(y => y == x);
}

// editVals from elins; map values of an object using a mapper

// only keep properties in original object
export let editValsOriginal: ObjectMapper = R.curry((fnObj: Obj<Function>, obj: Obj<any>) => R.mapObjIndexed(<T>(v: T, k: string) => {
  let fn = fnObj[k];
  return fn ? fn(v) : v
})(obj));

// export let editVals = (fnObj) => (obj) => R.reduce((acc, fn, k) => _.update(k, fn(acc[k]))(acc), obj)(fnObj);
// ^ no k in FP
// keep all original properties, map even over keys not in the original object
export let editValsBoth: ObjectMapper = R.curry((fnObj: Obj<Function>, obj: Obj<any>) =>
    R.keys(fnObj).reduce((acc, k: string) => R.assoc(k, fnObj[k])(acc), obj));

// only keep properties in mapper object, map even over keys not in the original object
export let editValsLambda: ObjectMapper = R.curry((fnObj: Obj<Function>, obj: Obj<any>) => R.mapObjIndexed((fn: Function, k: string) => {
  let v = obj[k];
  return fn ? fn(v) : v
})(fnObj));

// split an object into its keys and values: `let [keys, vals] = splitObj(obj);`
export function splitObj(obj: {}): [string[], any[]] {
  return [R.keys(obj), R.values(obj)];
}

// http://www.2ality.com/2012/04/eval-variables.html
// evaluate an expression within a context (of the component)
export let evalExpr = (context: {}, vars: {} = {}) => (expr: string) => {
    let varArr = [context, vars];
    let propObj = Object.assign({}, ...[...varArr, ...varArr.map(x => Object.getPrototypeOf(x))]
        .map(x => arr2obj(k => x[k.toString()])(Object.getOwnPropertyNames(x))));
    let [keys, vals] = splitObj(propObj);
    let fn = Function.apply(context, keys.concat(`return ${expr}`));
    return fn.apply(context, vals);
}

// print a complex object for debugging -- regular log sucks cuz it elides values, JSON.stringify errors on cyclical structures.
export function print(k: string, v: {}): void {
  let cname = (v: any) => v ? <string> v.constructor.name : null;
  console.log(k, cname(v), R.map(cname)(v));
};

// transform a value while the predicate holds true
export function transformWhile<T>(predicate: Pred<T>, transformer: (v: T) => T, v: T): T {
  while(predicate(v)) {
    v = transformer(v);
  }
  return v;
}

// intended to allow sub-classing to create custom errors
export class ExtendableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

const isObject = R.both(R.is(Object), R.complement(R.is(Array)));

// extract any iterables wrapped in functions from a json structure as a collection of <path, iterable> tuples
export function extractIterables(v: any, path: Prop[] = [], iters: Array<[Path, any[]]> = []): Array<[Path, any[]]> {
  if(R.is(Array)(v)) {
    v.map((x: any, i: number) => extractIterables(x, path.concat(i), iters));
  } else if(isObject(v)) {
    R.mapObjIndexed((x: any, k: string) => extractIterables(x, path.concat(k), iters))(v);
  } else if(R.is(Function)(v)) {
    iters.push([path, v()]);
  }
  return iters;
}

// parameterize a JSON structure with variables (slots to be iterated over) into a function
export function parameterizeStructure(val: any, iterableColl: Array<[Path, any[]]>): Function {
  // go over the paths so as to unset each 'gap'
  let slotted = iterableColl.reduce((v, [path, iterable]) => R.assoc(path, undefined)(v), val);
  // make reducer iterating over paths to inject a value into each from a parameter
  return function() {
    let args = arguments;
    let paramColl = iterableColl.map(([path, iter], idx) => [path, args[idx]]);
    return paramColl.reduce((v, [path, param]) => R.assoc(path, param)(v), slotted);
  }
}

// encody a message by base64
export let encode = window.btoa;
// decody a message by base64
export let decode = window.atob;

export const MAX_ARRAY = 2**32-1;

// recursive structure of `ValidatorFn`; note arrays values won't translate to a list here.
export type ValidatorStruct = ValidatorFn | { [k: string]: ValidatorStruct };
// generate a form based on a value to edit (including arrays) and a `ValidatorStruct`.
// Matches up validator/control numbers by array sizes in the value.
// TODO: add `AsyncValidator`s, structure-level (as opposed to item-level) validators
// potentially add { sync, async } and { item, structure } wrappers in ValidatorStruct.
export function editCtrl(fb: FormBuilder, val: any, vldtr: ValidatorStruct): AbstractControl {
  return isObject(val) ? fb.group(R.mapObjIndexed((v: any, k: string) => editCtrl(fb, v, (<{ [k: string]: ValidatorStruct }>vldtr)[k]))(val)) :
      R.is(Array)(val) ? fb.array(val.map((v: any, i: number) => editCtrl(fb, v, <ValidatorFn>vldtr))) :
      fb.control(val, <ValidatorFn>vldtr);
}
// ^ still UNUSED, but needed to load in existing values to edit!

type _mapNestedFn<T,U> = (v: T, path: Path) => U;

/**
 * map the contents of a nested yet otherwise homogeneous array (e.g. [1, [[2], 3]])
 */
export let mapNestedArr = <T,U>(f: _mapNestedFn<T,U>, v: NestedArr<T>, path: Prop[] = []): NestedArr<U> => v.map((x: T|NestedArr<T>, i: number) =>
    mapNestedArr_(f, x, path.concat(i)));
let mapNestedArr_ = <T,U>(f: _mapNestedFn<T,U>, v: NestedArr<T>|T, path: Prop[] = []): NestedArr<U>|U =>
    R.is(Array)(v) ? (<NestedArr<T>> v).map((x: T|NestedArr<T>, i: number) => mapNestedArr_(f, x, path.concat(i))) :
    f(<T>v, path);

/**
 * map the contents of a nested yet otherwise homogeneous object (e.g. { a: 1, z: { y: { b: 2 }, c: 3 } })
 */
export let mapNestedObj = <T,U>(f: _mapNestedFn<T,U>, v: NestedObj<T>, path: Prop[] = []): NestedObj<U> =>
    R.mapObjIndexed((x: T|NestedObj<T>, k: string) => mapNestedObj_(f, x, path.concat(k)))(v);
let mapNestedObj_ = <T,U>(f: _mapNestedFn<T,U>, v: NestedObj<T>|T, path: Prop[] = []): NestedObj<U>|U =>
    R.is(Object)(v) ? R.mapObjIndexed((x: T|NestedObj<T>, k: string) => mapNestedObj_(f, x, path.concat(k)))(<NestedObj<T>> v) :
    f(<T>v, path);

// export let mapNestedBoth = ...

export let falsy = R.either(R.isEmpty, R.isNil);
export let truthy = R.complement(falsy); // differs from JS's 'truthy': []/{} -> false.

// look up the property corresponding to a string in a lookup object
export let lookup = R.flip(R.prop);
// lookup with fallback to key
export let lookupOr = R.curry((o: Object, k: string) => lookup(o, k) || k);

// // bypass Angular security (aimed at user-supplied data) for safe hardcoded values
// const safe = R.objOf('changingThisBreaksApplicationSecurity');

export let callFn = <T>(fn: Fn<T>, thisArg: any, args: IArguments): T => Function.call(fn, thisArg, ...Array.prototype.slice.call(args));
