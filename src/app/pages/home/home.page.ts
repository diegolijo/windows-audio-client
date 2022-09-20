import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Http as HttpManager } from '../../services/http';
import { SocketManager } from '../../services/socket-manager';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('range') range: any;

  listenFunc: () => void;

  constructor(
    private renderer: Renderer2,
    private socket: SocketManager,
    private http: HttpManager,

  ) { }

  ngOnInit() {
    this.subscribeToSocket();
  }

  ionViewDidEnter() {
    this.listenFunc = this.renderer.listen(this.range.nativeElement, 'input', () => this.onChangeRangeValue());
    this.socket.init();
  }

  ngOnDestroy() {
    this.listenFunc(); // Removes listener
  }

  //******************************** VIEW ********************************/
  private onChangeRangeValue() {
    console.log('value-> ' + this.range.nativeElement.valueAsNumber);
    this.socket.sendMessage(this.range.nativeElement.valueAsNumber);
  }

  //***************************** FUNCTIONS *****************************/
  private setRangeValue(value: number) {
    this.range.nativeElement.valueAsNumber = value ? value : 0;
  }


  private handlerSocketEvent(value: any) {
    console.log(JSON.stringify(value, null, 4));
    switch (value.key) {
      case 'connected':
        this.setRangeValue(value.data.initialValue);
        break;
      case '':

        break;
      case '':

        break;
      case '':

        break;
      case '':

        break;
      case '':

        break;
      default:
        break;
    }
  }


  //***************************** SUBSCRIBE *****************************/
  private subscribeToSocket() {
    this.socket.getSocketObservable().subscribe(value => {
      this.handlerSocketEvent(value);
    });
  }

}
