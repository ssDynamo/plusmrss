import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-user-autocomplete',
  templateUrl: './user-autocomplete.component.html',
  styleUrls: ['./user-autocomplete.component.scss'],
})
export class UserAutocompleteComponent implements OnInit,OnChanges {
  @Input() item :any; 
  @Output() newItemEvent = new EventEmitter<{}>();
  loading=false;
  items:any=[];  
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
      
     // }
    }

     setNewItem(value){  
      this.newItemEvent.emit(value); 
    }
}






 
 
