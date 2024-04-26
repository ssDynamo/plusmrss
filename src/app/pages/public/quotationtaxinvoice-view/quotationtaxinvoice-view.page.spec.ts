import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuotationtaxinvoiceViewPage } from './quotationtaxinvoice-view.page';

describe('QuotationtaxinvoiceViewPage', () => {
  let component: QuotationtaxinvoiceViewPage;
  let fixture: ComponentFixture<QuotationtaxinvoiceViewPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationtaxinvoiceViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationtaxinvoiceViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
