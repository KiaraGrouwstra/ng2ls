import { type } from '../util';
import { Bar } from './models/foo';

export const Types = {
  add     : type('[foo] add'),
  subtract: type('[foo] subtract'),
  log     : type('[foo] log'),
  logOk   : type('[foo] logOk'),
  logNg   : type('[foo] logNg'),
  bar     : type('[foo] bar'),
  barOk   : type('[foo] barOk'),
};

export class      add { type = Types.add     ; constructor(public payload: number) {} }
export class subtract { type = Types.subtract; constructor(public payload: number) {} }
export class      log { type = Types.log     ; constructor(public payload: number) {} }
export class    logOk { type = Types.logOk   ; constructor(public payload: number) {} }
export class    logNg { type = Types.logNg   ; constructor(public payload: string) {} }
export class      bar { type = Types.bar     ; constructor(public payload: number) {} }
export class    barOk { type = Types.barOk   ; constructor(public payload: number) {} }

export let actions = { add, subtract, log, logOk, logNg, bar, barOk };

export type Actions
  = add
  | subtract
  | log
  | logOk
  | logNg
  | bar
  | barOk;

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
