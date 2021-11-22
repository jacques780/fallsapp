import { HideHeaderDirective } from './../../directives/hide-header.directive';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoVideoPageRoutingModule } from './photo-video-routing.module';

import { PhotoVideoPage, PvSlideComponent } from '.';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { HideButtonDirective } from '../../directives';
import { Camera } from '@ionic-native/camera/ngx';
// import { VideoCapturePlus } from '@ionic-native/video-capture-plus/ngx';
import { Network } from '@ionic-native/network/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicStorageModule } from '@ionic/storage';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoVideoPageRoutingModule,
    FontAwesomeModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [
    PhotoVideoPage,
    PvSlideComponent,
    HideHeaderDirective,
    HideButtonDirective
  ],
  providers: [
    Camera,
    // VideoCapturePlus,
    Network,
    File,
    FilePath,
    FileTransfer
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PhotoVideoPageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
