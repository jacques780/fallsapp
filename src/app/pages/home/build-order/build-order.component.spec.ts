import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuildOrderComponent } from './build-order.component';

describe('BuildOrderComponent', () => {
  let component: BuildOrderComponent;
  let fixture: ComponentFixture<BuildOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildOrderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
