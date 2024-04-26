import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService, HelperService } from '../../../services';

@Component({
  selector: 'app-quotation-cartitem-addedit',
  templateUrl: './quotation-cartitem-addedit.page.html',
  styleUrls: ['./quotation-cartitem-addedit.page.scss'],
})
export class QuotationCartitemAddeditPage implements OnInit {
  model: any = {};
  filtered_tariff_list = [];
  loading=false;
  // Data passed in by componentProps
  @Input() item: any;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public helperService: HelperService
  ) {}

  ngOnInit() {
    if (this.item) {
      this.model=this.helperService.cloneWR(this.item);
      //console.log(this.model);
      // if (typeof this.model.type != 'string' && this.model.type) { this.model.type=this.model.type._id; }
      // if (typeof this.model.category != 'string' && this.model.category) { this.model.category=this.model.category._id; }
    }
  }

  dismiss(refresh = false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.prepateCartItemforExport();
    this.modalController.dismiss({
      dismissed: true,
      refresh: refresh,
      item :this.helperService.cloneWR(this.model),


    });
  }

  prepateCartItemforExport(){
    //calculate gst at 7%
    let gst_p=this.model.gst_percentage;
      this.model.cart_total_sub = this.helperService.TrimNumberToDecimals(this.model.cart_total_sub);

      let gsttotal:any=this.model.cart_total_sub*gst_p/100;

    this.model.gst_percentage=gst_p;

    this.model.cart_total_gst=this.helperService.TrimNumberToDecimals(gsttotal);

    this.model.cart_total=this.helperService.TrimNumberToDecimals(gsttotal+this.model.cart_total_sub);

  }

  formSubmit($event) {
    //console.log(this.model);
    if(this.model.cart_total_sub == 0 ){
      this.helperService.presentToast('error','Total Should Not Be 0');
      return 0;
    }else if(!this.model.type){
      this.helperService.presentToast('error','Select Atleast One Tariff Type');
      return 0;
    }else if(!this.model.tariff ){
      this.helperService.presentToast('error','Select Atleast One Tariff Category');
      return 0;
    }else if(!this.model.gst_percentage){
      this.helperService.presentToast('error','Select Atleast One gst percent');
      return 0;
    }
    else {
      return this.dismiss(true);
    }
  }

  filterTariffList() {
    //console.log(this.model);
     const temptarriflist = this.apiService.DBCache['TARIFF_LIST'].filter(
      (el) => el.type._id == this.model.type._id
    );

    this.filtered_tariff_list = this.helperService.cloneWR(temptarriflist);

  }

  setDates(force=false){
    if (this.model.start_date && !force) {
      this.model.end_date = this.nextYearDate(this.model.start_date);
    } else {
      this.model.start_date = new Date().toISOString().slice(0, 10);
      this.model.end_date = this.nextYearDate(this.model.start_date);
    }
  }

  refreshCalculations() {

    this.model.cart_total_sub=0;
    let temptotal:any=0;
    //get specs Fields
    if (!this.model.tariff?.isManualCalculation && this.model.tariff?.specs) {

      //Fixed Price
      if(this.model.tariff?.specs?.isFixedPrice){
        temptotal=this.helperService.TrimNumberToDecimals(this.model.tariff.specs.fixed_price);
      }
      this.model.tariff?.specs.fields.forEach((field) => {
        //Matrix Calculations : Current Support for 2 field based matrix only x, y
        if (field.type == 'matrix') {
          //check both fields exist
          if (
            field.matrix.dimensions[0]?.value
          ) {

            //get 2 or more fields of matrix from data indexes - as there are several dependencies each parent name value
            let matrixfieldstoconsider=[];
            for(let mi=0;mi<field.matrix.dimensions.length;mi++){

                if(!field.matrix.dimensions[mi]?.parent_name && field.matrix.dimensions[mi]?.value){
                  matrixfieldstoconsider.push(field.matrix.dimensions[mi]);
                }

                if(field.matrix.dimensions[mi]?.parent_name){
                  //get value by parent name
                  if(field.matrix.dimensions[mi]?.parent_value == this._calc_matrix_getValuebyParentName(field,field.matrix.dimensions[mi]?.parent_name)){
                    matrixfieldstoconsider.push(field.matrix.dimensions[mi]);
                  }
                }

            }

            //console.log("considered Matrix Fields",matrixfieldstoconsider);
            let matrixfieldstoconsiderkeyvalue:any={};

            matrixfieldstoconsider.forEach(el=>{
                matrixfieldstoconsiderkeyvalue[el.name]=el;
            });


            let matrixvaluedata:any={};

            //extract fields
            let preparearr=[];
            field.matrix.data.forEach(element => {

              let flag = true;
              let flag_true_count=0;
              //loop in dimensiondata
              element.dimensionsdata.forEach(elementd => {
                if(elementd?.name==matrixfieldstoconsiderkeyvalue[elementd.name]?.name){

                  //select loop condition check
                  if(matrixfieldstoconsiderkeyvalue[elementd.name].type=='select' && elementd.value==matrixfieldstoconsiderkeyvalue[elementd.name].value.name){
                    flag_true_count++;
                  }
                  else if(matrixfieldstoconsiderkeyvalue[elementd.name].type=='range' && matrixfieldstoconsiderkeyvalue[elementd.name].value){
                    flag_true_count++;
                  }

                }
              });

              //console.log("flag_count",flag_true_count);
              if(flag_true_count==element.dimensionsdata.length){
                matrixvaluedata=element;
              }

            });

            //console.log("Matrix value Data",matrixvaluedata);

                     //check if data value is of range or fixed value
            if(matrixvaluedata.type=='fixed'){
              let t=matrixvaluedata.price;
              temptotal+=parseInt(t);
            }
             if(matrixvaluedata.type=='range'){
              let t=matrixvaluedata.price;
              //discover ranges
              //loop through ranges
              //set final active range to ranges 0
              let activerange=matrixvaluedata.ranges[0];
              let range_field=matrixfieldstoconsider.filter(el=>el.type=='range')[0];
              let rangevalue=range_field.value;

              //discover ranges

              let dactiverng=matrixvaluedata.ranges.filter(el=> rangevalue >= el.range_from   && rangevalue <= el.range_to );
               if(dactiverng){
                 if(dactiverng[0]){
                   activerange=dactiverng[0];
                 }
               }


                 activerange?.isPricePerUnit ? t=activerange.price*rangevalue : t=activerange.price;
               if(rangevalue > activerange.range_to){
                 //get difference
                 let d= rangevalue-activerange.range_to;

                 //FixBlockPricing
                 if(activerange.isBlockPricing){
                   if(d>0){
                    let inpart:any = (d/activerange.step);
                    if(inpart % 1 != 0){
                      inpart = inpart+1;
                    }
                    //console.log("in1",inpart);

                    d=parseInt(inpart)* activerange.step;
                   }
                 }

                 let addprice= ((d/activerange.step) * activerange.price_add);

                 if(activerange?.isPricePerUnit){
                  t = activerange.price * activerange.step * activerange.range_to;
                 } else{
                  t= activerange.price;
                 }

                 t=t+ addprice;


               }


              temptotal+=this.helperService.TrimNumberToDecimals(t);


            }
          }
        }
        //End of Matrix Calculations
      });


      //Prorate Calculation For Annual Only
         //prorate Calculation
    let ddf: any;

    if (this.model.start_date && this.model.end_date && this.model.tariff?.specs?.isAnnual) {
       ddf = this.dateDiff(this.model.start_date, this.model.end_date);

       if (ddf.years > 0 && ddf.months === 0 && ddf.days === 0) {
        temptotal = temptotal * ddf.years;
      } else{
        //flatdays based calculations
        let pdp = temptotal / 365;
        temptotal=ddf.flatdays * pdp;
      }
      //console.log('DateDiff',ddf);
    }

    this.model.cart_total_sub=this.helperService.TrimNumberToDecimals(temptotal);

  }

    //console.log('Refreshing calculations', this.model);
  }

  _calc_matrix_getValuebyParentName(field,pname){
      if(field && pname){
      let d= field.matrix.dimensions.filter(el=>el.name==pname)[0];
      //console.log("d",d);
      if(d.value){
      return d.value.name;
      }
      }
      return '';
  }

  nextYearDate(date1) {
    let date2 = new Date(date1);
    let date3 = date2.setDate(date2.getDate() - 1);
    let date = new Date(date3);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear() + 1;
    let newdate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    return newdate;
  }

  dateDiff(sdate, edate) {
    //console.log('dates',sdate,edate);
    let o_sdate=new Date(sdate);
    var o_edate = new Date(edate);
    o_edate.setDate(o_edate.getDate() + 1);
    var year = o_edate.getFullYear();
    var month = o_edate.getMonth() + 1;
    var day = o_edate.getDate();
    var yy = o_sdate.getFullYear();
    var mm = o_sdate.getMonth()+1;
    var dd = o_sdate.getDate();
    var years, months, days;
    // months
    months = month - mm;
    if (day < dd) {
      months = months - 1;
    }
    // years
    years = year - yy;
    if (month * 100 + day < mm * 100 + dd) {
      years = years - 1;
      months = months + 12;
    }
    // days
    days = Math.floor((o_edate.getTime() - (new Date(yy + years, mm + months - 1, dd)).getTime()) / (24 * 60 * 60 * 1000));
    //

    //flat days
     //get no of days in between days
    let diff = Math.abs(new Date(edate).getTime() - new Date(sdate).getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24)) +1;


    return { years: years, months: months, days: days,flatdays:diffDays};
  }

  date_validate(){
    if( !(this.model.end_date >= this.model.start_date)){
      this.helperService.presentToast("error","Please Check Dates");
      //this.setDates(true);
      this.model.cart_total_sub=0;
    }
   else{
    this.refreshCalculations();
   }


  }

}
