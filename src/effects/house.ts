import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/debounceTime';

import * as R from 'ramda';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { defer } from 'rxjs/observable/defer';
import { Action } from '@ngrx/store';
import { empty } from 'rxjs/observable/empty';
import { unJson, always } from './effects';

import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';

import { MyAction, toPayload, ActionCtor, ActionPair } from '../actions/actions';
import { actions } from '../actions';
import { pairs as fooActions } from '../actions/foo';
import { TokenService } from '../services'; //, HouseService
import { API_DOMAIN } from '../../constants';

// let fetchDevice = ({ payload: deviceId }) => this.http.get(`${API_DOMAIN}/api/devices/wpu/${deviceId}/overview`);

@Injectable()
export class HouseEffects {

  constructor(
    private http: Http,
    private actions$: Actions,  // Observable<>
    // private houseService: HouseService,
  ) {}

  /**
   * `dispatch`: doesn't yield actions back to the store so ignore. `defer` makes an observable when subscribed to.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.db.open('books_app');
  });

  @Effect() search$: Observable<Action> = this.actions$
      .ofType(actions.houses.types.SEARCH)
      .startWith(new collection.LoadAction()) // trigger this effect immediately on startup
      .debounceTime(300)
      .map((action: book.SearchAction) => action.payload)
      // .map<string>(toPayload)
      // v or mergeMap: switchMap cancels previous results (better for read: GET), mergeMap leaves them intact (better for write: POST/PUT/PATCH/DELETE)
      .switchMap((projectId) => {
        if (projectId === '') {
          return empty();
        }
      return this.http.get(`${API_DOMAIN}/api/projects/${projectId}/houses` )
      // return this.houseService.query()
      })
      .map(unJson)
      // .switchMap(
      //   // (houses )=> houses.map(
      //   async function(houses ){ return houses.map(
      //     (house )=> {
      //       house.devices = house.devices.map((device) => {
      //         return R.merge(device, await fetchDevice(device.id).map(unJson).toPromise());
      //       });
      //       return house;
      //       return set('')(house);
      //   })
      //   }
      // will throw if not an Action
      // .catch(always([])) // default value rather than failure
      .map((d) => new actions.houses.actions.Search_Complete(d))
      .catch(error => of(new collection.LoadFailAction(error))) // vs. Success

    @Effect() search$2 = makeEffect(fooActions.search, fooActions.search.action, (s) => of(s));
    @Effect() search$3 = makeEffect(actions.houses.search, actions.houses.searchComplete, (projectId) => !projectId ? empty() : this.houseService.query());
    // ^ this.http.get(`${API_DOMAIN}/api/projects/${projectId}/houses`).map(unJson)
}

let makeEffect = <T,U>(pair: ActionPair<T>, completeAction: ActionCtor<U>, mapper: (v: T) => Observable<U>, opts: {
  init?: T,  // trigger this effect immediately on startup
  debounce?: number, // 0
  read?: boolean,  // cancel previous results (good for read: GET, not for write: POST/PUT/PATCH/DELETE)
  fallback?: U,  // default value rather than failure
  failAction?: ActionCtor<Error>,
} = {}) => {
  let { init, debounce, read, fallback, failAction } = opts;
  let actions$: Actions = this.actions$;
  let filtered: Observable<MyAction<T>> = actions$.ofType(pair.type); // could the exact action be inferred using a string-based lookup?
  let initialized = init ? filtered.startWith(new (pair.action)(init)) : filtered;
  let payload = initialized
      .debounceTime(debounce || 0)
      .map(toPayload);
  let mapped = read ? payload.switchMap(mapper) : payload.mergeMap(mapper); // switchMap cancels previous results
  let defaulted = !R.isNil(fallback) ? mapped.catch(always(fallback)) : mapped;
  let created = defaulted.map((d: U) => new completeAction(d))
  let caught = failAction instanceof Object ? created.catch((error: Error) => of(new (<ActionCtor<Error>>failAction)(error))) : created;
  return caught;
}
