import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-customer-autocomplete',
  templateUrl: './customer-autocomplete.component.html',
  styleUrls: ['./customer-autocomplete.component.scss'],
})
export class CustomerAutocompleteComponent implements OnInit,OnChanges {
  @Input() item :any; 
  @Output() newItemEvent = new EventEmitter<{}>();
 
  custLoading = false;
  custTypeahead = new Subject<string>();

  items:any=[];

  loading=false;

  
  selectedItem:any={};


  constructor(private cd: ChangeDetectorRef,public apiService:ApiService) { }


    ngOnInit() {
        this._init();
    }

      ngOnChanges() {
      //this._init();
     }

    _init(){
      this.loading=true;
      this.custLoading=true;
      let _canLoad=true;
      if(this.item ){
        if(this.selectedItem?._id==this.item?._id){
          _canLoad=false; 
        }
        this.selectedItem=this.item;
        this.items.push(this.item);
        console.log(this.items);
      }
       
     // if(this.item != this.selectedPerson || !this.selectedPerson){
     this.loading=false; 
     this.custLoading=false;
     if(_canLoad){
     this.loadItems();
     }
     // }
    }

    trackByFn(item: any) {
        return item._id;
    }

    private loadItems() {
        // this.people$ = concat(
        //     of([]), // default items
        //     this.peopleInput$.pipe(
        //         distinctUntilChanged(),
        //         tap(() => this.peopleLoading = true),
        //         switchMap(term => this.apiService.callapi(this.apiService.APIS.CUSTOMER_LIST,{q:term,returnautocompletearray:true}).pipe(
        //             catchError(() => of([])), // empty list on error
        //             tap(() => this.peopleLoading = false)
        //         ))
        //     )
        // );


        this.custTypeahead.pipe(
          tap(() => this.custLoading = true),
          distinctUntilChanged(),
          debounceTime(200),
          switchMap(term => this.apiService.callapi(this.apiService.APIS.CUSTOMER_LIST,{q:term,returnautocompletearray:true,limit:50})),
        ).subscribe(x => {
          if(x.length>0){ this.items = x;}
          console.log('x',x);
          this.custLoading = false;
          this.cd.markForCheck();
         // this.cd.markForCheck();
        }, () => {
           this.items = [];
        });


    }

    setNewItem(value){  
        this.newItemEvent.emit(value); 
    }
}
