import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Interception } from './interceptor';
export declare class Interceptor implements Interception {
    http: Http;
    constructor(http: Http);
    intercept: (state: any, action: Action) => Observable<Action>;
}
