import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITile, IVideo } from '../interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, timeout } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class CaptureService {
  api: string = '';
  checkVideoAvailApi: string = '';
  constructor(private http: HttpClient, private authService: AuthService) {
    this.api = environment.apiUrl + 'addmetadata=1';
    this.checkVideoAvailApi = environment.apiUrl + 'checkforvideocalls=1';
  }

  uploadPhotoVideo(
    photoListData: ITile[] = [],
    fileName: string,
    filemedBlob: any
  ): Observable<any> {
    if (photoListData.length > 0) {
      const data = new HttpParams()
        .set('email_address', this.authService.emailValue)
        .set('photos', JSON.stringify(photoListData));
      return this.http.post<any>(this.api, data).pipe(
        timeout(5000),
        map((data) => data)
      );
    }
    if (fileName.length > 0) {
      // const data = new HttpParams()
      // .set('email_address', this.authService.emailValue)
      // .set('video', videoListData);
      let headers = new HttpHeaders();
      headers.append('content-type', 'multipart/form-data');
      // const data = {};
      // data['email_address'] = this.authService.emailValue;
      // data['video']= videoListData;
      const data = new FormData();

      data.append('email_address', this.authService.emailValue);
      data.append('video', fileName);
      data.append('file', filemedBlob);
      return this.http.post<any>(`${environment.apiUrl}addmetadata=1`, data, {
        headers: headers,
      });
    }
  }

  checkVideoCallAvailability() {
    return this.http.get<any>(this.checkVideoAvailApi, {}).pipe(
      timeout(5000),
      map((data) => data)
    );
  }
}
