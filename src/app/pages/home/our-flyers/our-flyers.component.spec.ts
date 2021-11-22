import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OurFlyersComponent } from './our-flyers.component';

describe('OurFlyersComponent', () => {
  let component: OurFlyersComponent;
  let fixture: ComponentFixture<OurFlyersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurFlyersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OurFlyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
