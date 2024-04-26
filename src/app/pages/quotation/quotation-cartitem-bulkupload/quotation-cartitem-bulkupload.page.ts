import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService, HelperService } from '../../../services';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quotation-cartitem-bulkupload',
  templateUrl: './quotation-cartitem-bulkupload.page.html',
  styleUrls: ['./quotation-cartitem-bulkupload.page.scss'],
})
export class QuotationCartitemBulkUploadPage implements OnInit {
  model: any = {};
  filtered_tariff_list = [];
  loading=false;
  is_upload_excel = true;
  items: any = [];
  // Data passed in by componentProps
  @Input() item: any;
  master_teriff_type: any = [];
  master_tarriflist: any = [];
  is_fileUpload: boolean = false;
  bulkuploadfile: string;
  master_customerlist: any = [];

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public helperService: HelperService
  ) {}

  ngOnInit() {
    if (this.item) {
      this.model=this.helperService.cloneWR(this.item);
      console.log(this.model);
      // if (typeof this.model.type != 'string' && this.model.type) { this.model.type=this.model.type._id; }
      // if (typeof this.model.category != 'string' && this.model.category) { this.model.category=this.model.category._id; }
    }

    if(this.items.length>0){
      this.is_upload_excel = false;
    }
    this.bulkuploadfile = environment.apiUrl+'/uploads/sample_bulkupload_cartitem_new.xlsx';

    this.master_teriff_type = this.apiService.DBCache['METADATA_CACHE_LIST']['tariff_type'];
    this.master_tarriflist = this.apiService.DBCache['TARIFF_LIST'];
    this.master_customerlist = this.apiService.DBCache['CUSTOMER_LIST'];
  }

  dismiss(refresh = false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
   if(refresh){
    this.prepateCartItemforExport();
   }else
   {
    this.items = [];
   }
   
    this.modalController.dismiss({
      dismissed: true,
      refresh: refresh,
      item :this.helperService.cloneWR(this.items),
    });
   
   
  }
 

  onFileChange(event: any) {
   
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    this.is_fileUpload = true;
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
     
      const binarystr: string = e.target.result;
     
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
     
      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    
     
      /* save data */
      let data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
     
      console.log(data,'data xlx'); // Data will be logged in array format containing objects
     
      this.helperService.presentToast('info', 'File uploded successfully');
      this.is_fileUpload = false;
      setTimeout(()=>{this.prepareJson(data)}, 2000);   
    };
 }

  prepateCartItemforExport(){

    for(let i=0; i<this.items.length;i++){
     //calculate gst at 7%
     let gst_p=this.model.gst_percentage;
     this.items[i].cart_total_sub = this.helperService.TrimNumberToDecimals(this.items[i].cart_total_sub);

     let gsttotal:any=this.items[i].cart_total_sub*gst_p/100;

   this.items[i].gst_percentage=gst_p;

   this.items[i].cart_total_gst=this.helperService.TrimNumberToDecimals(gsttotal);

   this.items[i].cart_total=this.helperService.TrimNumberToDecimals(gsttotal+this.items[i].cart_total_sub);
   
    }
   

  }

  formSubmit($event) {
    
      return this.dismiss(true);

  }

  filterTariffList(i) {
    console.log(this.items[i]);
     const temptarriflist = this.apiService.DBCache['TARIFF_LIST'].filter(
      (el) => el.type._id == this.items[i].type._id
    );

    this.filtered_tariff_list = this.helperService.cloneWR(temptarriflist);

  }

  setDates(i,force=false){
    if (this.items[i].start_date && !force) {
      this.items[i].end_date = this.nextYearDate(this.items[i].start_date);
    } else {
      this.items[i].start_date = new Date().toISOString().slice(0, 10);
      this.items[i].end_date = this.nextYearDate(this.items[i].start_date);
    }
  }
  async prepareJson(data){
   //forloop
    for(let i=0; i<data.length;i++){
      
        console.log("*************");
        let temp_item = {};
        temp_item['licensee'] = this.model.licensee;

        if(data[i]['licensee_name']){
          let temp = this.master_customerlist.filter(c=> c.name == data[i]['licensee_name']);
          console.log(temp);
          temp_item['licensee'] = temp[0];
        }
      
    
        let sd = data[i]['start_date'].split("-");
        let ed = data[i]['end_date'].split("-");
    
        temp_item['start_date'] =  ""+sd[2]+"-"+sd[1]+"-"+sd[0]+"";
        temp_item['end_date'] =  ""+ed[2]+"-"+ed[1]+"-"+ed[0]+"";
        
        let tempteriff_type = this.master_teriff_type.filter(t=> t.name == data[i]['tariff_type']);
       
        data[i]['type'] = tempteriff_type[0];
        temp_item['type'] = tempteriff_type[0];
        
    
        let tempteriff= this.master_tarriflist.filter(t=> t.code == data[i]['tariff_code'] && t.type._id==temp_item['type']._id);
        if(tempteriff && tempteriff.length >0){
        data[i]['tariff'] = tempteriff[0];
        temp_item['tariff'] = tempteriff[0];
       
        let data1:any = this.get_cart_total_sub(temp_item);
        var rs:any=[];
        rs[0]=data[i]['custom_field1_value'];
        rs[1]=data[i]['custom_field2_value'];
        rs[2]=data[i]['custom_field3_value'];
        rs[3]=data[i]['custom_field4_value'];
        console.log(rs ,'data[i] filed');

        data1.tariff?.specs.fields.forEach((field) => {
          //Matrix Calculations : Current Support for 2 field based matrix only x, y
          if (field.type == 'matrix') {
            var j=0;
            for(let mi=0;mi<field.matrix.dimensions.length;mi++){

              if(!field.matrix.dimensions[mi]?.parent_name){
                if(field.matrix.dimensions[mi].options.length > 1){
                  
                  field.matrix.dimensions[mi].value=field.matrix.dimensions[mi].options[parseInt(rs[j])-1] ;
                  j++;
                }else{
                  
                  field.matrix.dimensions[mi].value=rs[j];
                  j++;
                }
                
              }

              if(field.matrix.dimensions[mi]?.parent_name){
                //get value by parent name
                console.log(field.matrix.dimensions[mi-1]?.parent_name, 'parent_name',field.matrix.dimensions[0]);
                if(field.matrix.dimensions[mi]?.parent_value == this._calc_matrix_getValuebyParentName(field,field.matrix.dimensions[mi]?.parent_name)){
                  if(field.matrix.dimensions[mi].options.length > 1){
                    
                    field.matrix.dimensions[mi].value=field.matrix.dimensions[mi].options[parseInt(rs[j])-1] ;
                    j++;
                  }else{
                    
                    field.matrix.dimensions[mi].value=rs[j];
                    j++;
                  }
                }
              }field.matrix.dimensions[mi-1]?.parent_name

          }

          }
        })
    
        // //calculate dimensions
        // if(data1.tariff.specs.fields[0].matrix.dimensions.length>0 && data[i]['custom_field1']){
          
        //   let tempDimensions = [];
        //   tempDimensions = data1.tariff.specs.fields[0].matrix.dimensions;
         
        //   if(data[i]['custom_field1']){
        //     let sd = tempDimensions.findIndex(d=> d.name == data[i]['custom_field1'] && !d.parent_name);
        //     if(sd>=0 && tempDimensions[sd].type == 'select'){
        //       let tempOptions:any[] = tempDimensions[sd].options;
        //       let value = tempOptions.filter(to=>to.name == data[i]['custom_field1_value'])[0];
        //       tempDimensions[sd].value = value;              
        //     }
        //     if(sd>=0 && tempDimensions[sd].type == 'range'){
        //       tempDimensions[sd].value = data[i]['custom_field1_value'];              
        //     }
        //   }
    
        //   if(data[i]['custom_field2']){
        //     let sd = tempDimensions.findIndex(d=> d.name == data[i]['custom_field2'] && !d.parent_name);
        //     if(sd>=0 && tempDimensions[sd].type == 'console.log('a');select'){
        //       let tempOptions:any[] = tempDimensions[sd].options;
        //       let value = tempOptions.filter(to=>to.name == data[i]['custom_field2_value'])[0];
        //       tempDimensions[sd].value = value;
        //     } 
        //     if(sd>=0 && tempDimensions[sd].type == 'range'){
        //       tempDimensions[sd].value = data[i]['custom_field2_value'];              
        //     }
        //   }
    
        //   data1.tariff.specs.fields[0].matrix.dimensions = tempDimensions;
        // }
        console.log(data1)
        this.items.push(data1);
        
        this.refreshCalculations(this.items.length-1);

      }
    }

    this.dismiss(true);
  }

  get_cart_total_sub(obj){
  
    obj.cart_total_sub=0;
    let temptotal:any=0;
    //get specs Fields
    if (!obj.tariff?.isManualCalculation && obj.tariff?.specs) {
      //Fixed Price
      if(obj.tariff?.specs?.isFixedPrice){
        temptotal=this.helperService.TrimNumberToDecimals(obj.tariff.specs.fixed_price);
      }

      //Prorate Calculation For Annual Only
      //prorate Calculation
      let ddf: any;

      if (obj.start_date && obj.end_date && obj.tariff?.specs?.isAnnual) {
        ddf = this.dateDiff(obj.start_date, obj.end_date);

        if (ddf.years > 0 && ddf.months === 0 && ddf.days === 0) {
          temptotal = temptotal * ddf.years;
        } else{
          //flatdays based calculations
          let pdp = temptotal / 365;
          temptotal=ddf.flatdays * pdp;
        }
        console.log('DateDiff',ddf);
      }

      obj.cart_total_sub=this.helperService.TrimNumberToDecimals(temptotal);

    }

    console.log('Refreshing calculations', obj);
    return obj;
  }

  refreshCalculations(i) {
   
    this.items[i].cart_total_sub=0;
    let temptotal:any=0;
    //get specs Fields
    if (!this.items[i].tariff?.isManualCalculation && this.items[i].tariff?.specs) {

      //Fixed Price
      if(this.items[i].tariff?.specs?.isFixedPrice){
        temptotal=this.helperService.TrimNumberToDecimals(this.items[i].tariff.specs.fixed_price);
      }
      this.items[i].tariff?.specs.fields.forEach((field) => {
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

            console.log("considered Matrix Fields",matrixfieldstoconsider);
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

              console.log("flag_count",flag_true_count);
              if(flag_true_count==element.dimensionsdata.length){
                matrixvaluedata=element;
              }

            });

            console.log("Matrix value Data",matrixvaluedata);

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
                    console.log("in1",inpart);

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

    if (this.items[i].start_date && this.items[i].end_date && this.items[i].tariff?.specs?.isAnnual) {
       ddf = this.dateDiff(this.items[i].start_date, this.items[i].end_date);

       if (ddf.years > 0 && ddf.months === 0 && ddf.days === 0) {
        temptotal = temptotal * ddf.years;
      } else{
        //flatdays based calculations
        let pdp = temptotal / 365;
        temptotal=ddf.flatdays * pdp;
      }
      console.log('DateDiff',ddf);
    }

    this.items[i].cart_total_sub=this.helperService.TrimNumberToDecimals(temptotal);

  }

    console.log('Refreshing calculations', this.items[i]);
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
    console.log('dates',sdate,edate);
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

  date_validate(i){
    if( !(this.items[i].end_date >= this.items[i].start_date)){
      this.helperService.presentToast("error","Please Check Dates");
      //this.setDates(true);
      this.model.cart_total_sub=0;
    }
   else{
    this.refreshCalculations(i);
   }


  }

}
