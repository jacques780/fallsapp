import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  HomePage, ContactComponent, OrderHistoryComponent, BuildOrderComponent,
  OurFlyersComponent, NotificationComponent,
  BoDetailsComponent
} from '.';
import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'buildOrder',
    component: BuildOrderComponent,
  },
  {
    path: 'buildOrder/:id',
    component: BoDetailsComponent,
  },
  {
    path: 'orderHistory',
    component: OrderHistoryComponent,
  },
  {
    path: 'flyer',
    component: OurFlyersComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'notification',
    component: NotificationComponent,
  },
  {
    path: 'video-call',
    component: VideoCallComponent,
  },
  {
    path: 'videoroom',
    loadChildren: () => import('../video-room/video-room.module').then( m => m.VideoRoomPageModule)
  },
  {
    path: 'gallery',
    loadChildren: () => import('../photo-video/photo-video.module').then(m => m.PhotoVideoPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
