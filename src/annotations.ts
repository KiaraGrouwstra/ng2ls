import * as R from 'ramda';
import { Component, Directive, Pipe } from '@angular/core';
import { Type } from './types';

// annotations: decorators that add metadata, rather than say mutating the target

// extendible Component decorator, extended to merge items from here:
// http://stackoverflow.com/questions/36837421/extending-component-decorator-with-base-class-decorator/36837482#36837482
let mergeMetadata = (metadataClass: Type<any>) => function(annotation: any) {
  return function (target: Function) {
    let parentTarget = Object.getPrototypeOf(target.prototype).constructor;
    let parentAnns = (<any>Reflect).getMetadata('annotations', parentTarget);
    if(R.keys(parentAnns).length) {
      let parentAnn = parentAnns[0];
      Object.keys(parentAnn).forEach(key => {
        if (!R.isNil(parentAnn[key])) {
          if (!R.isNil(annotation[key])) {
            if (R.is(Array)(parentAnn[key])) {
              annotation[key] = parentAnn[key].concat(annotation[key]);
            } else if (R.is(Object)(parentAnn[key]) && R.is(Object)(annotation[key])) {
              Object.assign(annotation[key], parentAnn[key]);
            } else {
              annotation[key] = parentAnn[key];
            }
          } else {
            annotation[key] = parentAnn[key];
          }
        }
      });
    }
    let metadata = new metadataClass(annotation);
    (<any>Reflect).defineMetadata('annotations', [metadata], target);
  }
}

export let ExtComp = mergeMetadata(Component);
export let ExtDir = mergeMetadata(Directive);
export let ExtPipe = mergeMetadata(Pipe);

// https://github.com/angular/angular/issues/13387#issuecomment-269506581

import { isPresent } from "@angular/core/src/facade/lang";
// import { IDescribeReflect as DescribeReflect } from "../declarations/IDescribeReflect";

export function Inherit() {
    return (target: Function) => {
        let metaInformations = (<any>Reflect).getOwnMetadata("annotations", target);
        if (metaInformations) {
            let parentTarget = Object.getPrototypeOf(target.prototype).constructor;
            let parentMetaInformation = (<any>Reflect).getMetadata("annotations", parentTarget);

            for (let metaInformation of metaInformations) {
                for (let parentMetadata of parentMetaInformation) {
                    if (parentMetadata.constructor === metaInformation.constructor) {
                        Object.keys(parentMetadata).forEach(key => {
                            if (!isPresent(metaInformation[key])) {
                                console.log(`Inheriting key: $(key) with value: $(parentMetadata[key])`);
                                metaInformation[key] = parentMetadata[key];
                            }
                        });
                    }
                }
            }
        }
    }
}

// usage on inheriting child: @Inherit() @Component({...})
