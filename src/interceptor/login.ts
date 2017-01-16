import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Action } from '@ngrx/store';
import { Interception } from 'interception';
import { ACTION as A } from './action';
import * as R from 'ramda';

import { typeIn, typeNIn, toAction } from './util';

import { HomePage as HomeScene } from '../pages/home/home';
import { LoginScene } from '../pages/login/login';

@Injectable()
export class Interceptor implements Interception {
    constructor(
        public http: Http,
    ) {}

    intercept = <(state, action) => Observable<Action>>R.cond([
        [
            typeIn([A.INIT]),
            (state, act) => Observable.of(
                toAction(act.type, {
                    loginForm: {email:'hon@hon.com', password:'xxx'},
                    rootScene: LoginScene,
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
                    toAction(A.SETROOT, {rootScene: HomeScene})
                ).delay(2200)
            )
        ],
        [
            R.T,
            (state, action) => Observable.of(action)
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
