import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService,ApiService, HelperService } from '../../../services';

@Component({
  selector: 'app-metadata-addedit',
  templateUrl: './metadata-addedit.page.html',
  styleUrls: ['./metadata-addedit.page.scss'],
})
export class MetadataAddeditPage implements OnInit {

  currentUser:any;
  // Data passed in by componentProps
  @Input() item: any;

  model: any={};
  loading=false;

  constructor(public modalController: ModalController,public apiService: ApiService,public helperService: HelperService,public authService:AuthService) {}

  ngOnInit() {
    this.currentUser=this.authService.currentUserValue;
    this.model=this.helperService.cloneWR(this.item);
    //conditions for dropdowns to set to _ids if there is object
    if (typeof this.model.type != 'string' && this.model.type) { this.model.type=this.model.type._id; }
    
  }

  formSubmit($event) {
    if(this.loading){
      this.helperService.presentToast('info','Please wait...')
      return;
    }
    this.loading = true;
      this.apiService.callapi(this.apiService.APIS.METADATA_ADDEDIT,this.model)
      .subscribe(
        (res) => {
          this.loading = false;
          this.helperService.presentToast('info','Changes Saved');
          this.dismiss(true);
          if(this.model.isSystem){
            location.reload();
          }
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
