import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService, HelperService } from '../../../services';

@Component({
  selector: 'app-region-addedit',
  templateUrl: './region-addedit.page.html',
  styleUrls: ['./region-addedit.page.scss'],
})
export class RegionAddeditPage implements OnInit {


  // Data passed in by componentProps
  @Input() item: any;

  model: any={};
  loading=false;

  constructor(public modalController: ModalController,public apiService: ApiService,public helperService: HelperService) {}

  ngOnInit() {
    this.model=this.helperService.cloneWR(this.item);
  }

  formSubmit($event) {
    if(this.loading){
      this.helperService.presentToast('info','Please wait...')
      return;
    }
    this.loading = true;
      this.apiService.callapi(this.apiService.APIS.REGION_ADDEDIT,this.model)
      .subscribe(
        (res) => {
          this.loading = false;
          this.helperService.presentToast('info','Changes Saved');
          this.apiService.refreshDBcache();
          this.dismiss(true);
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  dismiss(refresh=false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'refresh':refresh
    });
  }
}
