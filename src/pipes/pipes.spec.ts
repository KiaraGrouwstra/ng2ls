import * as R from 'ramda';
import { genPipe, pipesForMeta, makePipes, pipeModule } from './pipes';
let fn = (s: string) => s.toUpperCase();
let toKv = R.pipe(R.toPairs, R.map(<T>([k,v]: [string, T]) => ({ k, v })));

describe('genPipe', () => {
  it('should generate a pipe', () => {
    let cls = genPipe(fn, { name: 'shout' });
    let pipe = new cls();
    expect(pipe.transform(`foo`, [])).toEqual(`FOO`);
  })
})

describe('pipesForMeta', () => {
  it('should generate multiple pipes for a given metadata', () => {
    let cls = pipesForMeta({ meta: {}, pipes: { shout: fn } })[0];
    let pipe = new cls();
    expect(pipe.transform(`foo`, [])).toEqual(`FOO`);
  })
})

describe('makePipes', () => {
  it('should generate pipes with different metadata', () => {
    let cls = makePipes([{ meta: {}, pipes: { shout: fn } }])[0];
    let pipe = new cls();
    expect(pipe.transform(`foo`, [])).toEqual(`FOO`);
  })
})

describe('pipeModule', () => {
  it('should generate a pipe module given generated and pre-existing pipes', () => {
    /*export*/ let PipesModule = pipeModule({ pure: { shout: fn, toKv } });
    expect(typeof PipesModule).toEqual(`function`);
  })
})
