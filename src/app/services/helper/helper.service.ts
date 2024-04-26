import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Location } from '@angular/common'
import { ToastController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable()
export class HelperService {
  apiUrl: string = environment.apiUrl;
  private _storage: Storage | null = null;
  liveparams: any = {};
  data_appversion:any={};

  canshowheadersidebar=true;
  globalloading=false;
  is_new_item_added_cart =false;


  constructor(private http: HttpClient, private storage: Storage, private location: Location,public toastCtrl: ToastController, public alertCtrl: AlertController ) {
    this.initStorage();
  }

  initStorage() {
    console.log('storage');
    this.storage.defineDriver(CordovaSQLiteDriver);
    this.storage.create();
  }

  isDevInstance(){
    if(this.apiUrl.includes('dev')){
      return true;
    } else {
      return false;
    }
  }


  public storage_set(settingName, value) {
    return this.storage.set(`setting:${settingName}`, value);
  }
  public async storage_get(settingName) {
    return await this.storage.get(`setting:${settingName}`);
  }
  public async storage_remove(settingName) {
    return await this.storage.remove(`setting:${settingName}`);
  }
  public storage_clear() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }


  canLoadTutorial() {
    return this.storage.get('ion_did_tutorial').then(res => {
      if (res) {
        return false;
      } else {
        return true;
      }
    });
  }

  getPlainNameString(s) {
    return s.toLowerCase().replace(/\s/g, '');
  }

  cloneWR(p) {
    return p?JSON.parse(JSON.stringify(p)):'';
  }

  async presentAlert(header, subheader=null,msg = null) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subheader,
      message:msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentToast(type, header, msg = null) {
    let color = 'primary';
    console.log(type);
    switch (type) {

      case 'success':
        color = "success";
        break;

      case 'error':
        color = 'danger';
        break;

      default:
        color = 'primary';
    }
    const toast = await this.toastCtrl.create({
      header: header,
      message: msg,
      duration: 3000,
      color: color,
      position: 'top',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }


  fetchLocal(url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest
      xhr.onload = function () {
        resolve(new Response(xhr.response, { status: xhr.status }))
      }
      xhr.onerror = function () {
        reject(new TypeError('Local request failed'))
      }
      xhr.open('GET', url)
      xhr.responseType = "blob";
      xhr.send(null)
    })
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

  }
  getNamesFromArray(data) {
    let a=[];
    if(!Array.isArray(data)){
      a=[data];
    } else{a=data;}
    let mapStringName = a.map(item => item.name);
    return mapStringName;
  }

  goBack(){
    this.location.back();
  }

  setAppVersionDetails(data:any){
    this.data_appversion=data;

 }

  getAppVersionDetails(){
     return this.data_appversion;
  }

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }

  toggleMenu() {
    const splitPane = document.querySelector('ion-split-pane');
    const windowWidth = window.innerWidth;
    const splitPaneShownAt = 992;
    const when = `(min-width: ${splitPaneShownAt}px)`;
    if (windowWidth >= splitPaneShownAt) {
      // split pane view is visible
      const open = splitPane.when === when;
      splitPane.when = open ? false : when;
    } else {
      // split pane view is not visible
      // toggle menu open
      const menu = splitPane.querySelector('ion-menu');
      return menu.open();
    }
  }

  TrimNumberToDecimals(v,l=2){
    let value = parseFloat(v);
    let dc=100;
    switch(l){
      case 2:
        dc=100;
        break;
      case 0:
        dc=1;
    }

    value = Math.round(value*dc)/dc; // 10 defines 1 decimals, 100 for 2, 1000 for 3
    return value;
  }

  windowpopup(path='',width=880,height=700){
    window.open(path, '_blank', 'toolbar=no,scrollbars=yes,resizable=yes,top=50,left=200,width='+width+',height='+height);
  }
}
