import * as R from 'ramda';
// // import 'rxjs/add/operator/map';
// // import 'rxjs/add/operator/catch';
// // import 'rxjs/add/operator/startWith';
// // import 'rxjs/add/operator/switchMap';
// // import 'rxjs/add/operator/mergeMap';
// // import 'rxjs/add/operator/toArray';
// // import 'rxjs/add/operator/debounceTime';
// import { Observable } from 'rxjs';
// // import { of } from 'rxjs/observable/of';
// // import { defer } from 'rxjs/observable/defer';
// // import { empty } from 'rxjs/observable/empty';

// import { Injectable } from '@angular/core';
// import { Http } from '@angular/http'; // , Headers, RequestOptions
// // import { Action } from '@ngrx/store';
// // import { Database } from '@ngrx/db';
// import { Actions, Effect } from '@ngrx/effects';

// // import { unJson } from './effects'; //, always
// // import { MyAction, toPayload, ActionCtor, ActionPair } from '../actions/actions';
// import { actions } from '../actions';

// // const book = { SearchAction: class SearchAction { type = 'search'; constructor(public payload: string) {}; } };
// // const { SearchAction } = book;
// // class SearchAction { type = 'search'; constructor(public payload: string) {}; }
// // const collection = {
// //   LoadAction: class LoadAction { type = 'load'; constructor(public payload?: null) {}; },
// //   LoadFailAction: class LoadFailAction { type = 'LoadFailAction'; constructor(public payload: Error) {}; },
// // };
// // import { pairs as fooActions } from '../actions/foo';
// // import { TokenService } from '../services'; //, HouseService
// // export class HouseService { query() { return Observable.of([]); } };
// // import { API_DOMAIN } from '../../constants';
// // const API_DOMAIN = 'http://www.example.com/';

// // let fetchDevice = ({ payload: deviceId }) => this.http.get(`${API_DOMAIN}/api/devices/wpu/${deviceId}/overview`);

// @Injectable()
// export class HouseEffects {

//   constructor(
//     // private http: Http,
//     private actions$: Actions,  // Observable<>
//     // private houseService: HouseService,
//     // private db: Database,
//   ) {}

//   /**
//    * `dispatch`: doesn't yield actions back to the store so ignore. `defer` makes an observable when subscribed to.
//    */
//   // @Effect({ dispatch: false })
//   // openDB$: Observable<any> = Observable.defer(() => {
//   //   // return this.db.open('books_app');
//   // });

//   // @Effect() search$: Observable<Action> = this.actions$
//   //     .ofType(actions.houses.types.SEARCH)
//   //     .startWith(new collection.LoadAction()) // trigger this effect immediately on startup
//   //     .debounceTime(300)
//   //     .map((action: SearchAction) => action.payload) // book.
//   //     // .map<string>(toPayload)
//   //     // v or mergeMap: switchMap cancels previous results (better for read: GET), mergeMap leaves them intact (better for write: POST/PUT/PATCH/DELETE)
//   //     .switchMap((projectId) => {
//   //       if (projectId === '') {
//   //         return Observable.empty();
//   //       }
//   //     return this.http.get(`${API_DOMAIN}/api/projects/${projectId}/houses`)
//   //     // return this.houseService.query()
//   //     })
//   //     .map(unJson)
//   //     .map((d) => new actions.houses.actions.Search_Complete(d))
//   //     .catch(error => of(new collection.LoadFailAction(error))) // vs. Success

//     @Effect() search$2 = makeEffect(fooActions.search, fooActions.search.action, Observable.of);
//     @Effect() search$3 = makeEffect(actions.houses.search, actions.houses.searchComplete, (projectId) => !projectId ? Observable.empty() : this.houseService.query());
//     // ^ this.http.get(`${API_DOMAIN}/api/projects/${projectId}/houses`).map(unJson)
// }

