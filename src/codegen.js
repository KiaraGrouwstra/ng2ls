import * as R from 'ramda';
// import { Type, Obj, Action } from './models/models';

// group: string,
var codeGenAction = (typeObj /*: Obj<string> */, name/*: string*/) => {
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
import { makeBoth } from './actions';
const tp = '${name}';

const ${fnName} = makeBoth(tp);
export let pairs = {\n${pairs}};

export const Types = {\n${types}};

export let actions = {\n${actions}};

export type Actions
  = ${type};
`;
}
// codeGenAction({ search: 'string', searchComplete: 'string' }, 'Foo');


let firstUpper = (s) => R.toUpper(R.head(s)) + R.tail(s);
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
