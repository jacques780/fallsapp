import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhotoVideoPage } from './photo-video.page';

describe('PhotoVideoPage', () => {
  let component: PhotoVideoPage;
  let fixture: ComponentFixture<PhotoVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoVideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
