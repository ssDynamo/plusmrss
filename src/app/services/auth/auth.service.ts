import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../api/api.service';
@Injectable()
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, public apiService: ApiService) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  checkPermission(alias) {
    //const cu= this.getCurrentUser();
    const cu = this.currentUserSubject.value;
    if (!cu) {
      return false;
    }
    // if(cu.role.allowall_super === '1'){
    //     return true;
    // }
    // console.log(cu,"cu");
    if (cu.role.isAdmin) {
      if (alias == 'metadata_list' && cu._id != '61af88b38c9563d58637ea15') {
        return false;
      }

      return true;
    } else if (cu.role.permissions) {
      const pus = cu.role.permissions;
      if (alias == 'metadata_list' && cu._id != '61af88b38c9563d58637ea15') {
        return false;
      }
      //console.log(pus, pus.filter(ele => ele.alias == alias));
      var matchal = pus.filter((ele) => ele.alias == alias);
      if (matchal.length > 0) {
        return true;
      } else {
        return false;
        console.log('b');
      }
    }
    //       return true;
  }

  login(params) {
    return this.http
      .post<any>(
        this.apiUrl + '/' + this.apiService.APIS.AUTH_LOGIN.endpoint,
        params
      )
      .pipe(
        map((data) => {
          if (data && data.token) {
            this._syncUser(data);
          }
          return data;
        })
      );
  }

  refreshtoken(params = null) {
    return this.http
      .post<any>(
        this.apiUrl + '/' + this.apiService.APIS.AUTH_REFRESHTOKEN.endpoint,
        params
      )
      .pipe(
        map((data) => {
          this._syncUser(data);
          return data;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  _syncUser(data) {
    //return this.http.get<User[]>(`${environment.apiUrl}/users`);
    localStorage.setItem('currentUser', JSON.stringify(data));
    this.currentUserSubject.next(data);
    return true;
    //onesignal not in picture yet
    // if(data.contact){
    // let tags ={name:data.contact.name,organizationName : data.contact.organization.name,organizationKey : data.contact.organization.key,mobile : data.contact.mobile, contact_id:data.contact._id,organization_id:data.contact.organization._id};
    // console.log(tags);
    // if( window["plugins"]){
    // window["plugins"].OneSignal.setExternalUserId(data._id, (results) => {

    //     console.log('Results of setting external user id');
    //     console.log(results);
    // });
    // window["plugins"].OneSignal.sendTags(tags);
    // }
    // }
  }
}
