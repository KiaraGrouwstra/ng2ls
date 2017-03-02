"use strict";
var R = require('ramda');
var core_1 = require('@angular/core');
// annotations: decorators that add metadata, rather than say mutating the target
// extendible Component decorator, extended to merge items from here:
// http://stackoverflow.com/questions/36837421/extending-component-decorator-with-base-class-decorator/36837482#36837482
var mergeMetadata = function (metadataClass) { return function (annotation) {
    return function (target) {
        var parentTarget = Object.getPrototypeOf(target.prototype).constructor;
        var parentAnns = Reflect.getMetadata('annotations', parentTarget);
        if (R.keys(parentAnns).length) {
            var parentAnn_1 = parentAnns[0];
            Object.keys(parentAnn_1).forEach(function (key) {
                if (!R.isNil(parentAnn_1[key])) {
                    if (!R.isNil(annotation[key])) {
                        if (R.is(Array)(parentAnn_1[key])) {
                            annotation[key] = parentAnn_1[key].concat(annotation[key]);
                        }
                        else if (R.is(Object)(parentAnn_1[key]) && R.is(Object)(annotation[key])) {
                            Object.assign(annotation[key], parentAnn_1[key]);
                        }
                        else {
                            annotation[key] = parentAnn_1[key];
                        }
                    }
                    else {
                        annotation[key] = parentAnn_1[key];
                    }
                }
            });
        }
        var metadata = new metadataClass(annotation);
        Reflect.defineMetadata('annotations', [metadata], target);
    };
}; };
exports.ExtComp = mergeMetadata(core_1.Component);
exports.ExtDir = mergeMetadata(core_1.Directive);
exports.ExtPipe = mergeMetadata(core_1.Pipe);
// https://github.com/angular/angular/issues/13387#issuecomment-269506581
var lang_1 = require("@angular/core/src/facade/lang");
// import { IDescribeReflect as DescribeReflect } from "../declarations/IDescribeReflect";
function Inherit() {
    return function (target) {
        var metaInformations = Reflect.getOwnMetadata("annotations", target);
        if (metaInformations) {
            var parentTarget = Object.getPrototypeOf(target.prototype).constructor;
            var parentMetaInformation = Reflect.getMetadata("annotations", parentTarget);
            var _loop_1 = function(metaInformation) {
                var _loop_2 = function(parentMetadata) {
                    if (parentMetadata.constructor === metaInformation.constructor) {
                        Object.keys(parentMetadata).forEach(function (key) {
                            if (!lang_1.isPresent(metaInformation[key])) {
                                console.log("Inheriting key: $(key) with value: $(parentMetadata[key])");
                                metaInformation[key] = parentMetadata[key];
                            }
                        });
                    }
                };
                for (var _i = 0, parentMetaInformation_1 = parentMetaInformation; _i < parentMetaInformation_1.length; _i++) {
                    var parentMetadata = parentMetaInformation_1[_i];
                    _loop_2(parentMetadata);
                }
            };
            for (var _a = 0, metaInformations_1 = metaInformations; _a < metaInformations_1.length; _a++) {
                var metaInformation = metaInformations_1[_a];
                _loop_1(metaInformation);
            }
        }
    };
}
exports.Inherit = Inherit;
// usage on inheriting child: @Inherit() @Component({...})
