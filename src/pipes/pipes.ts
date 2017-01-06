import * as R from 'ramda';
import { NgModule, Injectable, Pipe, PipeTransform } from '@angular/core';
import { Obj, Type } from '../models/models';
// export Type;

// *** TODO ***: handle DI in the constructor of generated pipes.
// (mimic TS type decorators to know what to inject/assign?)

export type Transform = (value: any, ...args: any[]) => any;
export type PipeObj = Obj<Transform>;
export type PipeClass = Type<PipeTransform>;
// info to makes some named pipes with common metadata
export type PipeInfo = { meta?: {} /* Pipe but optional keys */, pipes: PipeObj };

/**
 * generate a pipe class for a given function and metadata
 */
export function genPipe(fn: (v: any) => string, opts: { name: string } = { name: '' }): PipeClass {
  let cls = class implements PipeTransform {
    transform: Transform = fn;
  };
  Object.defineProperty(cls, 'name', { value: opts['name'] });
  return R.assoc('annotations', [
    new Pipe(<Pipe>opts),
    new Injectable(),
  ], cls);
}

/**
 * create pipes with common metadata
 */
export function pipesForMeta({ meta = {}, pipes }: PipeInfo): PipeClass[] {
  return R.pipe(R.toPairs, R.map(<T>([k,v]: [string, T]) => genPipe(v, R.merge(meta, { name: k }))))(pipes);
}

/**
 * make pipes in groups (by metadata) then flatten
 */
export let makePipes: (_x: PipeInfo[]) => PipeClass[] = R.pipe(
  R.map(pipesForMeta),
  R.flatten,
);

/**
 * generate a pipe module given pipe infos and pre-existing pipes.
 * deprecated: just use pipeModule unless Angular adds new Pipe metadata.
 */
export function customPipeModule(infos: PipeInfo[] = [], readyPipes: PipeClass[] = []): Type<NgModule> {
  let pipes = [...readyPipes, ...makePipes(infos)];
  let cls = class{};
  return R.assoc('annotations', [
    new NgModule({ declarations: pipes, exports: pipes }),
  ], cls);
}

/**
 * generate a pipe module given pure/impure functions and premade pipes
 */
export function pipeModule({ ready = [], pure = {}, impure = {} }: { ready?: PipeClass[], pure?: PipeObj, impure?: PipeObj }): Type<NgModule> {
  return customPipeModule([
    { meta: {}, pipes: pure },
    { meta: { pure: false }, pipes: impure },
  ], ready);
}

// export let {a, b, c} = o;
