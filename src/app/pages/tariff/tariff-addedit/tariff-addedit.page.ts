import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {JsonEditorOptions} from "@maaxgr/ang-jsoneditor";
import { ApiService, HelperService } from '../../../services';
@Component({
  selector: 'app-tariff-addedit',
  templateUrl: './tariff-addedit.page.html',
  styleUrls: ['./tariff-addedit.page.scss'],
})
export class TariffAddeditPage implements OnInit {
  // Data passed in by componentProps
  @Input() item: any;

  model: any = {};
  loading = false;
  JSONinitialData:any;
  JSONvisibleData:any;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public helperService: HelperService,
    public editorOptions: JsonEditorOptions
  ) {}

  ngOnInit() {
    this.model = this.helperService.cloneWR(this.item);
    if (typeof this.model.type != 'string' && this.model.type) { this.model.type=this.model.type._id; }
    this.showJSONEditor();
  }

  showJSONEditor(){
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code'];
    if(this.model.specs){
    this.JSONinitialData = this.model.specs;
    this.JSONvisibleData = this.JSONinitialData;
    }
  }
  showJson(d: any) {
   
    if(d.fields){
    this.JSONvisibleData = d;
    console.log(d);
    this.model.specs=d;
    }
   // this.model.specs=d;
  }

  formSubmit($event) {
    if (this.loading) {
      this.helperService.presentToast('info', 'Please wait...');
      return;
    }
    this.loading = true;
    this.apiService
      .callapi(this.apiService.APIS.TARIFF_ADDEDIT, this.model)
      .subscribe(
        (res) => {
          this.loading = false;
          this.helperService.presentToast('info', 'Changes Saved');
          this.dismiss(true);
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  dismiss(refresh = false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      refresh: refresh,
    });
  }
}
