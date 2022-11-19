import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Directive({
    selector: '[appPress]'
})
export class LongPressDirective implements AfterViewInit {

    @Output() appPress = new EventEmitter();
    @Input() delay = 600;
    action: any;

    private longPressActive = false;

    constructor(
        private elementRef: ElementRef,
        private gestureCtrl: GestureController,
        private zone: NgZone,
        private vibration: Vibration
    ) { }

    ngAfterViewInit() {
        this.loadLongPressOnElement();
    }

    loadLongPressOnElement() {
        const gesture = this.gestureCtrl.create({
            el: this.elementRef.nativeElement,
            threshold: 0,
            gestureName: 'long-press',
            onStart: ev => {
                this.longPressActive = true;
                this.longPressAction();
                this.appPress.emit('DOWN');
            },
            onEnd: ev => {
                this.longPressActive = false;
                this.appPress.emit('UP');
            }
        });
        gesture.enable(true);
    }

    private longPressAction() {
        if (this.action) {
            clearInterval(this.action);
        }
        this.action = setTimeout(() => {
            this.zone.run(() => {
                if (this.longPressActive === true) {
                    this.longPressActive = false;
                    this.vibration.vibrate(10);
                    this.appPress.emit('PRESS');
                }
            });
        }, this.delay);
    }
}

