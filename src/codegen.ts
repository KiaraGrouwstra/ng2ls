import * as R from 'ramda';
import { Obj } from './models/models';
import { prettyStringify } from './node-utils';
import { trace } from './util';

const renameBy = R.curry(<T>(fn: (v: any) => string, obj: Obj<T>): Obj<T> => <any>R.pipe(<any>R.toPairs, <any>R.map(R.adjust(fn, 0)), <any>R.fromPairs)(obj));
const firstUpper = (s: string): string => R.toUpper(R.head(s)) + R.tail(s);
const getNames: (o: Obj<any>) => string = R.pipe(R.keys, R.join(', '));
const mapLines = (f: (v: any, k: string) => string) => R.pipe(R.mapObjIndexed(f), R.values, R.join('\n'));
const getReducers = (domain, forActions = false) => {
  const processEffect = (effect, k: string) => R.pipe(
    R.pick(['ok', 'ng']),
    renameBy(R.pipe(firstUpper, R.concat(k))),
    R.when(() => forActions, R.merge(<any>{ [k]: effect.fn })),
  )(effect);
  let effectReducers = R.pipe(R.mapObjIndexed(processEffect), R.values, R.mergeAll)(domain.effects);
  return R.merge(<any>domain.reducers, <any>effectReducers);
}

// group: string,
export function actions(domain, name/*: string*/): string {
  let typeObj /*: Obj<string> */ = R.map(R.head)(getReducers(domain, true));
  let fnName = 'f';
  let keys = R.keys(typeObj);
  let maxLength = keys.map(R.length).reduce(R.max, 0);
  const pad = (k: string) => k + <any>R.repeat(' ', <any>maxLength - k.length).join('');
  let pairs = mapLines((tp /*: string */, k) => `  ${pad(k)}: ${fnName}<${tp}>('${k}'),`)(typeObj);
  let types = keys.map((k) => `  ${pad(k)}: ${pad(k)}.type,\n`).join('');
  let actionStr = keys.map((k) => `  ${pad(k)}: ${pad(k)}.action,\n`).join('');
  let type = keys.map((k) => `typeof ${pad(k)}.action`).join('\n  | ');
  let dispatcherStr = mapLines((tp /*: string */, k) => {
    return `     ${pad(k)}: (pl: ${tp}) => do(${pad(k)}.action(pl)),`;
  })(typeObj);
  return `
import { makeBoth } from '../../actions';
const tp = '${name}';\n
const ${fnName} = makeBoth(tp);
export let pairs = {\n${pairs}\n};\n
let { ${keys.join(', ')} } = pairs;\n
export const Types = {\n${types}};\n
export let actions = {\n${actionStr}};\n
export type Actions
  = ${type};\n
// usage in component ctor: 'Object.assign(this, dispatchers(store));' or 'this.${name} = dispatchers(store);', then use the functions to dispatch actions
export let dispatchers = (store: Observable<Actions>) => {
  let do = store.dispatch.bind(store);
  return {\n${dispatcherStr}\n};
`.substr(1);
// export let dispatchers = (store: Observable<Actions>) => R.map(R.pipe(f, store.dispatch.bind(store)))(actions);\n
}
// codeGenAction({ search: 'string', searchOk: 'string' }, 'Foo');

export function effects(domain, name: string): string {
  let effectStr = mapLines((effect: any /*EffectMeta*/, k: string) => {
    const getAction = (k: string) => `${name}.${k}`;
    let { init, debounce, read, fallback, ng, ok, fn: [tp, f] } = effect;
    let failAction = ng && getAction(`${k}Ng`);
    let opts = { init, debounce, read, fallback, failAction };
    let optStr = R.pipe(
      R.pickBy(R.complement(R.isNil)),
      prettyStringify,
      R.replace(/failAction: '(.+?)'/g, 'failAction: $1'),
    )(opts);
    return `  @Effect() ${k}$ = makeEffect(${getAction(k)}, ${getAction(`${k}Ok`)}, ${f}, ${optStr});\n`;
  })(<{ [k: string]: any /*EffectMeta*/ }> domain.effects);
  return `
import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { actions } from './actions';
let { ${name} } = actions;

@Injectable()
export class ${firstUpper(name)}Effects {

  constructor(
    private http: Http,
    private actions$: Actions,
  ) {}

${effectStr}
}
`.substr(1);
}
// codeGenEffect({ search: {...} }, 'houses');
// TODO: effects like [this](https://github.com/ngrx/example-app/blob/17a1987ee037f7f3d91bbe7df5e1d70e14ca3c77/src/app/effects/collection.ts#L32-L35). I'll need to find their pattern first...

export function reducers(domain/*: DomainMeta*/, domainName: string): string {
  let { state, init, selectors, effects, models } = domain;
  let isInterface = state[0] == '{';
  let reducers = getReducers(domain);
  let names = R.map(getNames)({ selectors, reducers, models });
  let actionsName = 'actions'; // `${domainName}Actions`
  let selectorStr = mapLines((selector, k: string) => {
    let f = !R.is(Array)(selector) ? `R.map(${selector})` : (([deps, fn]) =>
      `combineSelectors([${deps.join(', ')}], ${fn})`
    )(selector);
    return `let ${k} = ${f};`;
  })(selectors);
  let reducerStr = mapLines((reducer, k: string) => {
    let [tp, f]: [string, string] = reducer;
    return `  [${k}]: ${f},`;
  })(reducers);
  return `
import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { combineSelectors } from '../reducers';

import { ${names.models} } from '../models/${domainName}';
import { ActionTypes as ${actionsName} } from '../actions/${domainName}';
let { ${names.reducers} } = ${actionsName};\n
export ${ isInterface ? `interface State ${state}` : `type State = ${state};`}\n
export const initialState: State = ${init};\n
export let reducers = {\n${reducerStr}\n};\n
${selectorStr}\n
export let selectors = { ${names.selectors} };
`.substr(1);
}

export function models(domain/*: DomainMeta*/): string {
  return mapLines((model, k: string) => {
    // return `export type ${k} = ${model};\n`;
    return `export interface ${k} ${model}\n`;
  })(domain.models);
}

/**
 * generate the code for the pure pipes described in an object
 */
export function pipes(fnObj: Obj<string>): string {
  //  implements PipeTransform
  return mapLines((fn: string, k: string) => `
@Pipe({name:'${k}'})
export class ${firstUpper(k)}Pipe {
  transform = ${fn};
}
`.substr(1))(fnObj);
}

// trick to type `R.map(f, { a: b })`: use codegen to write let obj = `(f) => ({ a: f(b) })`, then use with `obj(f)`

const wrapMap = (o): string => `(f = R.identity) => ({\n${R.pipe(R.toPairs, R.map(([k, v]) => `  ${k}: f(${JSON.stringify(v)}),`), R.join('\n'))(o)}\n})`;
const wrapMapObjIndexed = (o): string => `(f = R.identity) => ({\n${R.pipe(R.toPairs, R.map(([k, v]) => `  ${k}: f(${JSON.stringify(v)}, ${JSON.stringify(k)}),`), R.join('\n'))(o)}\n})`;

// // usage:
// let o = { a: 'foo' };
// wrapMap(o);
// "(f = R.identity) => ({
//   a: f("foo"),
// })"
// // call with default R.identity: returns original object
// wrapMapObjIndexed(o);
// "(f = R.identity) => ({
//   a: f("foo", "a"),
// })"
// // call with default R.identity: returns original object
