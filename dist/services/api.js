"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var http_2 = require("@covalent/http");
var ApiService = (function (_super) {
    __extends(ApiService, _super);
    function ApiService(_http, 
        // private _tokenService: TokenService,
        path) {
        var _this = _super.call(this, _http, {
            baseHeaders: new http_1.Headers({
                'Content-Type': 'application/json',
            }),
            // dynamicHeaders: () => new Headers({
            //   Authorization: `Bearer ${this._tokenService.access_token}`,
            // }),
            baseUrl: API_DOMAIN,
            path: "/api/" + path,
            transform: function (res) { return res.json(); },
        }) || this;
        _this._http = _http;
        return _this;
    }
    return ApiService;
}(http_2.RESTService));
ApiService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, String])
], ApiService);
exports.ApiService = ApiService;
// naive way of applying RESTService, must redo DI just to inject path
var ProjectService = (function (_super) {
    __extends(ProjectService, _super);
    function ProjectService(_http) {
        return _super.call(this, _http /*, _tokenService*/, 'projects') || this;
    }
    return ProjectService;
}(ApiService));
ProjectService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], ProjectService);
exports.ProjectService = ProjectService;
// // smarter approach, but still errors:
// // Can't resolve all parameters for apiService: (?)
// // let apiService<T> = (path: string) => @Injectable() class extends RESTService<T> {
// export function apiService<T>(path: string): Function /* class RESTService<T> */ {
//   let rest = class ApiService extends RESTService<T> {
//     // private _path;
//     constructor(
//       private _http: Http,
//       // private _tokenService: TokenService,
//    ) {
//       super(_http, {
//         baseHeaders: new Headers({
//           'Content-Type': 'application/json',
//         }),
//         // dynamicHeaders: () => new Headers({
//         //   Authorization: `Bearer ${this._tokenService.access_token}`,
//         // }),
//         baseUrl: API_DOMAIN,
//         path: `/api/${path}`,
//         transform: (res: Response): any => res.json(),
//       });
//     }
//   };
//   rest['annotations'] = [
//     new Injectable(),
//   ];
//   return rest; // <RESTService<T>>
// }
// export let ProjectService = apiService<Project>('projects');
// // export default arr2obj(apiService)(['projects']);
