import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import QueryBuilder from 'sbx-querybuilder/index';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class SbxCoreService {


  public static environment = {} as any;
  private headers: any;

  private urls: any = {
    update_password: '/user/v1/password',
    login: '/user/v1/login',
    register: '/user/v1/register',
    validate: '/user/v1/validate',
    row: '/data/v1/row',
    find: '/data/v1/row/find',
    update: '/data/v1/row/update',
    delete: '/data/v1/row/delete',
    uploadFile: '/content/v1/upload',
    addFolder: '/content/v1/folder',
    folderList: '/content/v1/folder',
    send_mail: '/email/v1/send',
    payment_customer: '/payment/v1/customer',
    payment_card: '/payment/v1/card',
    payment_token: '/payment/v1/token',
    password: '/user/v1/password/request',
    cloudscript_run: '/cloudscript/v1/run'
  };

  constructor(private httpClient: HttpClient) {

  }


  public initialize(domain: number, baseUrl: string, appKey: string) {
    SbxCoreService.environment.domain = domain;
    SbxCoreService.environment.baseUrl = baseUrl;
    SbxCoreService.environment.appKey = appKey;
    this.headers = new HttpHeaders()
      .set('App-Key', SbxCoreService.environment.appKey);
  }
  public addHeaderAttr(name: string, value: string): void {
    this.headers = this.getHeaders().set(name, value);
  }

  public removeHeaderAttr(name: string) {
    this.headers = this.getHeaders().delete(name);
  }

  private getHeaders(): any {
    return  this.headers;
  }

  private getHeadersJSON(): any {
    return this.getHeaders().append('Content-Type', 'application/json');
  }

  $p(path: string) {
    return SbxCoreService.environment.baseUrl + path;
  }

  /**
   * AUTH
   */

  /**
   * @param {string} login
   * @param {string} password
   * @param {Callback} callBack
   */
  login(login: string, password: string, callBack: Callback) {
    const httpParams = new HttpParams().set('login', login).set('password', password);
    const option = {headers: this.getHeadersJSON(), params: httpParams};
    this.observableToCallBack(this.httpClient.get(this.$p(this.urls.login), option), callBack);
  }

  /**
   * @param {string} token
   * @param {Callback} callBack
   */
  validate(token: string,  callBack: Callback) {
    const httpParams = new HttpParams().set('token', token) ;
    const option = {headers: this.getHeadersJSON(), params: httpParams};
    this.observableToCallBack(this.httpClient.get(this.$p(this.urls.validate), option), callBack);
  }

  /**
   * @param {string} token
   * @return {Observable<any>}
   */
  validateRx(token: string) {
    const httpParams = new HttpParams().set('token', token) ;
    const option = {headers: this.getHeadersJSON(), params: httpParams};
     return this.httpClient.get(this.$p(this.urls.validate), option).map(data => data as any) ;
  }

  /**
   *
   * @param {string} login
   * @param {string} email
   * @param {string} name
   * @param {string} password
   * @param {Callback} callBack
   */
  signUp(login: string, email: string, name: string, password: string, callBack: Callback) {
    const httpParams = new HttpParams().set('login', login)
      .set('password', password)
      .set('name', name)
      .set('domain', SbxCoreService.environment.domain.toLocaleString())
      .set('email', email);
    const option = {headers: this.getHeadersJSON(), params: httpParams};
    this.observableToCallBack(this.httpClient.get(this.$p(this.urls.register), option), callBack);
  }

  /**
   * @param {string} login
   * @param {string} password
   * @return {Observable<any>}
   */
  loginRx(login: string, password: string) {
    const httpParams = new HttpParams().set('login', login).set('password', password);
    const option = {headers: this.getHeadersJSON(), params: httpParams};
    return   this.httpClient.get(this.$p(this.urls.login), option).map(data => data as any);
  }

  /**
   * @param {string} login
   * @param {string} email
   * @param {string} name
   * @param {string} password
   * @return {Observable<any>}
   */
  signUpRx(login: string, email: string, name: string, password: string) {
    const httpParams = new HttpParams().set('login', login)
      .set('password', password)
      .set('name', name)
      .set('domain', SbxCoreService.environment.domain.toLocaleString())
      .set('email', email);
    const option = {headers: this.getHeadersJSON(), params: httpParams};
    return this.httpClient.get(this.$p(this.urls.register), option).map(data => data as any);
  }

  /**
   * Send email to changePassword
   * @param {string} useEmail
   * @param {string} subject
   * @param {string} emailTemplate
   * @param {Callback} callBack
   */
  sendPasswordRequest(useEmail: string, subject: string, emailTemplate: string, callBack: Callback) {
    const body =  {user_email: useEmail, domain: SbxCoreService.environment.domain, subject: subject, email_template: emailTemplate};
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.password), body, option), callBack);
  }

  /**
   * Send email to changePassword
   * @param {string} useEmail
   * @param {string} subject
   * @param {string} emailTemplate
   * @return {Observable<Object>}
   */
  sendPasswordRequestRx(useEmail: string, subject: string, emailTemplate: string) {
    const body =  {user_email: useEmail, domain: SbxCoreService.environment.domain, subject: subject, email_template: emailTemplate};
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.password), body, option).map( data => data as any);
  }

  /**
   * change password with email code
   * @param {number} userId
   * @param {number} userCode
   * @param {string} newPassword
   * @param {Callback} callBack
   */
  changePassword(userId: number, userCode: number, newPassword: string, callBack: Callback) {
    const body =  {domain: SbxCoreService.environment.domain, user_id: userId, code: userCode, password: newPassword};
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.put(this.$p(this.urls.password), body, option), callBack);
  }

  /**
   * change password with email code
   * @param {number} userId
   * @param {number} userCode
   * @param {string} newPassword
   * @return {Observable<Object>}
   */
  changePasswordRx(userId: number, userCode: number, newPassword: string) {
    const body =  {domain: SbxCoreService.environment.domain, user_id: userId, code: userCode, password: newPassword};
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.put(this.$p(this.urls.password), body, option).map(data => data as any);
  }

  /***
   * DATA
   */

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @param {Callback} callBack the Callback class to call
   */
  insert(model: string, data: any, callBack: Callback) {
    const body = this.queryBuilderToInsert(data).setModel(model).compile();
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.row), body, option), callBack);
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @param {Callback} callBack he Callback class to call
   */
  update(model: string, data: any, callBack: Callback) {
    const body = this.queryBuilderToInsert(data).setModel(model).compile();
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.update), body, option), callBack);

  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @return {Observable}
   */
  insertRx(model: string, data: any) {
    const body = this.queryBuilderToInsert(data).setModel(model).compile();
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.row), body, option).map(res => res as any);
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @return {Observable}
   */
  updateRx(model: string, data: any) {
    const body = this.queryBuilderToInsert(data).setModel(model).compile();
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.update), body, option).map(res => res as any);
  }
  /**
   * @param {string} model the name model in sbxcloud
   * @param keys can be a string, a Class or array of both
   * @param {Callback} callBack
   */
  delete(model: string) {
    return new Find(model, this, false);
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param keys can be a string, a Class or array of both
   * @param {Callback} callBack
   */
  find(model: string) {
    return new Find(model, this, true);
  }

  /**
   * @param {string} subject
   * @param {string} to
   * @param {string} from
   * @param {string} body can be a html or a template
   * @param {boolean} isTemplate
   * @param {Callback} callBack
   */
  sendEmail(subject: string, to: string, from: string, body: string, isTemplate: boolean, callBack: Callback) {
    const mail = {
      subject: subject,
      to: to,
      domain: SbxCoreService.environment.domain,
      from: from,
    } as any;
    if (!isTemplate) {
      mail.html = body;
    } else {
      mail.email_template = body;
    }
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.send_mail), mail, option), callBack);
  }

  /**
   * @param {string} subject
   * @param {string} to
   * @param {string} from
   * @param {string} body can be a html or a template
   * @param {boolean} isTemplate
   * @return {Observable<any>}
   */
  sendEmailRx(subject: string, to: string, from: string, body: string, isTemplate: boolean) {
    const mail = {
      subject: subject,
      to: to,
      domain: SbxCoreService.environment.domain,
      from: from,
    } as any;
    if (!isTemplate) {
      mail.html = body;
    } else {
      mail.email_template = body;
    }
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.send_mail), mail, option).map(res => res as any);
  }


  /**
   * @param {string} key
   * @param file
   * @return {Observable<any>}
   */
  uploadFileRx(key: string, file: any) {
    const input = new FormData();
    input.append('file', file);
    input.append('model', JSON.stringify({ key: key}));
    const option = {headers: this.getHeaders() };
    return this.httpClient.post(this.$p(this.urls.uploadFile), input, option).map(res => res as any);
  }

  /**
   *
   * @param {string} key
   * @param file
   * @param {Callback} callBack
   */
  uploadFile(key: string, file: any, callBack: Callback) {
    const input = new FormData();
    input.append('file', file);
    input.append('model', JSON.stringify({ key: key}));
    const option = {headers: this.getHeaders() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.uploadFile), input, option), callBack);
  }

  /**
   * CLOUDSCRIPT
   */

  /**
   *
   * @param {string} key
   * @param params
   * @return {Observable<any>}
   */
  runRx(key: string, params: any) {
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.cloudscript_run), { key: key, params: params }, option).map(res => res as any);
  }

  /**
   * @param {string} key
   * @param params
   * @param {Callback} callBack
   */
  run(key: string, params: any, callBack: Callback) {
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.cloudscript_run), { key: key, params: params }, option), callBack);
  }

  /**
   * UTILS
   */

  private queryBuilderToInsert(data): any {
    const query =   new QueryBuilder()
      .setDomain(SbxCoreService.environment.domain);
    if (Array.isArray(data) ) {
      data.forEach(item => {
        query.addObject(this.validateData(item));
      });
    }else {
      query.addObject(this.validateData(data));
    }
    return query;
  }

  public validateData(data: any): any {
    const temp = {};
    Object.keys(data)
      .filter(key => {
        const v = data[key];
        return (Array.isArray(v) || typeof v === 'string') ?
          (v.length > 0) :
          (v !== null && v !== undefined);
      }).forEach(key => {
      if (data[key]._KEY != null) {
        data[key] = data[key]._KEY;
      }
      const key2 = (key !== '_KEY') ? key.replace(/^_/, '') : key;
      temp[key2] = data[key];
    });
    return temp;
  }

  public validateKeys(data: any): any {
    const temp = [];
    if (Array.isArray(data) ) {
      data.forEach(key => {
        if (typeof key === 'string') {
          temp.push(key);
        }else {
          temp.push(key._KEY);
        }
      });
    }else {
      if (typeof data === 'string') {
        temp.push(data);
      }else {
        temp.push(data._KEY);
      }
    }
    return temp;
  }

  public observableToCallBack(observable: Observable<Object>, callBack: Callback) {
    observable.map(res => res as any)
      .subscribe(response => {
          callBack.ok(response);
      }, error => {
        callBack.error(error as any);
      });
  }

  /**
   * @param response the response of the server
   * @param {string[]} completefetch the array of fetch
   * @returns {any} the response with the union between fetch_results and results
   */
  public mapFetchesResult(response: any, completefetch: string[] ) {

    if (response.fetched_results) {
      const fetch = [];
      const secondfetch = {};
      for (let i = 0; i < completefetch.length; i++) {
        let index = 0;
        const temp = completefetch[i].split('.');
        if (fetch.indexOf(temp[0]) < 0) {
          fetch.push(temp[0]);
          index = fetch.length - 1;
        } else {
          index = fetch.indexOf(temp[0]);
        }
        if (temp.length === 2 && !secondfetch[fetch[index]]) {
          secondfetch[fetch[index]] = [];
        }

        if (temp.length === 2) {
          secondfetch[fetch[index]].push(temp[1]);
        }
      }
      for (let i = 0; i < response.results.length; i++) {
        for (let j = 0; j < fetch.length; j++) {
          for (const mod in response.fetched_results) {
            if (response.fetched_results[mod][response.results[i][fetch[j]]]) {
              response.results[i][fetch[j]] = response.fetched_results[mod][response.results[i][fetch[j]]];
              if (secondfetch[fetch[j]]) {
                for (let k = 0; k < secondfetch[fetch[j]].length; k++) {
                  const second = secondfetch[fetch[j]][k];
                  for (const mod2 in response.fetched_results) {
                    if (response.fetched_results[mod2][response.results[i][fetch[j]][second]]) {
                      response.results[i][fetch[j]][second] =
                        response.fetched_results[mod2][response.results[i][fetch[j]][second]];
                      break;
                    }
                  }
                }
              }

              break;
            }
          }
        }

      }
    }

    return response;
  }

}

export class Callback {

  public ok: any;
  public error: any;

  constructor(ok: (data: any) => any, error: (error: any) => any) {
    this.ok = ok;
    this.error = error;
  }
}

export class Find {

  public query;
  private core;
  private isFind;
  private lastANDOR: string;
  private totalpages: number;
  private fecth: string[];


  constructor(model: string, core: SbxCoreService, isFind: boolean) {
    this.query = new QueryBuilder()
      .setDomain(SbxCoreService.environment.domain)
      .setModel(model);
    this.core = core;
    this.isFind = isFind;
    this.totalpages = 1;
  }

  public newGroupWithAnd() {
    this.query.newGroup('AND');
    this.AND();
    return this;
  }

  public newGroupWithOr() {
    this.query.newGroup('OR');
    this.AND();
    return this;
  }

  public AND() {
    this.lastANDOR = 'AND';
    return  this;
  }

  public OR() {
    this.lastANDOR = 'OR';
    return  this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereIsEqual(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, '=', value);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public whereIsNotNull(field: string) {
    this.query.addCondition(this.lastANDOR, field, 'IS NOT', null);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public whereIsNull(field: string) {
    this.query.addCondition(this.lastANDOR, field, 'IS', null);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereGreaterThan(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, '>', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereLessThan(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, '<', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereGreaterOrEqualThan(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, '>=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereLessOrEqualThan(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, '<=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereIsNotEqual(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, '!=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereLike(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereIn(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, 'IN', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public whereNotIn(field: string, value: any) {
    this.query.addCondition(this.lastANDOR, field, 'NOT IN', value);
    return this;
  }

  /**
   * Reference Join between two model
   * @param {string} field column name of principal model
   * @param {string} referenceField column name of subQuery
   */
  public whereReferenceJoinBetween(field: string, referenceField: string) {
    return new ReferenceJoin(this, field, referenceField);
  }

  public whereWithKeys(keys) {
    this.query.whereWithKeys(this.core.validateKeys(keys));
    return this;
  }

  public fetchModels(array: string[]) {
    if (this.isFind) {
      this.query.fetchModels(array);
      this.fecth = array;
    }
    return this;
  }

  public then(callBack: Callback, query?: any) {
    const option = {headers: this.core.getHeadersJSON() };
    this.core.observableToCallBack(this.core.httpClient.post(this.isFind ? this.core.$p(this.core.urls.find)
      : this.core.$p(this.core.urls.delete),
      (query == null) ? this.query.compile() : query, option), callBack);
  }

  public thenRx(query?: any) {
    const option = {headers: this.core.getHeadersJSON() };
    return this.core.httpClient.post(this.isFind ? this.core.$p(this.core.urls.find) : this.core.$p(this.core.urls.delete),
      (query == null) ? this.query.compile() : query, option).map(res => res as any);
  }

  public setPage(page: number) {
    this.query.setPage(page);
    return this;
  }

  public setPageSize(limit: number) {
    this.query.setPageSize(limit);
    return this;
  }

  private find(query?: any) {
    const option = {headers: this.core.getHeadersJSON() };
    return  this.core.httpClient.post(this.core.$p(this.core.urls.find),
      (query == null) ? this.query.compile() : query, option).map(res => res as any);

  }

  public loadAll (callBack: Callback) {
    if (this.isFind) {
      this.setPageSize(100);
      const query = this.query.compile();
      this.then(new Callback(response => {
        this.totalpages = response.total_pages;
        let i = 1;
        const temp = [];
        while (i <= this.totalpages) {
          this.setPage(i);
          temp.push(this.find(query));
          i = i + 1;
        }
        Observable.forkJoin(temp)
          .map(res => res as any).subscribe(results => {
            let result = [];
            results.forEach(array => {
              const v = array as any;
              result = result.concat(v.results);
            });
            callBack.ok(result);
          },
          error2 => {
            callBack.error(error2 as any);
          });
      }, error2 => {callBack.error(error2 as any); } ), query);
    } else {
      this.then(callBack);
    }
  }

  public loadAllRx () {
    if (this.isFind) {
      this.setPageSize(100);
      const query = this.query.compile();
      return this.thenRx(query)
        .flatMap(function (response) {
          this.totalpages = response.total_pages;
          let i = 1;
          const temp = [];
          while (i <= this.totalpages) {
            this.setPage(i);
            temp.push(this.find(query));
            i = i + 1;
          }
          return Observable.forkJoin(temp);
        })
        .map(res => res as any)
        .map(function(results){
          let result = [];
          results.forEach(array => {
            const v = array as any;
            result = result.concat(v.results);
          });
          return {success: true, results: result};
        });
    }else {
      return this.thenRx();
    }}
}

export class ReferenceJoin {

  private find: Find;
  private field: string;
  private referenceField: string;

  constructor(find: Find, field: string, referenceField: string) {
    this.find = find;
    this.field = field;
    this.referenceField = referenceField;
    this.find.whereIn(this.field, '@reference_join@');
  }

  /**
   * set model to Join
   * @param {string} referenceModel
   * @return {FilterJoin}
   */
  public in(referenceModel: string) {
    return new FilterJoin(this.find, this.field, this.referenceField, referenceModel);
  }
}


export class FilterJoin {

  private find: Find;
  private field: string;
  private referenceField: string;
  private referenceModel: string;


  constructor(find: Find, field: string, referenceField: string, referenceModel: string) {
    this.find = find;
    this.field = field;
    this.referenceField = referenceField;
    this.referenceModel = referenceModel;
    this.find.whereIn(this.field, '@reference_join@');
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public filterWhereIsEqual(field: string, value: any) {
    this.find.query.setReferenceJoin('=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNotNull(field: string) {
    this.find.query.setReferenceJoin('IS NOT', this.field, this.referenceField, this.referenceModel, null);
    return this.find;
  }

  /**
   * @param {string} field
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNull(field: string) {
    this.find.query.setReferenceJoin('IS', this.field, this.referenceField, this.referenceModel, null);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereGreaterThan(field: string, value: any) {
    this.find.query.setReferenceJoin('>', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLessThan(field: string, value: any) {
    this.find.query.setReferenceJoin('<', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereGreaterOrEqualThan(field: string, value: any) {
    this.find.query.setReferenceJoin('>=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLessOrEqualThan(field: string, value: any) {
    this.find.query.setReferenceJoin('<=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNotEqual(field: string, value: any) {
    this.find.query.setReferenceJoin('!=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLike(field: string, value: any) {
    this.find.query.setReferenceJoin('LIKE', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereIn(field: string, value: any) {
    this.find.query.setReferenceJoin('IN', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereNotIn(field: string, value: any) {
    this.find.query.setReferenceJoin('NOT IN', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

}
