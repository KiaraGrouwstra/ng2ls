import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
import { RESTService } from '@covalent/http';
// import { API_DOMAIN } from '../../constants';
const API_DOMAIN = 'https://example.com/'
// import { TokenService } from './token';
// import { Project } from '../models';

export type Project = {};

@Injectable()
export class ApiService<T> extends RESTService<T> {
  constructor(
    private _http: Http,
    // private _tokenService: TokenService,
    path: string,
 ) {
    super(_http, {
      baseHeaders: new Headers({
        'Content-Type': 'application/json',
      }),
      // dynamicHeaders: () => new Headers({
      //   Authorization: `Bearer ${this._tokenService.access_token}`,
      // }),
      baseUrl: API_DOMAIN,
      path: `/api/${path}`,
      transform: (res: Response): any => res.json(),
    });
  }
}

// naive way of applying RESTService, must redo DI just to inject path
@Injectable()
export class ProjectService extends ApiService<Project> {
  constructor(
    _http: Http,
    // _tokenService: TokenService,
 ) {
    super(_http /*, _tokenService*/, 'projects');
  }
}

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
