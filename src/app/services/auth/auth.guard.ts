import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from './auth.service';
import { HelperService } from '../helper/helper.service';
import { AlertController } from '@ionic/angular';
@Injectable()
export class AuthGuard implements CanActivate {
  is: any;

    constructor(private router: Router,private authService: AuthService,  private helperService: HelperService,
       public alertController: AlertController) {
        console.log("AuthGuard")
     }

   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let is_new_item_added_cart = localStorage.getItem('is_new_item_added_cart');
        const currentUser = this.authService.currentUserValue;
        if (currentUser && is_new_item_added_cart != 'true') {
            return true;
        } else if(is_new_item_added_cart == 'true') {
            const shouldLeave = await this.confirmLeave();
            console.log(shouldLeave);
            return shouldLeave;
        }


        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    async confirmLeave(): Promise<boolean> {
  let resolveLeaving;
  const canLeave = new Promise<boolean>(resolve => resolveLeaving = resolve);
  const alert = await this.alertController.create({
    header: 'Confirm leave',
    message: 'Do you want to leave the page without saving?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',

        handler: () => {
          resolveLeaving(false);
        }
      },
      {
        text: 'Yes',
        handler: () => {
          localStorage.removeItem('is_new_item_added_cart');
          resolveLeaving(true);
          //this.formSubmit(null);
        }
      }
    ]
  });
  alert.present();
  return canLeave;
}
}
