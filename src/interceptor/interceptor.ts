import { NgModule, Type, OpaqueToken } from '@angular/core';
import { Action, Dispatcher, Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import 'rxjs/operator/withLatestFrom';
import 'rxjs/operator/switchMap';

export interface Interception {
	intercept(store: Store<any>, action: Action): Observable<Action>;
}

export class Interceptor extends Subject<Action> {
	constructor(
		private _store: Store<any>,
		private _dispatcher: Dispatcher,
		private _interceptor: Interception,
	) {
		super();
		this.withLatestFrom(_store)
		.switchMap(
			([action, store]) => _interceptor.intercept(store, action)
		)
		.subscribe(_dispatcher);
	}

	dispatch(action: Action) {
		this.next(action);
	}
}

export function _interceptorFactory(store: Store<any>, dispatcher: Dispatcher, interception: Interception) {
	return new Interceptor(store, dispatcher, interception);
}

@NgModule()
export class InterceptModule {
	static provideInterceptor(type: Type<any>) {
		return {
			ngModule: InterceptModule,
			providers: [
				type,
				{
					provide: Interceptor,
					useFactory: _interceptorFactory,
					deps: [ Store, Dispatcher, type ]
				}
			]
		}
	}
}
