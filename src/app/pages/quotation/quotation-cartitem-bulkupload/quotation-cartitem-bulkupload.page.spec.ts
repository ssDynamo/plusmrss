import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuotationCartitemBulkUploadPage } from './quotation-cartitem-bulkupload.page';

describe('QuotationCartitemBulkUploadPage', () => {
  let component: QuotationCartitemBulkUploadPage;
  let fixture: ComponentFixture<QuotationCartitemBulkUploadPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationCartitemBulkUploadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationCartitemBulkUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
