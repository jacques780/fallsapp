import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import {
  OpenVidu,
  Publisher,
  Session,
  StreamEvent,
  StreamManager,
  Subscriber,
} from 'openvidu-browser';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError } from 'rxjs';
import { AuthService, CaptureService, SharedService } from 'src/app/services';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss'],
})
export class VideoCallComponent implements OnInit {
  //Open Vivu
  // OpenVidu objects
  OV: OpenVidu;
  session: Session;
  publisher: StreamManager; // Local
  subscribers: StreamManager[] = []; // Remotes

  // Join form
  mySessionId: string;
  myUserName: string;

  // Main video of the page, will be 'publisher' or one of the 'subscribers',
  // updated by click event in UserVideoComponent children
  mainStreamManager: StreamManager;

  isMuteAll = true;
  mute = true;
  constructor(
    private httpClient: HttpClient,
    public sharedService: SharedService,
    private authenService: AuthService,
    private androidPermissions: AndroidPermissions,
    private captureService: CaptureService
  ) {}

  ngOnInit() {
    this.mySessionId = this.authenService.emailValue
      .replace('@', '_')
      .replace(/\./g, '__');
    this.mySessionId = this.mySessionId.toLowerCase().trim();
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        (result) => {
          console.log('Has permission?', result.hasPermission);
          if (!result.hasPermission)
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.CAMERA
            );
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.CAMERA
          )
      );
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
      .then(
        (result) => {
          if (!result.hasPermission)
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.RECORD_AUDIO
            );
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.RECORD_AUDIO
          )
      );

    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS)
      .then(
        (result) => {
          if (!result.hasPermission)
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS
            );
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS
          )
      );
  }

  ionViewWillLeave() {
    if (this.session) {
      this.session.disconnect();
      this.session = null;
    }
  }

  OPENVIDU_SERVER_URL = 'https://videoserver1.hydesdirect.com';
  OPENVIDU_SERVER_SECRET = 'FALLS123';

  call() {
    this.captureService.checkVideoCallAvailability().subscribe((response) => {
      console.log(response);
      if (response) {
        if (response.videocalls_status == 1) {
          this.sharedService.presentToast(
            'Video calls should be over WIFI to save on data'
          );
          setTimeout(() => {
            this.initOpenVidu();
          }, 3000);
        } else {
          this.sharedService.presentToast(response.videocalls_disabled_message);
        }
      }
    });
  }

  hangup() {
    this.session.disconnect();
    this.session = null;
  }

  initOpenVidu() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.session = this.OV.initSession();

    // --- 3) Specify the actions when events take place in the session ---

    // On every new Stream received...
    this.session.on('streamCreated', (event: StreamEvent) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      let subscriber: Subscriber = this.session.subscribe(
        event.stream,
        undefined
      );

      this.subscribers.push(subscriber);
    });

    // On every Stream destroyed...
    this.session.on('streamDestroyed', (event: StreamEvent) => {
      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream.streamManager);
    });

    // --- 4) Connect to the session with a valid user token ---

    // 'getToken' method is simulating what your server-side should do.
    // 'token' parameter should be retrieved and returned by your own backend
    this.getToken().then((token) => {
      // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      this.OV.getDevices().then((res) => {
        console.log(res);
      });
      this.session
        .connect(token, { clientData: this.myUserName })
        .then(() => {
          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let publisher: Publisher = this.OV.initPublisher(undefined, {
            audioSource: 'default', // The source of audio. If undefined default microphone
            videoSource: true, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            // resolution: '640x480',  // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---

          this.session.publish(publisher);

          // Set the main video in the page to display our webcam and store our Publisher
          this.mainStreamManager = publisher;
          this.publisher = publisher;
        })
        .catch((error) => {
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message
          );
        });
    });
  }

  muteAll() {
    if (this.isMuteAll) {
      for (let i in this.subscribers) {
        this.subscribers[i]['subscribeToAudio'](false);
      }
      this.isMuteAll = false;
    } else {
      this.unMuteAll();
    }
  }
  unMuteAll() {
    for (let i in this.subscribers) {
      this.subscribers[i]['subscribeToAudio'](true);
    }
    this.isMuteAll = true;
  }

  muteMic() {
    if (this.mute) {
      this.publisher['publishAudio'](false);
      this.mute = false;
    } else {
      this.unmuteMic();
    }
  }

  unmuteMic() {
    this.publisher['publishAudio'](true);
    this.mute = true;
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * This method retrieve the mandatory user token from OpenVidu Server,
   * in this case making use Angular http API.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION. In this case:
   *   1) Initialize a session in OpenVidu Server	 (POST /api/sessions)
   *   2) Generate a token in OpenVidu Server		   (POST /api/tokens)
   *   3) The token must be consumed in Session.connect() method of OpenVidu Browser
   */

  getToken(): Promise<string> {
    return this.createSession(this.mySessionId).then((sessionId) => {
      return this.createToken(sessionId);
    });
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ customSessionId: sessionId });
      const options = {
        headers: new HttpHeaders({
          Authorization:
            'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }),
      };
      return this.httpClient
        .post(this.OPENVIDU_SERVER_URL + '/api/sessions', body, options)
        .pipe(
          catchError((error) => {
            // alert(this.mySessionId + '-----'+JSON.stringify(error));
            if (error.status === 409) {
              resolve(sessionId);
            } else {
              console.warn(
                'No connection to OpenVidu Server. This may be a certificate error at ' +
                  this.OPENVIDU_SERVER_URL
              );
              if (
                window.confirm(
                  'No connection to OpenVidu Server. This may be a certificate error at "' +
                    this.OPENVIDU_SERVER_URL +
                    '"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server' +
                    'is up and running at "' +
                    this.OPENVIDU_SERVER_URL +
                    '"'
                )
              ) {
                location.assign(
                  this.OPENVIDU_SERVER_URL + '/accept-certificate'
                );
              }
            }
            return observableThrowError(error);
          })
        )
        .subscribe((response) => {
          console.log(response);
          resolve(response['id']);
        });
    });
  }

  createToken(sessionId): Promise<string> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ session: sessionId });
      const options = {
        headers: new HttpHeaders({
          Authorization:
            'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json',
        }),
      };
      return this.httpClient
        .post(this.OPENVIDU_SERVER_URL + '/api/tokens', body, options)
        .pipe(
          catchError((error) => {
            reject(error);
            return observableThrowError(error);
          })
        )
        .subscribe((response) => {
          console.log(response);
          resolve(response['token']);
        });
    });
  }

  private deleteSubscriber(streamManager: StreamManager): void {
    let index = this.subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }
}
