import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoVideoPage } from './photo-video.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoVideoPageRoutingModule {}
