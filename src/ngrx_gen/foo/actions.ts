import { type } from '../js';
import { Bar } from './models/foo';

const tp = (k: string) => type('[foo] '+k);
export const Types = {
  add     : tp('add'),
  subtract: tp('subtract'),
  log     : tp('log'),
  logOk   : tp('logOk'),
  logNg   : tp('logNg'),
  bar     : tp('bar'),
  barOk   : tp('barOk'),
};

export class      add { type = Types.add     ; constructor(public payload: number) {} }
export class subtract { type = Types.subtract; constructor(public payload: number) {} }
export class      log { type = Types.log     ; constructor(public payload: number) {} }
export class    logOk { type = Types.logOk   ; constructor(public payload: number) {} }
export class    logNg { type = Types.logNg   ; constructor(public payload: string) {} }
export class      bar { type = Types.bar     ; constructor(public payload: number) {} }
export class    barOk { type = Types.barOk   ; constructor(public payload: number) {} }

export let actions = { add, subtract, log, logOk, logNg, bar, barOk };
export type Actions = add | subtract | log | logOk | logNg | bar | barOk;

// usage in component ctor: 'Object.assign(this, dispatchers(store));' or 'this.foo = dispatchers(store);', then use the functions to dispatch actions
export let dispatchers = (store: Observable<Actions>) => {
  let do = store.dispatch.bind(store);
  return {
     add     : (pl: number) => do(add     (pl)),
     subtract: (pl: number) => do(subtract(pl)),
     log     : (pl: number) => do(log     (pl)),
     logOk   : (pl: number) => do(logOk   (pl)),
     logNg   : (pl: string) => do(logNg   (pl)),
     bar     : (pl: number) => do(bar     (pl)),
     barOk   : (pl: number) => do(barOk   (pl)),
};
