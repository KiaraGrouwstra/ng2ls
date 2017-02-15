import * as R from 'ramda';
// import * as jQuery from 'jquery';
import { Obj } from './models/models';

// coerces an action label string into a string literal, enabling typechecking (TS2.0 tagged union types), and ensuring uniqueness
let typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }
  typeCache[<string>label] = true;
  return <T>label;
}

// convert an array to an object based on a lambda
export let arr2obj = <T>(fn: (k: string) => T) => R.pipe(R.map((k: string) => [k, fn(k)]), R.fromPairs);

export let json = JSON.parse;
// convert a class instance to a pojo
export let pojofy = R.pipe(JSON.stringify, JSON.parse);

// debug logging for FP (composition chains)
export let trace = R.curry((tag: string, x: any) => {
  console.log(tag, x);
  return x;
});

// export let toQuery = jQuery.param;
export let toQuery: (obj: Obj<any>) => string = R.pipe(R.toPairs, R.map(R.join('=')), R.join('&'));
// create a url with query params from an object
export function makeUrl(url: string, pars = {}): string {
  return R.keys(pars).length ? `${url}?${toQuery(pars)}` : url;
}

// convert query/hash params to an object
export let fromParams: (str: string) => Obj<string> = R.pipe(
  R.defaultTo(''),
  R.split('&'),
  R.map(
    R.pipe(
      R.split('='),
      // maybe it's different in variable size array and fixed size array to type inferring
      (parts: string[]):[any, any] => [parts[0], parts[1]]
    )
  ),
  R.fromPairs,
  R.map(decodeURIComponent),
);
