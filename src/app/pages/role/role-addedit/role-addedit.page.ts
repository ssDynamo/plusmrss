import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService, HelperService } from '../../../services';
import { IonAccordionGroup } from '@ionic/angular';

@Component({
  selector: 'app-role-addedit',
  templateUrl: './role-addedit.page.html',
  styleUrls: ['./role-addedit.page.scss'],
})
export class RoleAddeditPage implements OnInit {
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;

  // Data passed in by componentProps
  @Input() item: any;
  filtermodel: any = {};
  model: any={};
  items: any={};
  allPermission: any ={};
  checkAllList: any = {};
  checkallflag=false;
  loading=false;
  pagination = {
    limit: 1000,
    page: 1,
    count: 0,
    offset :0
 };
  map: any;


  constructor(public modalController: ModalController,public apiService: ApiService,public helperService: HelperService) {}

  ngOnInit() {
    this.model.permissions=[];
    this.model=this.helperService.cloneWR(this.item);
    //this.getList();

  }
  logAccordionValue() {
    console.log(this.accordionGroup.value);
  }
  closeAccordion() {
    this.accordionGroup.value = undefined;
  }
  formSubmit($event) {
    if(this.loading){
      this.helperService.presentToast('info','Please wait...');
      return;
    }
    this.loading = true;
      this.apiService.callapi(this.apiService.APIS.ROLE_ADDEDIT,this.model)
      .subscribe(
        (res) => {
          this.loading = false;
          this.helperService.presentToast('info','Changes Saved');
          this.dismiss(true);
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  changeModel(ev, list, val) {
  console.log(val,ev,);
  if(list){
  } else{
     list=[];
  }

  if (ev.target.checked) {
     list.push(val);
  } else {
    let i = list.indexOf(val);
    list.splice(i, 1);
  }
  console.log(list,this.model.permissions);
}

checkIncludes(id){
    if(this.model.permissions){
    return this.model.permissions.includes(id);
   }
   else {
    return false;
  }
 }
 getList() {
  this.loading = true;
  let params: any = {...this.filtermodel};
  params.page = this.pagination.offset + 1;
  params.limit = this.pagination.limit;
  this.apiService.callapi(this.apiService.APIS.PERMISSION_LIST, params).subscribe(
    (res) => {
      this.items = res.data;
      console.log("this.items",this.items);
    },
    (err) => {
      this.loading = false;
    }
  );
}
 checkAll(){
  // console.log(this.allnos,this.model.permissions);
  if(this.checkallflag){
      this.model.permissions=JSON.parse('[]');
  } else{
    // this.model.permissions=this.allnos;
  }

  this.checkallflag=!this.checkallflag;
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
