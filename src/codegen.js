import * as R from 'ramda';
import { Type, Obj, Action } from './models/models';

// group: string,
var codeGenAction = (typeObj /*: Obj<string> */) => {
  let pairs = R.pipe(
    R.mapObjIndexed((tp /*: string */, k) => `  ${k}: b<${tp}>('${k}'),\n`),
    R.values,
    R.join(''),
  )(typeObj);
  let keys = R.keys(typeObj);
  let types = keys.map((k) => `  ${k}: pairs.${k}.type,\n`).join('');
  let actions = keys.map((k) => `  ${k}: pairs.${k}.action,\n`).join('');
  let type = keys.map((k) => `typeof actions.${k}`).join('\n  | ');
  return `
export let pairs = {
${pairs}
};

export const Types = {
${types}
};

export let actions = {
${actions}
};

export type Actions
  = ${type};
`;
}
// codeGenAction({ search: 'string', searchComplete: 'string' });


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
