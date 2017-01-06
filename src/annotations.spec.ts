import { ExtComp } from './annotations';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Type } from './types';
import { Reflect, getMetadata } from 'reflect-metadata'; // /Reflect

const { OnPush, Default } = ChangeDetectionStrategy;

@Component({
  changeDetection: Default,
})
class XComp {
  n: number = 1;
  @Input() inp: string;
}

@ExtComp({
  changeDetection: Default,
})
class AComp extends XComp {}

@ExtComp({
  changeDetection: OnPush,
})
class BComp extends AComp {}

let comp_meta = (cls: Type<Component>) => Reflect.getMetadata('annotations', cls)[0];

let meta_x = comp_meta(XComp);
let meta_a = comp_meta(AComp);
let meta_b = comp_meta(BComp);

let comp_x = new XComp;
let comp_a = new AComp;
let comp_b = new BComp;

describe('extends', () => {

  it('should inherit properties', () => {
    expect(comp_x.n).toEqual(1);
    expect(comp_a.n).toEqual(1);
    expect(comp_b.n).toEqual(1);
  })

  it('should inherit `@Input`s', () => {
    expect(Reflect.getMetadata('propMetadata', XComp)['inp'][0].constructor).toEqual(Input);
    expect(Reflect.getMetadata('propMetadata', AComp)['inp'][0].constructor).toEqual(Input);
    expect(Reflect.getMetadata('propMetadata', BComp)['inp'][0].constructor).toEqual(Input);
  })

})

describe('ExtComp', () => {

  it('should inherit values annotations', () => {
    expect(meta_x.changeDetection).toEqual(OnPush);
    expect(meta_a.changeDetection).toEqual(OnPush);
    expect(meta_b.changeDetection).toEqual(OnPush);
  })

  it('should allow extending arrays', () => {
    expect(meta_x.directives).toEqual([1]);
    expect(meta_a.directives).toEqual([1,2]);
    expect(meta_b.directives).toEqual([1,2,3]);
  })

})
