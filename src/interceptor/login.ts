import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Action } from '@ngrx/store';
import { Interception } from './interceptor';
import { ACTION as A } from '../actions/actions';
import * as R from 'ramda';

import { typeIn, typeNIn, toAction } from '../util';

import { LoginView, HomeView } from '../pages';

@Injectable()
export class Interceptor implements Interception {
    constructor(
        public http: Http,
    ) {}

    intercept = <(state: State, action: Action) => Observable<Action>>R.cond([
      [
        typeIn([A.INIT]),
        (state, act) => Observable.of(
          toAction(act.type, {
            loginForm: {email:'hon@hon.com', password:'xxx'},
            rootView: LoginView,
            loginSeg: 'login'
          })
        )
    ],
    [
      typeIn([A.LOGIN]),
      (state, act) => Observable.merge(
        Observable.of( toAction(A.LOADING, {content: 'login...'}) ),
        Observable.of(
          toAction(act.type, {user:{ name:'xon', uid:Date.now() }}),
          toAction(A.LOADING, false),
          toAction(A.SETROOT, {rootScene: HomePage})
        ).delay(2200)
      )
    ],
    [
      R.T,
      (state, action: Action) => Observable.of(action)
    ]
  ]);
}

/*
Usage:
- add in module:
  import { InterceptModule } from './interceptor';
  import { Interceptor } from '...';
  InterceptModule.provideInterceptor(Interceptor),
- dispatch through interceptor in components:
  import { Interceptor } from './interceptor';
  public interceptor: Interceptor,
  this.interceptor.dispatch(toAction(ACTIONS.LOGIN, payload));
*/
