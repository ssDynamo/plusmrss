import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'
import { ChangePasswordComponent } from 'src/app/pages/auth/change-password/change-password.component';

import { AuthService,HelperService,ApiService } from '../../services';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  currentUser:any;
  isPopoverOpen=false;

  constructor(public authService:AuthService,public apiService:ApiService,public helperService:HelperService,
    private router:Router,private alertController:AlertController, public modalController: ModalController
    ) { }

  ngOnInit() {

    this.currentUser=this.authService.currentUserValue;
  }

  async presentLogoutConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure to Logout ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Yes',
          handler: () => {
            this.helperService.presentToast('info','Logging out...')
            this.authService.logout();
            this.helperService.storage_clear();
            setTimeout(() => {
              this.router.navigateByUrl('/auth?salt=' + Math.random(), {
                replaceUrl: true,
              });

            }, 2000);
          },
        },
      ],
    });

    await alert.present();
  }

  async changePassword(){
    const alertpass = await this.alertController.create({
      header: 'Change Password',
      subHeader: 'Fill up the fields.',
      inputs: [
        {
          name: 'oldPassword',
          placeholder: 'Old Password.',
          type: 'password'
        },
        {
          name: 'newPassword',
          placeholder: 'New Password.',
          type: 'password',
          // value: this.generatePassword(8)
        },
        {
          name: 'newPasswordConfirm',
          placeholder: 'Confirm New Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked.');
          }
        },
        {
          text: 'View Password',
          handler: data => {
            data.newPassword.type = 'text'; //Error exists
            return false;
          }
        }
      ]
    });
    await alertpass.present();
  }//

  async presentChangePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordComponent,
      cssClass: 'user-addedit-page',
      componentProps: {
        item: this.currentUser,
      }
    });

    modal.dismiss().then((res:any) => {
     //const user = data['data']; // Here's your selected user!

     if(res.data?.refresh){
     }

    });


    return await modal.present();
  }


}
