import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { HelperService } from '../helper/helper.service';

@Injectable()
export class ApiService {
    apiUrl: string = environment.apiUrl;

    canSyncDBCache=true;
    flag_refreshlist=false;
    tempdata:any={};


    metadata: any = {
        bloodgroups: [{ name: 'A+' }, { name: 'B+' }, { name: 'AB+' }, { name: 'O+' }, { name: 'A-' }, { name: 'B-' }, { name: 'AB-' }, { name: 'O-' }],
        maritalstatuses: [{ name: 'Married' }, { name: 'Single' }, { name: 'Divorced' }, { name: 'Other' }],
        genders: [{ name: 'Male' }, { name: 'Female' }, { name: 'Other' }]
    };

    DBCache: any = {};
    syncCacheApis = [{api:'USER_LIST'},{api:'CUSTOMER_LIST'},{api:'TARIFF_LIST'},{api:'ROLE_LIST'},{api:'METADATA_CACHE_LIST'},{api:'PERMISSION_CACHE_LIST'},{api:'REGION_LIST'},{api:'CREDIT_LIST'},{api:'REFUND_CREDITLIST'}];

    //API Definitions
    APIS: any = {
        AUTH_LOGIN: { endpoint: 'auth/login', method: 'post' },
        AUTH_REFRESHTOKEN: { endpoint: 'auth/refreshtoken', method: 'post' },


        USER_LIST: { endpoint: 'user/list', method: 'get' },
        USER_ADDEDIT: { endpoint: 'user/addedit', method: 'post' },
        CHANGE_PASSWORD: { endpoint: 'user/changespassword', method: 'post' },

        ORGANIZATION_ADDEDIT: { endpoint: 'organization/addedit', method: 'post' },

        CUSTOMER_LIST: { endpoint: 'customer/list', method: 'get' },
        CUSTOMER_ADDEDIT: { endpoint: 'customer/addedit', method: 'post' },
        BULK_UPLOAD: { endpoint: 'customer/importcustomerfilepath', method: 'post' },


        QUOTATION_LIST: { endpoint: 'quotation/list', method: 'get' },
        PUBLIC_QUOTATION_LIST: { endpoint: 'public/quotation/list', method: 'get' },
        QUOTATION_ADDEDIT: { endpoint: 'quotation/addedit', method: 'post' },

        LICENSES_LIST: { endpoint: 'quotation/licenseslist', method: 'get' },

        TARIFF_LIST: { endpoint: 'tariff/list', method: 'get' },
        TARIFF_ADDEDIT: { endpoint: 'tariff/addedit', method: 'post' },

        REGION_LIST: { endpoint: 'region/list', method: 'get' },
        REGION_ADDEDIT: { endpoint: 'region/addedit', method: 'post' },

        REQUEST_LIST: { endpoint: 'request/list', method: 'get' },
        REQUEST_DASHBOARD: { endpoint: 'request/dashboard', method: 'get' },
        REQUEST_ADDEDIT: { endpoint: 'request/addedit', method: 'post' },

        BRANCH_LIST: { endpoint: 'branch/list', method: 'get' },
        BRANCH_ADDEDIT: { endpoint: 'branch/addedit', method: 'post' },

        TRANSACTION_LIST: { endpoint: 'transaction/list', method: 'get' },
        TRANSACTION_ADDEDIT: { endpoint: 'transaction/addedit', method: 'post' },
        TRANSACTION_RECONCILLATION: { endpoint: 'transaction/reconcillation', method: 'get' },
        PUBLIC_TRANSACTION_LIST: { endpoint: 'public/transaction/list', method: 'get' },


        BANKSTATEMENT_LIST: { endpoint: 'bankstatement/list', method: 'get' },
        BANKSTATEMENT_ADDEDIT: { endpoint: 'bankstatement/addedit', method: 'post' },
        BANKSTATEMENT_IMPORTFROMFILEPATH: { endpoint: 'bankstatement/importfromfilepath', method: 'post' },

        ROLE_LIST: { endpoint: 'role/list', method: 'get' },
        ROLE_ADDEDIT: { endpoint: 'role/addedit', method: 'post' },

        PERMISSION_LIST: { endpoint: 'permission/list', method: 'get' },
        PERMISSION_CACHE_LIST: { endpoint: 'permission/cachelist', method: 'get' },
        PERMISSION_ADDEDIT: { endpoint: 'permission/addedit', method: 'post' },

        FILE_UPLOAD: { endpoint: 'file/upload', method: 'post' },
        //TODO:Required API Definitions

        CALENDAR_LIST: { endpoint: 'calendar/list', method: 'get' },
        CALENDAR_ADDEDIT: { endpoint: 'calendar/addedit', method: 'post' },


        METADATA_LIST: { endpoint: 'metadata/list', method: 'get' },
        METADATA_ADDEDIT: { endpoint: 'metadata/addedit', method: 'post' },
        METADATA_CACHE_LIST : { endpoint: 'metadata/cachelist', method: 'get' },

        REPORT_GENERATE: { endpoint: 'report/generate', method: 'get' },
        REPORT_LIST: { endpoint: 'report/list', method: 'get' },
        REPORT_ADDEDIT: { endpoint: 'report/addedit', method: 'post' },

        REFUND_LIST: { endpoint: 'refund/list', method: 'get' },
        REFUND_ADDEDIT: { endpoint: 'refund/addedit', method: 'post' },
        REFUND_CREDITLIST: { endpoint: 'refund/creditlist', method: 'get' },

        CREDIT_LIST: { endpoint: 'creditnote/list', method: 'get' },
        CREDIT_ADDEDIT: { endpoint: 'creditnote/addedit', method: 'post' },
        PUBLIC_CREDIT_LIST: { endpoint: 'public/creditnote/list', method: 'get' },
        LOG_LIST: { endpoint: 'eventlog/list', method: 'get' },

        NOTIFICATION_LIST: { endpoint: 'notification/list', method: 'get' },
        NOTIFICATION_ADDEDIT: { endpoint: 'notification/addedit', method: 'post' },


        DASHBOARD_COLLECTIONS: { endpoint: 'dashboard/collections', method: 'get' },
        RENEWAL_ADDEDIT:{endpoint:'quotation/renewalpi',method:'post'},
        DOWNLOAD_PDF:{endpoint:'pdf/printpdf',method:'post'},
        EVIDENCE_ADDEDIT:{endpoint:'evidence/addedit',method:'post'},
        EVIDENCE_LIST: { endpoint: 'evidence/list', method: 'get' },
        EVIDENCE_DELETE:{endpoint:'evidence/evidencedelete',method:'post'}

    };

    constructor(private http: HttpClient, public helperService: HelperService //public events: Events,
    ) { }

    callapi(api: any, params = null, CACHE_KEY = null) {
        switch (api.method) {
            case 'get':

                return this.http.get<any>(this.apiUrl + '/' + api.endpoint, { params: params }).pipe(
                    map(data => {
                        //this.helperService.storage_set('cache:'+api.endpoint,data);
                        if(CACHE_KEY){
                         this.upsertDBcache(api.endpoint, data, CACHE_KEY);
                        }
                        return data;
                    }));
                break;

            case 'post':
                return this.http.post<any>(this.apiUrl + '/' + api.endpoint, params).pipe(
                    map(data => {
                        return data;
                    }));
                break;
        }
    }

    upsertDBcache(endpoint, data, CACHE_KEY = null) {

        if (CACHE_KEY) {
            //console.log('Upsert DB Cache : ' + CACHE_KEY);
            this.helperService.storage_set('DBCache:' + CACHE_KEY, data).then(() => {
                this.DBCache[CACHE_KEY] = data.data;
            });
        }
    }

    refreshDBcache() {
        console.log('Refreshing DB Cache');
        // this.syncPages.forEach(current => {
        //     this.helperService.storage_get('DBCache:' + current.page_key).then(data => {
        //         this.DBCache[current.page_key] = data.data;

        //     });
        // });
        this.syncDBCache();
    }

    syncDBCache() {
        this.canSyncDBCache=false;
        console.log('Syncing DB API Cache');
        this.syncCacheApis.forEach(current => {
            this.callapi(this.APIS[current.api], {limit:1000}, current.api).subscribe();
        });
    }


    uploadFile(file, reportProgress = false) {
        // console.log(file);
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post<any>(this.apiUrl + '/' + this.APIS.FILE_UPLOAD.endpoint, formData).pipe(
            map(res => res));
    }

    getObjFromDBCache(CacheName:string,_id:string){
        let object:any={};
       // console.log(CacheName,_id)
        for(let obj of this.DBCache[CacheName]){
            if(obj?._id==_id){
                object=obj;
                //console.log(JSON.stringify(obj));
                break;
            }
        }
        return object;
    }

    NgSelecttrackByFn(item: any) {
       // console.log(item);
        return item._id;
    }
}
