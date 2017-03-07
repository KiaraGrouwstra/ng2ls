import * as R from 'ramda';
// import { Type, Obj, Action } from './models/models';
import { prettyStringify } from './node-utils';
let firstUpper = (s) => R.toUpper(R.head(s)) + R.tail(s);

// group: string,
export var codeGenAction = (typeObj /*: Obj<string> */, name/*: string*/) => {
  let fnName = 'f';
  let pairs = R.pipe(
    R.mapObjIndexed((tp /*: string */, k) => `  ${k}: ${fnName}<${tp}>('${k}'),\n`),
    R.values,
    R.join(''),
  )(typeObj);
  let keys = R.keys(typeObj);
  let types = keys.map((k) => `  ${k}: pairs.${k}.type,\n`).join('');
  let actions = keys.map((k) => `  ${k}: pairs.${k}.action,\n`).join('');
  let type = keys.map((k) => `typeof actions.${k}`).join('\n  | ');
  return `
import { makeBoth } from '../../actions';
const tp = '${name}';\n
const ${fnName} = makeBoth(tp);
export let pairs = {\n${pairs}};\n
export const Types = {\n${types}};\n
export let actions = {\n${actions}};\n
export type Actions
  = ${type};
`.substr(1);
}
// codeGenAction({ search: 'string', searchComplete: 'string' }, 'Foo');

export var codeGenEffect = (effects: { [k: string]: any /*EffectMeta*/ }, name: string) => {
  let effectStr = R.pipe(R.toPairs, R.map(([k, effect]: [string, any /*EffectMeta*/]) => {
    const getAction = (k: string) => `actions.${name}.${k}`;
    let { init, debounce, read, fallback, fail, complete, fn } = effect;
    let failAction = fail && getAction(`${k}Failure`);
    let opts = { init, debounce, read, fallback, failAction };
    let optStr = R.pipe(
      R.pickBy(R.complement(R.isNil)),
      prettyStringify,
      R.replace(/failAction: '(.+?)'/g, 'failAction: $1'),
    )(opts);
    return `    @Effect() ${k}$ = makeEffect(${getAction(k)}, ${getAction(`${k}Complete`)}, ${fn}, ${optStr});\n`;
  }), R.join('\n'))(effects);
  return `
import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { actions } from './actions';

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

/**
 * generate the code for the pure pipes described in an object
 */
// : (fnObj: Obj<string>) => string
var codeGenPipe = R.pipe(
  // fn: string, k: string
  R.mapObjIndexed((fn, k) => `
@Pipe({name:'${k}'})
export class ${firstUpper(k)}Pipe implements PipeTransform {
  transform = ${fn};
}

`),
  R.values,
  R.join('')
);

// trick to type `R.map(f, { a: b })`: use codegen to write let obj = `(f) => ({ a: f(b) })`, then use with `obj(f)`

const wrapMap = (o) => `(f = R.identity) => ({\n${R.pipe(R.toPairs, R.map(([k, v]) => `  ${k}: f(${JSON.stringify(v)}),`), R.join('\n'))(o)}\n})`;
const wrapMapObjIndexed = (o) => `(f = R.identity) => ({\n${R.pipe(R.toPairs, R.map(([k, v]) => `  ${k}: f(${JSON.stringify(v)}, ${JSON.stringify(k)}),`), R.join('\n'))(o)}\n})`;

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
