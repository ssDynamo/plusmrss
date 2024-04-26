import { Component, OnInit } from '@angular/core';
import { AuthService, HelperService, ApiService } from './services';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: any;

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    public helperService: HelperService,
    public authService: AuthService,
    public apiService: ApiService
  ) {}

  ngOnInit() {
    this.initializeApp();
  }
    initializeApp(){
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.apiService.syncDBCache();
      //refresh token
      console.log('refresh token');
        this.authService.refreshtoken().subscribe();
    }
  }
}
