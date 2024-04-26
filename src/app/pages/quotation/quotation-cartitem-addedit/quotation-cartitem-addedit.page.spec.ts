import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuotationCartitemAddeditPage } from './quotation-cartitem-addedit.page';

describe('QuotationCartitemAddeditPage', () => {
  let component: QuotationCartitemAddeditPage;
  let fixture: ComponentFixture<QuotationCartitemAddeditPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationCartitemAddeditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationCartitemAddeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
