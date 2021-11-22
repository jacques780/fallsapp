import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SharedService } from '../../../services'
const ZOOM_STEP: number = 0.05;
const DEFAULT_ZOOM: number = 1;
@Component({
  selector: 'app-our-flyers',
  templateUrl: './our-flyers.component.html',
  styleUrls: ['./our-flyers.component.scss'],
})
export class OurFlyersComponent implements OnInit {
  
  loading: boolean = false;
  viewPdf: string = '';
  progressValue: number = 0;
  pdfSrc: string = "";
  selection: string = "";
  public pdfZoom: number = DEFAULT_ZOOM;

  constructor(
    private inAppBrowser: InAppBrowser,
    public sharedService: SharedService
  ) { }

  isError = false;
  ngOnInit(): void {
    this.initFlyersView();
  }

  ionViewWillEnter(){
    this.initFlyersView();
  }

  async initFlyersView(): Promise<void> {
    this.selection = "weekly";
    this.pdfSrc = "https://admin.hydesdirect.com/includes/post.php?operation=dlfallsflyer_weekly";
  }
  onProgress(event): void {
    this.progressValue = event.loaded / event.total;
    this.loading = (this.progressValue < 1) ? true : false;
  }
  onError(event): void {
    this.isError = true;
    this.progressValue = 0;
    // this.presentToast(JSON.stringify(event));
    // console.log(event);
    // this.sharedService.presentToast("Failed to view in app. Open in app browser");
    // this.inAppBrowser.create(this.pdfSrc);
  }

  async segmentChanged(event): Promise<void> {
    this.isError = false;
    if (event.detail.value == "monthly") {
      this.pdfSrc = "https://admin.hydesdirect.com/includes/post.php?operation=dlfallsflyer_monthly";
    } else if (event.detail.value == "weekly") {
      this.pdfSrc = "https://admin.hydesdirect.com/includes/post.php?operation=dlfallsflyer_weekly";
    }
  }

  public zoomIn() {
    if (this.pdfZoom <= 0.55) {
      this.pdfZoom = 0.56;
    }
    this.pdfZoom += ZOOM_STEP;
  }

  public zoomOut() {
    if (this.pdfZoom > 0.55) {
      this.pdfZoom -= ZOOM_STEP;
    }
  }

  public resetZoom() {
    this.pdfZoom = DEFAULT_ZOOM;
  }
}
