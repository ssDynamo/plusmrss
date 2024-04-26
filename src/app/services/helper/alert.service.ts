import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateConfigService } from './translate-config.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private translateService: TranslateConfigService,
    public toastCtrl: ToastController,
  ) { }


  async presentToast(type, header: string, msg = null) {
    let color = 'primary';
    console.log(type);
    switch (type) {

      case 'success':
        color = "success";
        break;

      case 'error':
        color = 'danger';
        break;
      case 'info':
        color = 'primary';
        break;

      default:
        color = 'info';
        break;
    }
    const toast = await this.toastCtrl.create({
      header: this.translateService.gettranslate(header),
      message: msg,
      duration: 3000,
      color: color,
      position: 'top',
      buttons: [
        {
          text: this.translateService.gettranslate(`Done`),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }
}
