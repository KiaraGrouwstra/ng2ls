import { makeBoth } from '../../actions';
const tp = 'foo';

const f = makeBoth(tp);
export let pairs = {
  add: f<number>('add'),
  subtract: f<number>('subtract'),
};

export const Types = {
  add: pairs.add.type,
  subtract: pairs.subtract.type,
};

export let actions = {
  add: pairs.add.action,
  subtract: pairs.subtract.action,
};

export type Actions
  = typeof actions.add
  | typeof actions.subtract;
