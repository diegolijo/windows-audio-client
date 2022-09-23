/* eslint-disable max-len */
/* eslint-disable @angular-eslint/no-input-rename */
import { Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GestureController, GestureDetail } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-father',
  templateUrl: './father.component.html',
  styleUrls: ['./father.component.scss'],
})
export class FatherComponent implements OnInit, OnChanges {

  @ViewChild('elFather') elFather: any;

  //style
  @Input('height') height;
  @Input('father-height') fatherheight;
  @Input('width') width;
  @Input('slide-width') slideWidth;
  @Input('color-active') colorActive;
  @Input('color-off') colorOff;
  // fnctns
  @Input('input-value') inputValue;
  @Input('scale') scale;
  @Input('max-decimals') decimals;
  @Output() onchange = new EventEmitter();

  public pxLeft = 0;
  public pxTop = 0;
  public activeHeight = 0;
  public pxTopActive = 0;

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputValue) {
      console.log();
      //knob values
      this.pxTop = this.height - ((this.height * (changes.inputValue.currentValue || 0) / this.scale) + (this.fatherheight / 2));
      //slide values
      this.activeHeight = this.height - this.pxTop - this.fatherheight / 2;
      this.pxTopActive = - this.activeHeight;
     }


  }

  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.elementRef.nativeElement,
      threshold: 0,
      gestureName: 'change_father',
      onMove: ev => {
        this.ngZone.run(() => {
          this.calculateViewPosition(ev);
        });
      }
    });
    gesture.enable(true);
  }

  private calculateViewPosition(ev: GestureDetail) {
    console.log(JSON.stringify(ev));
    //  console.log('currentY: ' + ev.currentY + '  - fatherheight: ' + this.fatherheight + '  - height: ' + this.height + ' - pxTop: ' + this.pxTop + '  offserTop: ' + this.elFather.nativeElement.offsetTop);
    //knob values
    this.pxTop = ev.currentY - this.elFather.nativeElement.offsetTop - this.fatherheight / 2;
    this.pxTop = this.pxTop + this.fatherheight / 2 > this.height ? this.height - this.fatherheight / 2 : this.pxTop;
    this.pxTop = this.pxTop + this.fatherheight / 2 < 0 ? 0 - this.fatherheight / 2 : this.pxTop;
    //slide values
    this.activeHeight = this.height - this.pxTop - this.fatherheight / 2;
    this.pxTopActive = - this.activeHeight;
    //out value [0-100]
    let slideValue = Math.abs(((this.pxTop + this.fatherheight / 2) * this.scale / this.height) - this.scale);
    slideValue = Number.parseFloat(slideValue.toFixed(this.decimals));
    this.onchange.emit(slideValue);
  }

}
