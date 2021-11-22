import { HideHeaderDirective } from './../../directives/hide-header.directive';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePageRoutingModule } from './home-routing.module';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  HomePage, ContactComponent, OrderHistoryComponent, BuildOrderComponent, OurFlyersComponent,
  NotificationComponent, BoDetailsComponent
} from '.';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LongPressDirective, NumberMaskDirective } from '../../directives';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { VideoCallComponent } from './video-call/video-call.component';
import { OvVideoComponent } from './video-call/ov-video/ov-video.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    PdfViewerModule
  ],
  declarations: [
    HomePage,
    ContactComponent,
    OrderHistoryComponent,
    BuildOrderComponent,
    OurFlyersComponent,
    NotificationComponent,
    BoDetailsComponent,
    // PdfViewerComponent,
    LongPressDirective,
    NumberMaskDirective,
    HideHeaderDirective,
    VideoCallComponent,
    OvVideoComponent
  ],
  providers: [
    BarcodeScanner,
    InAppBrowser
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
