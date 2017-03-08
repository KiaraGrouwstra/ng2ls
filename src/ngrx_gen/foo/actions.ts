import { makeBoth } from '../../actions';
const tp = 'foo';

const f = makeBoth(tp);
export let pairs = {
  add     : f<number>('add'),
  subtract: f<number>('subtract'),
  log     : f<number>('log'),
  logOk   : f<number>('logOk'),
  logNg   : f<string>('logNg'),
  bar     : f<number>('bar'),
  barOk   : f<number>('barOk'),
};

let { add, subtract, log, logOk, logNg, bar, barOk } = pairs;

export const Types = {
  add     : add     .type,
  subtract: subtract.type,
  log     : log     .type,
  logOk   : logOk   .type,
  logNg   : logNg   .type,
  bar     : bar     .type,
  barOk   : barOk   .type,
};

export let actions = {
  add     : add     .action,
  subtract: subtract.action,
  log     : log     .action,
  logOk   : logOk   .action,
  logNg   : logNg   .action,
  bar     : bar     .action,
  barOk   : barOk   .action,
};

export type Actions
  = typeof add     .action
  | typeof subtract.action
  | typeof log     .action
  | typeof logOk   .action
  | typeof logNg   .action
  | typeof bar     .action
  | typeof barOk   .action;

// usage in component ctor: 'Object.assign(this, dispatchers(store));' or 'this.foo = dispatchers(store);'
export let dispatchers = (store: Observable<Actions>) => {
  let do = store.dispatch.bind(store);
  return {
     add     : (pl: number) => do(add     .action(pl)),
     subtract: (pl: number) => do(subtract.action(pl)),
     log     : (pl: number) => do(log     .action(pl)),
     logOk   : (pl: number) => do(logOk   .action(pl)),
     logNg   : (pl: string) => do(logNg   .action(pl)),
     bar     : (pl: number) => do(bar     .action(pl)),
     barOk   : (pl: number) => do(barOk   .action(pl)),
};
