import * as R from 'ramda';
import { arr2obj, arr2map, typed, fallback, ng2comp, combine, findIndexSet, editValsOriginal, editValsBoth, editValsLambda, evalExpr, extractIterables, parameterizeStructure, toQuery, fromQuery } from './js';

describe('js', () => {

  let fail = (e: any) => expect(e).toBeUndefined();
  let do_prom = (done: (value: any) => {}, prom: Promise<any>, test: (value: any) => {}) => prom.then(test, fail).then(done, done);

  it('arr2obj maps an array to an object', () => {
    expect(arr2obj((y: number) => y * 2)([1,2,3])).toEqual({ 1: 2, 2: 4, 3: 6 });
  })

  it('arr2map maps an array to a Map', () => {
    expect(R.fromPairs(arr2map([1,2,3], y => y * 2))).toEqual({ 1: 2, 2: 4, 3: 6 });
  })

  describe('typed', () => {

    // it('strLen', () => {
    //   let strLen = R.length;
    //   expect(strLen ('lol')).toEqual(3);
    //   expect(strLen (123)).toEqual(undefined);
    //   let strLen_ = typed([String], Number, strLen);
    //   expect(strLen_('lol')).toEqual(3);
    //   expect(strLen_(123)).toEqual(0);
    // })

    // it('arrObjNoop', () => {
    //   let arrObjNoop = (arr: any[], obj: Object) => 123;
    //   expect(arrObjNoop ([], {})).toEqual(undefined);
    //   // expect(arrObjNoop ('lol', 123)).toEqual(undefined); // TS: not assignable
    //   let arrObjNoop_ = typed([Array, Object], Array, arrObjNoop);
    //   expect(arrObjNoop_([], {})).toEqual(undefined);
    //   expect(arrObjNoop_('lol', 123)).toEqual([]);
    // })

  })

  // it('fallback', () => {
  //   let thrower = (v: any) => { throw new Error('boom'); };  //throw 'boom';
  //   // expect(thrower('hi')).toThrowError('boom');  // dunno why this fails :(
  //   let safe = fallback(123, thrower); // TS: not assignable
  //   expect(safe('hi')).toEqual(123);
  // })

  // it('ng2comp', () => {
  //   let cmp_cls = ng2comp({
  //     component: {
  //       selector: 'value',
  //     },
  //     decorators: {
  //       // array: ViewChild(ArrayComp),
  //     },
  //     parameters: [],
  //     class: class tmp {},
  //   });
  //   expect().toEqual();
  // })

  it('combine', () => {
    let cls = class tmp {
      _a: any;
      _b: any;
      c: any;
      get a() { return this._a; }
      get b() { return this._b; }
      set a(x) {
        this._a = x; this.combInputs();
      }
      set b(x) {
        this._b = x; this.combInputs();
      }
      combInputs = () => combine((a: number, b: number) => {
        this.c = a + b;
      })(this.a, this.b);
    }
    let obj = new cls();
    obj.a = 1;
    obj.b = 1;
    expect(obj.c).toEqual(2);
  })

  it('combine with optional undefined values', () => {
    let cls = class tmp {
      _a: any;
      _b: any;
      c: any;
      get a() { return this._a; }
      get b() { return this._b; }
      set a(x) {
        this._a = x; this.combInputs();
      }
      set b(x) {
        this._b = x; this.combInputs();
      }
      combInputs = () => combine((a: number, b: number) => {
        this.c = a + b;
      }, { b: true })(this.a, this.b);
    }
    let obj = new cls();
    obj.a = 1;
    expect(obj.c).toEqual(NaN);
  })

  it('findIndexSet', () => {
    expect(findIndexSet('b', new Set(['a','b','c']))).toEqual(1);
  })

  describe('editVals', () => {
    const dbl = (y: number) => y * 2;
    const fallback = (y: number) => y ? y : 'nope';

    it('editValsOriginal', () => {
      expect(editValsOriginal({ a: dbl, b: (y: number) => y * y, d: fallback })({ a: 3, b: 5, c: 7 })).toEqual({ a: 6, b: 25, c: 7 });
    })

    it('editValsBoth', () => {
      expect(editValsBoth({ a: dbl, b: (y: number) => y * y, d: fallback })({ a: 3, b: 5, c: 7 })).toEqual({ a: 6, b: 25, c: 7, d: 'nope' });
    })

    it('editValsLambda', () => {
      expect(editValsLambda({ a: dbl, b: (y: number) => y * y, d: fallback })({ a: 3, b: 5, c: 7 })).toEqual({ a: 6, b: 25, d: 'nope' });
    })

  });

  it('evalExpr', () => {
    expect(evalExpr({ a: 1 })('a')).toEqual(1);
  })

})
