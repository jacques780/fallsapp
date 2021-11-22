import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
@Directive({
  selector: '[hideHeader]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderDirective implements OnInit {
  @Input("hideHeader") header: any;
  private headerHeight: number = 56; // :) Please set a fixed height here if dom can't read
  constructor(public renderer: Renderer2, private domCtrl: DomController) { }
  ngOnInit() {
    this.initHideHeader();
  }
  initHideHeader(): void {
    this.header = this.header.el;
    // :) sometime dom can't read the header height correctly!
    this.domCtrl.read(() => {
      this.headerHeight = (this.header.clientHeight > 0 ? this.header.clientHeight : this.headerHeight);
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    const scrollTop = $event.detail.scrollTop;
    let newPosition = -scrollTop / 2;
    let newOpacity = 1 + newPosition / this.headerHeight;

    if (newPosition < -this.headerHeight) {
      newPosition = -this.headerHeight;
    }

    this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'top', `${newPosition}px`);
      this.renderer.setStyle(this.header, 'opacity', newOpacity);
    });
  }
}
