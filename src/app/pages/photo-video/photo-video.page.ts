import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PvSlideComponent } from './pv-slide';
import { CaptureService, SharedService } from '../../services';
// import { VideoCapturePlus, VideoCapturePlusOptions } from '@ionic-native/video-capture-plus/ngx';
import { ITile, IPresentAlert, IButtonType, IVideo } from '../../interface';
import { Network } from '@ionic-native/network/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AuthService } from '../../services';
import { File } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { VideoEditor, VideoInfo } from '@ionic-native/video-editor/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-photo-video',
  templateUrl: './photo-video.page.html',
  styleUrls: ['./photo-video.page.scss'],
})
export class PhotoVideoPage implements OnInit {

  selection: string = "";
  private isWifiConnection: boolean = false;
  isSendImagesVideos: boolean = false;
  headerText: string = "";
  fileTransfer: FileTransferObject = this.transfer.create();
  private win: any = window;
  constructor(
    private camera: Camera,
    private captService: CaptureService,
    // private videoCapturePlus: VideoCapturePlus,
    public sanitizer: DomSanitizer,
    private network: Network,
    public sharedService: SharedService,
    private transfer: FileTransfer,
    private file: File,
    private androidPermissions: AndroidPermissions,
    private mediaCapture: MediaCapture,
    private videoEditor: VideoEditor,
    private authService: AuthService) { }
  tiles: ITile[] = [];
  videos: IVideo[] = [];

  async ngOnInit() {
    this.selection = "photos";
    this.headerText = "Photo Capture";
    await this.initPhotosAndVideosView(true, false);
    this.isWifiConnection = await this.checkConnection();

    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
    //   result => {console.log('Has permission?',result.hasPermission)
    //   if (!result.hasPermission) this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    // },
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    // );
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
    //   result => {if (!result.hasPermission) this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)},
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    // );
    
  }

  async initPhotosAndVideosView(isInitPhotos: boolean, isInitVideos: boolean): Promise<void> {
    // const prsLoading: HTMLIonLoadingElement = await this.sharedService.presentLoading();
    // await prsLoading.present();
    if (isInitPhotos) {
      await this.initPhotos();
    }
    if (isInitVideos) {
      await this.initVideos();
    }
    // prsLoading.dismiss();
  }

  async initPhotos(): Promise<void> {
    // await new Promise<void>(resolve => setTimeout(resolve, 300)); // fake event get data from backend
  }

  async initVideos(): Promise<void> {
    // await new Promise<void>(resolve => setTimeout(resolve, 300)); // fake event get data from backend
  }
  ionViewDidEnter() {
    let videoPath = localStorage.getItem("videoPath");
    let videoFileName = localStorage.getItem("videoFileName");
    if (videoPath) {
      this.videoPath = videoPath;
      this.videoFileName = videoFileName;
      this.file.readAsDataURL(this.videoPath, this.videoFileName).then(data=>{
        //  console.log(data);
         this.videoData = data;
         this.isSendImagesVideos = false;

         this.videos = [];
         this.videos.push({
           name: this.videoFileName,
           fullPath: data
         })
       })
    }
  }

  

  segmentChanged(event): void {
    if (event.detail.value == "photos") {
      this.headerText = "Photo Capture";
      this.initPhotosAndVideosView(true, false);

    } else if (event.detail.value == "videos") {
      this.headerText = "Video Capture";
      this.initPhotosAndVideosView(false, true);
    }
  }

  async onCallCamera(): Promise<void> {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 1920,
      targetHeight: 1080,
      // destinationType: this.camera.DestinationType.FILE_URI,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE
    }

    let imageData = await this.camera.getPicture(options).catch(err => this.sharedService.presentToast('Something went wrong'));
    //let base64Image = imageData ? 'data:image/jpeg;base64,' + imageData : null;
    // let base64Image = this.sanitizer.bypassSecurityTrustResourceUrl(imageData);
    console.log(imageData);
    imageData ? this.tiles.push({
      id: new Date().toISOString(),
      name: 'My image ' + (this.tiles.length + 1),
      src: encodeURIComponent(imageData)
    }) : null;
    this.onCallPresentAlertConfirm("Confirm", "Taking photo again?");

  }

  videoData;
  videoPath: string;
  videoFileName: string;
  onCallVideo(): void {
    // const options: VideoCapturePlusOptions = {
    //   limit: 1,
    //   duration: 120,
    //   highquality: true,
    //   // portraitOverlay: 'assets/img/camera/overlay/portrait.png',
    //   // landscapeOverlay: 'assets/img/camera/overlay/landscape.png'
    // }

    

    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 120,
      quality: 0,
    }
    
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      if (this.videoPath&&this.videoPath.length>0) {
        this.file.removeFile(this.videoPath, this.videoFileName).then(res=>{
          console.log(res);
        })
      }
      console.log('Video',res)
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');      
      var toDirectory = this.file.dataDirectory;
      this.isSendImagesVideos = true;
      this.videoPath = fromDirectory;
      this.videoFileName = fileName;
      localStorage.setItem("videoPath",this.videoPath);
      localStorage.setItem("videoFileName", this.videoFileName);
      this.videos = [];
        this.file.readAsDataURL(fromDirectory, fileName).then(data=>{
          //  console.log(data);
          this.videoData = data;
          this.isSendImagesVideos = false;

          
          this.videos.push({
            name: fileName,
            fullPath: data
          })
        })
      
          },
    (err: CaptureError) => console.error(err));
    
  }

  async presentModal(imageId: number): Promise<void> {
    this.sharedService.presentImageModal(imageId, PvSlideComponent, this.tiles);
  }

  async onCallPresentAlertConfirm(hder: string, msg: string): Promise<void> {
    let customAlert: IPresentAlert = {
      header: hder,
      message: msg,
      buttons: <IButtonType[]>[
        { text: 'Yes', role: 'yes' },
        { text: 'No', role: 'no' }
      ]
    }
    let alert = await this.sharedService.presentAlertConfirm(customAlert);
    alert.onDidDismiss().then((res) => {
      if (res.role == "yes") {
        this.onCallCamera();
        return;
      }
      else if (res.role == "no") {
        //Nothing to do
      }
      else {
        //if WTH 
        console.log(":)))");
      }
    });
  }

  async checkConnection(): Promise<boolean> {
    let checkPlatform: string = await this.sharedService.getPlatformReady();
    if (checkPlatform == "cordova") {
      if (this.network.type == "wifi") {
        return true;
      }
    }
    return false;
  }

  async uploadImagesPhotos(): Promise<void> {
    if (this.tiles.length < 1 && this.videos.length < 1) {
      this.sharedService.presentToast("Uh oh! No data to send :)");
      return;
    }
    this.isWifiConnection ? this.sendImagesVideos() : this.onConfirmUploading();
  }

  async onConfirmUploading(): Promise<void> {
    let customAlert: IPresentAlert = {
      header: "Confirmation",
      message: "Are you sure you wish to upload lots of data over the cell network?",
      buttons: <IButtonType[]>[
        { text: 'Yes', role: 'yes' },
        { text: 'No', role: 'no' }
      ]
    }
    let alert = await this.sharedService.presentAlertConfirm(customAlert);
    alert.onDidDismiss().then((res) => {
      if (res.role == "yes") {
        this.sendImagesVideos();
      }
      else if (res.role == "no") {
        //Nothing to do
      }
      else {
        //if WTH 
        console.log(":)))");
      }
    });
  }

  getVideoCustomStyle(poster: string): Object {
    return { 'background': 'transparent url(' + poster + ') 50% 50% / cover no-repeat' };
  }

  async sendImagesVideos(): Promise<void> {
    this.isSendImagesVideos = true;
    try {
      if (this.selection == 'photos') {
        let res: any = await this.captService.uploadPhotoVideo(this.tiles, '', null).toPromise();
        this.sharedService.presentToast("Thank you, a sales person will contact you soon...");
        this.tiles = [];
        this.isSendImagesVideos = false;
      }
      else if (this.selection == 'videos') {
        this.sharedService.presentToast("Remember to switch to WIFI if possible to save on data fees!");
        setTimeout(()=>{
          this.file.readAsArrayBuffer(this.videoPath, this.videoFileName).then(async (fileRes:ArrayBuffer)=>{
            let medBlob = new Blob([fileRes], {
              type: `video/mp4`
            });
          
            let res: any = await this.captService.uploadPhotoVideo([], this.videoFileName, medBlob).toPromise();
            this.file.removeFile(this.videoPath, this.videoFileName).then(res=>{
              console.log(res);
            })
            localStorage.removeItem("videoPath");
            this.videoPath = "";
            localStorage.removeItem("videoFileName");
            this.videoFileName = "";
            this.isSendImagesVideos = false;
            this.videos = [];
            this.sharedService.presentToast("Thank you, a sales person will contact you soon...");
          // this.tiles = [];
          });
        })
        
      }
      else {
        this.sharedService.presentToast('Unknow error!');
      }

    }
    catch (err) {
      this.sharedService.presentToast('Connection Error!');
      console.log(JSON.stringify(err));
      this.isSendImagesVideos = false;
    }
  }

  uploadVideos(filePath: string): void {

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: new Date().toISOString() + '.jpg',
      headers: {}
    }

    this.fileTransfer.upload(filePath, this.captService.api, options)
      .then((data) => {
        // success
        console.log('success');
        console.log(data);

      }, (err) => {
        // error
        console.log(err);
      })
  }

  async onClickRemoveImage(event, imageId: string): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    let customAlert: IPresentAlert = {
      header: "Confirm Deletion",
      message: "Delete this image?",
      buttons: <IButtonType[]>[
        { text: 'Yes', role: 'yes' },
        { text: 'No', role: 'no' }
      ]
    }
    let alert = await this.sharedService.presentAlertConfirm(customAlert);
    alert.onDidDismiss().then((res) => {
      if (res.role == "yes") {
        this.tiles.forEach((item, index) => {
          if (item.id === imageId) {
            this.tiles.splice(index, 1);
          }
        });
      }
      else if (res.role == "no") {
        //Nothing to do
      }
      else {
        //if WTH 
        console.log(":)))");
      }
    });
  }
}
