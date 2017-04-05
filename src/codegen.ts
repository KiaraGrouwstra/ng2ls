import * as R from 'ramda';
import { Obj } from './models/models';
import { prettyStringify } from './node-utils';
import { trace, firstUpper } from './util';

const renameBy = R.curry(<T>(fn: (v: any) => string, obj: Obj<T>): Obj<T> => <any>R.pipe(<any>R.toPairs, <any>R.map(R.adjust(fn, 0)), <any>R.fromPairs)(obj));
const getNames: (o: Obj<any>) => string = R.pipe(R.keys, R.join(', '));
const mapLines = (f: (v: any, k: string) => string) => R.pipe(R.mapObjIndexed(f), R.values, R.join('\n'));
const getReducers = (domain, forActions = false) => {
  const processEffect = (effect, k: string) => R.pipe(
    R.pick(['ok', 'fail']),
    renameBy(R.pipe(firstUpper, R.concat(k))),
    R.when(() => forActions, R.merge(<any>{ [k]: effect.fn })),
  )(effect);
  let effectReducers = R.pipe(R.mapObjIndexed(processEffect), R.values, R.mergeAll)(domain.effects);
  return R.merge(<any>domain.reducers, <any>effectReducers);
}

// group: string,
export function actions(domain, name/*: string*/): string {
  let reducers /*: Obj<string> */ = R.map(R.head)(getReducers(domain, true));
  // let fnName = 'f';
  let { models } = domain;
  let names = R.map(getNames)({ models, reducers });
  let keys = R.keys(reducers);
  let maxLength = keys.map(R.length).reduce(R.max, 0);
  const pad = (k: string) => k + <any>R.repeat(' ', <any>maxLength - k.length).join('');
  const leftPad = (k: string) => <any>R.repeat(' ', <any>maxLength - k.length).join('') + k;
  let classes = mapLines((tp /*: string */, k) => 
`export class ${leftPad(k)} { type = Types.${pad(k)}; constructor(public payload: ${tp}) {} }` // Action
  )(reducers);
  // let pairs = mapLines((tp /*: string */, k) => `  ${pad(k)}: ${fnName}<${tp}>('${k}'),`)(reducers);
  let types = keys.map((k) =>
    `  ${pad(k)}: tp('${k}'),\n` // ${pad(k)}.type // type('[${name}] ${k}')
  ).join('');
  let actionStr = keys.map((k) => `${k}`).join(', '); // Action
  let type = keys.map((k) =>
    // `typeof ${k}`
    `${k}` // Action
  ).join(' | '); // \n 
  let dispatcherStr = mapLines((tp /*: string */, k) => {
    return `     ${pad(k)}: (pl: ${tp}) => do(${pad(k)}(pl)),`;
  })(reducers);
// export let pairs = {\n${pairs}\n};\n
// import { makeBoth } from '../../actions';
// const ${fnName} = makeBoth(tp);
// let { ${names.reducers} } = pairs;\n
// const tp = '${name}';\n
  return `
import { type } from '../util';
import { ${names.models} } from './models/${name}';\n
const tp = (k: string) => type('[${name}] '+k);
export const Types = {\n${types}};\n
${classes}\n
export let actions = { ${actionStr} };
export type Actions = ${type};\n
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
    let { init, debounce, read, fallback, fail, ok, fn: [tp, f] } = effect;
    let failAction = fail && getAction(`${k}Fail`);
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

export function reducers(domain/*: DomainMeta*/, name: string): string {
  let { state, init, selectors, effects, models } = domain;
  let isInterface = state[0] == '{';
  let reducers = getReducers(domain);
  let names = R.map(getNames)({ selectors, reducers, models });
  let actionsName = 'actions'; // `${name}Actions`
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

import { ${names.models} } from './models/${name}';
import { Types as ${actionsName} } from '../actions/${name}';
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
