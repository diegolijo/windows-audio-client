/* eslint-disable max-len */
/* eslint-disable @angular-eslint/no-input-rename */
import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { GestureController, GestureDetail } from '@ionic/angular';

@Component({
  selector: 'app-father',
  templateUrl: './father.component.html',
  styleUrls: ['./father.component.scss'],
})
export class FatherComponent implements OnInit {

  @ViewChild('elFather') elFather: any;
  @Input('height') height;
  @Input('fatherheight') fatherheight;
  @Input('width') width;
  @Output() onchange = new EventEmitter();

  public pxLeft = 0;
  public pxTop = 0;

  constructor(
    private gestureCtrl: GestureController,
    private elementRef: ElementRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.loadLongPressOnElement();
    this.pxTop = this.height - this.fatherheight / 2;
    setTimeout(() => {
      this.pxLeft = (this.width / 2) - (this.elementRef.nativeElement.children[0].children[0].width / 2);
    }, 100);
  }

  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.elementRef.nativeElement,
      threshold: 0,
      gestureName: 'change_father',
      onMove: ev => {
        /*         console.log('onStart ' + JSON.stringify(ev)); */
        this.ngZone.run(() => {
          this.calculateViewPosition(ev);
        });
      }
    });
    gesture.enable(true);
  }

  private calculateViewPosition(ev: GestureDetail) {
    console.log('currentY: ' + ev.currentY + '  - fatherheight: ' + this.fatherheight + '  - height: ' + this.height + ' - pxTop: ' + this.pxTop + '  offserTop: ' + this.elFather.nativeElement.offsetParent.offsetTop);
    this.pxTop = ev.currentY - this.elFather.nativeElement.offsetParent.offsetTop - this.fatherheight / 2;
    this.pxTop = this.pxTop + this.fatherheight / 2 > this.height ? this.height - this.fatherheight / 2 : this.pxTop;
    this.pxTop = this.pxTop + this.fatherheight / 2 < 0 ? 0 - this.fatherheight / 2 : this.pxTop;
    let slideValue = Math.abs(((this.pxTop + this.fatherheight / 2) * 100 / this.height) - 100);
    slideValue = Number.parseInt(slideValue.toString(), 10);
    this.onchange.emit(slideValue);
  }

}
