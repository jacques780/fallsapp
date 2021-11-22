import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helper/auth.guard';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'gallery',
    loadChildren: () => import('./pages/photo-video/photo-video.module').then(m => m.PhotoVideoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'videoroom',
    loadChildren: () => import('./pages/video-room/video-room.module').then( m => m.VideoRoomPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
