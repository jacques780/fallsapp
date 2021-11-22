import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PvSlideComponent } from './pv-slide.component';

describe('PvSlideComponent', () => {
  let component: PvSlideComponent;
  let fixture: ComponentFixture<PvSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PvSlideComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PvSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
