import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { CommonModule } from '@angular/common'; 

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { ChatComponent } from './shared/components/chat/chat.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [AppComponent, ChatComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    CommonModule,
    BrowserAnimationsModule
  ],
  providers: [
    FirebaseX,
    Network,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AndroidPermissions,
    VideoEditor,
    MediaCapture,
    FCM,
    Keyboard,
    NativeAudio,
    Camera,
    HTTP
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
