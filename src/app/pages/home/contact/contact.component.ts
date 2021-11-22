import { Component, OnInit } from '@angular/core';
//import { CallNumber } from '@ionic-native/call-number/ngx';
import { SharedService } from '../../../services';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  //constructor(public sharedService: SharedService, private callNumber: CallNumber) { }
  constructor(public sharedService: SharedService) { }

  ngOnInit() { }

  funcShowVer()
  {
    alert('App Version: 2.7.0');
  }

  //onPhoneCall() {
  //  this.callNumber.callNumber("18002684524", true)
  //    .then(res => console.log('Launched dialer!', res))
  //    .catch(err => console.log('Error launching dialer', err));
  // }
}
