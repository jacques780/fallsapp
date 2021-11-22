import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[hideButton]'
})
export class HideButtonDirective {
  @Input("hideButton") button: any;
  private wrapperHeight: number = 56;

  constructor(public renderer: Renderer2,
    private domCtrl: DomController) { }

  ngOnInit() {
    this.initHideHeader();
  }
  initHideHeader(): void {
    this.button = this.button.el;
    // :) sometime dom can't read the header height correctly!
    this.domCtrl.read(() => {
      this.wrapperHeight = (this.button.clientHeight > 0 ? this.button.clientHeight : this.wrapperHeight);
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    const scrollTop = $event.detail.scrollTop;
    let newPosition = -scrollTop;

    let newOpacity = 1 + newPosition / this.wrapperHeight;

    if (newPosition < -this.wrapperHeight) {
      newPosition = -this.wrapperHeight;
    }

    this.domCtrl.write(() => {
      this.renderer.setStyle(this.button, 'opacity', newOpacity);
    });
  }
}
