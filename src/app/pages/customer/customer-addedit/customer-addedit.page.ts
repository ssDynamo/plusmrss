import { Component, OnInit,Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService, HelperService } from '../../../services';
@Component({
  selector: 'app-customer-addedit',
  templateUrl: './customer-addedit.page.html',
  styleUrls: ['./customer-addedit.page.scss'],
})
export class CustomerAddeditPage implements OnInit {
  @Input() item: any;

  model: any={};
  loading=false;
  selected: boolean;
  flagerror=false;

  constructor(public modalController: ModalController,public apiService: ApiService,public helperService: HelperService, public alertController:AlertController) {}

  ngOnInit() {
    this.model=this.helperService.cloneWR(this.item);
    if(!this.model.documents){
      this.model.documents = [];
    }
  }

  formSubmit($event) {
    if(this.loading){
      this.helperService.presentToast('info','Please wait...');
      return;
    }
    this.loading = true;
    if(this.flagerror != true){
      this.apiService.callapi(this.apiService.APIS.CUSTOMER_ADDEDIT,this.model)
      .subscribe(
        (res) => {
          this.loading = false;
          this.helperService.presentToast('info','Changes Saved');
          this.dismiss(true);
        },
        (err) => {
          this.loading = false;
          this.flagerror = false;
        }
      );
    } else {
      this.loading = false;
      this.flagerror = false;
    }
  }

  dismiss(refresh=false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'refresh':refresh
    });
  }

      formValidate($event,cf,$object: any=null){
    let regexp: any;
    let val: any=$event.target.value;
    if(val.length < 1){return 0;}
        switch(cf){
          case 'email':
            regexp= /\S+@\S+\.\S+/;
            //console.log(regexp.test(val));
            if(regexp.test(val)){

            } else {
              $event.target.value='';
              $object='';
              this.model.email='';
              this.flagerror=true;
              this.helperService.presentToast('error','Invalid Email Address');
            }
            break;
            case 'mobile':
            regexp= /^([0-9]){8,10}?$/;
           // console.log(regexp.test(val));
            if(regexp.test(val)){
            } else {
              $event.target.value='';
              $object='';
              this.model.mobile='';
              this.flagerror=true;
              this.helperService.presentToast('error','Invalid Customer Mobile Number');
            }
            break;
            case 'contact':
              regexp= /^([0-9]){8,10}?$/;
              //console.log(regexp.test(val));
              if(regexp.test(val)){
              } else {
                $event.target.value='';
                $object='';
                this.model.contact_mobile='';
                this.flagerror=true;
                this.helperService.presentToast('error','Invalid Contact Mobile Number');
              }
              break;
          case 'name':
          regexp= /^[a-zA-Z\s-, ]+$/;
          //console.log(regexp.test(val));
          if(regexp.test(val)){
          } else {
            $event.target.value='';
            $object='';
            this.model.name='';
            this.flagerror=true;
            this.helperService.presentToast('error','Invalid Customer Name');
          }
          break;
          case 'postal-code':
          regexp= /^([0-9]){6}?$/;
          //console.log(regexp.test(val));
          if(regexp.test(val)){
          } else {
            $event.target.value='';
            $object='';
            this.model.postalcode='';
            this.flagerror=true;
            this.helperService.presentToast('error','Invalid Postal Code');
          }
          break;
          case 'address1':
            regexp= /^[ A-Za-z0-9_@./#&-]*$/;
            //console.log(regexp.test(val));
            if(regexp.test(val)){
            } else {
              $event.target.value='';
            $object='';
            this.model.address_1='';
            this.flagerror=true;
            this.helperService.presentToast('error','Invalid Address-line 1');
            }
          break;
          case 'address2':
            regexp= /^[ A-Za-z0-9_@./#&-]*$/;
            //console.log(regexp.test(val));
            if(regexp.test(val)){
            } else {
              $event.target.value='';
            $object='';
            this.model.address_2='';
            this.helperService.presentToast('error','Invalid Address-line 2');
            }
          break;
          case 'number':
            regexp= /^([0-9]){1,5}?$/;
            //console.log(regexp.test(val),'value');
            if(regexp.test(val)){
            }else if(this.model.district){
              $event.target.value='';
              $object='';
              this.model.district='';
              this.flagerror=true;
              this.helperService.presentToast('error','Invalid District Code');
             }
            else {
              $event.target.value='';
              $object='';
              this.model.no_of_outlets='';
              this.flagerror=true;
              this.helperService.presentToast('error','Invalid Number of Outlets');
            }
          break;
        }
        if(this.flagerror == true){
        $event.target.focus();
        }
      }

      // filter(){
      //   this.getList();
      // }

       address(value){
        //console.log(value);
        if(value){
          this.model.name =   (value.name)? value.name : '';
          this.model.first_name =   (value.first_name)? value.first_name : '';
          this.model.last_name =   (value.last_name)? value.last_name : '';
          this.model.email =   (value.email)? value.email : '';
          this.model.mobile =   (value.mobile)? value.mobile : '';
          this.model.brands =   (value.brands)? value.brands : '';
          this.model.category =   (value.category)? value.category : '';
          //this.model.ucode =   (value.ucode)? value.ucode : '';
          this.model.uen_no =   (value.uen_no)? value.uen_no : '';
          this.model.address_1= (value.address_1)? value.address_1 : '';
          this.model.address_2= (value.address_2)? value.address_2 : '';
          this.model.postalcode= ( value.postalcode)?  value.postalcode : '';
          this.model.district= (value.district)? value.district : '';
          this.model.no_of_outlets= (value.no_of_outlets)? value.no_of_outlets : '';
          this.model.supplier= (value.supplier)? value.supplier : '';
          this.model.remark= (value.remark)? value.remark : '';
          this.model.contact_email= (value.contact_email)? value.contact_email : '';
          this.model.contact_name= (value.contact_name)? value.contact_name : '';
          this.model.contact_mobile= (value.contact_mobile)? value.contact_mobile : '';
          this.model.status= (value.status)? value.status : '';

        }

      }

      changeAddress(address: any,value){
        //console.log(value);
        if(value.detail.checked === true){
          this.model.operating_address_1= address.address_1;
          this.model.operating_address_2= address.address_2;
          this.model.operating_postalcode= address.postalcode;
          this.model.operating_distric= address.district;
        }else {
          this.model.operating_address_1= '';
          this.model.operating_address_2= '';
          this.model.operating_postalcode= '';
          this.model.operating_distric= '';
        }
      }

      handleFileInput($event){
        let files=$event.target.files;
        this.helperService.presentToast("info","Uploading File");
        //console.log(files);
        this.apiService.uploadFile(files[0])
        .subscribe(res => {
           //console.log(res);
           let tempobj = {
            path: res.data.path,
            filename: res.data.filename,
           }
           this.model.documents.push(tempobj);
           //this.model.digital_signature_url= ;
           this.helperService.presentToast("info","File Uploaded, Processing Records");
        });
      }

      async presentCartDeleteConfirm(index) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Are you sure, Do you want to delete the file?',
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
                this.helperService.presentToast('info','Removing Document...');
                setTimeout(()=>{
                  let array = this.model.documents;
                  if (index > -1) { // only splice array when item is found
                    array.splice(index, 1); // 2nd parameter means remove one item only
                  }
                },1000);                
              },
            },
          ],
        });
    
        await alert.present();
      }

    }
