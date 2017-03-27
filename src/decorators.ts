import * as R from 'ramda';
import { Type, Obj } from './types';
import { callFn } from './js';

let decorate = R.curry(Reflect.decorate);
type DecoratorMeta<T> = { target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T> };

// decorate a class method (non get/set)
// export let try_log: MethodDecorator = decorate(decMethod());
function decMethod(
  k = 'value',
  wrapper = function<T, TFunction extends () => T>(fn: TFunction, parameters: any[], meta: DecoratorMeta<TFunction>): T { return callFn(fn, this, arguments); },
): MethodDecorator {
  return <T>(target: Object, key: string, descriptor: TypedPropertyDescriptor<T>, pars?: any[]) => {
    const fn = R.prop('value')(<any>descriptor); // descriptor.value
    if (typeof fn !== 'function') {
      throw new SyntaxError(`can only decorate methods, while ${key} is a ${typeof fn}!`);
    }
    return [{
      // ...descriptor,
      // ...R.omit(['value'], descriptor),
      [k]: wrapper(fn, pars || [], { target, key, descriptor: <any>descriptor }),
    }];
  };
}

// 'cast' a function such that in case it receives a bad (non-conformant)
// value for input, it will return a default value of its output type
// intercepts bad input values for a function so as to return a default output value
// ... this might hurt when switching to like Immutable.js though.
export let typed: MethodDecorator = decorate(
  [
    decMethod('value', (fn: Function|any, [from, to]: [Type<any>[], Type<any>]) => function() {
    for (let i = 0; i < from.length; i++) {
      let frm = from[i];
      let v = arguments[i];
      if(frm && (R.isNil(v) || v.constructor != frm)) return (new to).valueOf();
    }
    return callFn(fn, this, arguments);
  })
  ]
);

// simpler guard, just a try-catch wrapper with default value
export let fallback: MethodDecorator = decorate(
  [
    decMethod('value', <T, TFunction extends () => T>(fn: TFunction, [def]: [T], meta: DecoratorMeta<TFunction>) => function() {
    try {
      return callFn(fn, this, arguments);
    }
    catch(e) {
      console.warn('fallback error', e.stack);
      return def;
    }
  })
  ]
);

// try/catch to log errors. useful in contexts with silent crash, e.g. promises / async functions without try/catch.
export let try_log: MethodDecorator = decorate(
  [
    decMethod('value', <T, TFunction extends () => T>(fn: TFunction, [], meta: DecoratorMeta<TFunction>) => function(): any|never {
    try {
      return callFn(fn, this, arguments);
    }
    catch(e) {
      console.warn('try_log error', e.stack);
    }
  })
  ]
);

export let tryThrow: MethodDecorator = decorate(
  [
    decMethod('value', <T, TFunction extends () => T>(fn: TFunction, [], meta: DecoratorMeta<TFunction>) => function(): any|Promise<any> {
      let ret = callFn(fn, this, arguments);
      if ( ret instanceof Promise ) {
        return (ret as Promise<any>).then(
          undefined,
          (e) => {
            console.warn('try_log error', e.stack);
            throw e;   
          }  
        );
      } else {
        return ret; 
      }
    })
  ]
);

// wrapper for methods returning void, return if not all parameters are defined
// this broke with Sweet and would be fully useless with minification, so use is discouraged.
export let combine: MethodDecorator = decorate(
  [
    decMethod('value', (fn: Function|any, [allow_undef]: [Obj<boolean>]) => function() {
      // let names = /([^\(]+)(?=\))'/.exec(fn.toString()).split(',').slice(1);
      let names = fn.toString().split('(')[1].split(')')[0].split(/[,\s]+/);
      for (let i = 0; i < arguments.length; i++) {
        let v = arguments[i];
        let name = names[i]
          .replace(/_\d+$/, '')
          // fixes SweetJS suffixing names with e.g. _123. breaks functions already named .*_\d+, e.g. foo_123
          // do not minify while using this; functions wrapped in combine will no longer trigger.
        if(v===undefined && !(allow_undef || {})[name]) return; // R.isNil(v)
      }
      return callFn(fn, this, arguments);  //return
    })
  ]
);

// doesn't work with `setter`, since both would start out as identically-named regular methods
export let getter: MethodDecorator = decorate([decMethod('get')]);

// doesn't work with `getter`, since both would start out as identically-named regular methods
export let setter: MethodDecorator = decorate([decMethod('set')]);
