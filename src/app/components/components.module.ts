import { OpenViduVideoComponent } from './../shared/components/stream/ov-video.component';
import { StreamComponent } from './../shared/components/stream/stream.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  declarations: [
    StreamComponent,
    OpenViduVideoComponent
  ],
  exports: [
    StreamComponent,
    OpenViduVideoComponent
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
