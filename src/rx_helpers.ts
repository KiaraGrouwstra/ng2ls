import * as R from 'ramda';
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';
// import { EventEmitter } from '@angular/core';

// // append to array:
export function elemToArr<T>(arr: Array<T>, x: T): Array<T> {
  // concatenates arrays rather than pushing them as a single item
  return arr.concat(x);
  // // overwrites the old value
  // arr.push(x);
  // return arr;
  // // slower, but no overriding and arrays become one item
  // let c = R.cloneDeep(arr);
  // c.push(x);
  // return c;
}
export function arrToArr<T,U>(a: Array<T|U>, b: Array<U>): Array<T|U> {
  return a.concat(b);
}
// // append to Set:
export function elemToSet<T>(set: Set<T>, x: T): Set<T> {
  return set.add(x);
}
export function arrToSet<T,U>(set: Set<T|U>, arr: Array<U>): Set<T|U> {
  return arr.reduce((set, x) => set.add(x), set);
}
export function setToSet<T,U>(a: Set<T|U>, b: Set<U>): Set<T|U> {
  // return new Set(function*() { yield* a; yield* b; }());
  return new Set([...Array.from(a), ...Array.from(b)]);
}

// set of logging functions to use in Observable.subscribe (see `notify`)
export function loggers(kw: string = 'obs'): [(v: any) => void, (e: string) => void, () => void] {
  return [
    v => console.log(kw + " next", v),
    e => console.error(kw + " error", e),
    () => console.log(kw + " done"),
  ];
}

// log an Observable's values
export function notify(kw: string, obs: Observable<any>): Subscription {
  let [next, complete, error] = loggers(kw);
  return obs.subscribe(next, complete, error);
}

// generalizes combineLatest from 2 Observables to an array of n: combLastObs([a$, b$]).map([a, b] => ...)
export function combLastObs(arr: Observable<any>[]): Observable<any> {
  return arr.reduce((obj_obs, v, idx) => {
  	  let combiner = (obj: Object, val: any) => Object.assign(obj, {[idx]: val});
      return R.hasProp('subscribe', v) ?
        obj_obs.combineLatest(v, combiner) :
        obj_obs.map(obs => combiner(obs, v));
  	},
    new BehaviorSubject({})
  ).map(r => R.values(r))
}

// maps the latest values of a set of Observables to a lambda
export function mapComb(arr: Observable<any>[], fn: Function): Observable<any> {
  return combLastObs(arr).map(r => fn(...r));
}

// use the latest values of a set of Observables to subscribe to a lambda
export function subComb(arr: Observable<any>[], fn: Function): Subscription {
  return combLastObs(arr).subscribe(r => fn(...r));
}
