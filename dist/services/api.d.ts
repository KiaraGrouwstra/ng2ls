import { Http } from '@angular/http';
import { RESTService } from '@covalent/http';
export declare type Project = {};
export declare class ApiService<T> extends RESTService<T> {
    private _http;
    constructor(_http: Http, path: string);
}
export declare class ProjectService extends ApiService<Project> {
    constructor(_http: Http);
}
