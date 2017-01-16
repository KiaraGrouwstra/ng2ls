import { NgModule, PipeTransform } from '@angular/core';
import { Obj, Type } from '../models/models';
export declare type Transform = (value: any, ...args: any[]) => any;
export declare type PipeObj = Obj<Transform>;
export declare type PipeClass = Type<PipeTransform>;
export declare type PipeInfo = {
    meta?: {};
    pipes: PipeObj;
};
/**
 * generate a pipe class for a given function and metadata
 */
export declare function genPipe(fn: (v: any) => string, opts?: {
    name: string;
}): PipeClass;
/**
 * create pipes with common metadata
 */
export declare function pipesForMeta({meta, pipes}: PipeInfo): PipeClass[];
/**
 * make pipes in groups (by metadata) then flatten
 */
export declare let makePipes: (_x: PipeInfo[]) => PipeClass[];
/**
 * generate a pipe module given pipe infos and pre-existing pipes.
 * deprecated: just use pipeModule unless Angular adds new Pipe metadata.
 */
export declare function customPipeModule(infos?: PipeInfo[], readyPipes?: PipeClass[]): Type<NgModule>;
/**
 * generate a pipe module given pure/impure functions and premade pipes
 */
export declare function pipeModule({ready, pure, impure}: {
    ready?: PipeClass[];
    pure?: PipeObj;
    impure?: PipeObj;
}): Type<NgModule>;
