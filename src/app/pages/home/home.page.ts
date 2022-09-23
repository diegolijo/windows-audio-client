import { Component, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Helper } from 'src/app/services/helper';
import { SocketManager } from '../../services/socket-manager';
import { StorageManager } from '../../services/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  input: number;
  width: number;
  height: number;

  constructor(
    private renderer: Renderer2,
    public socket: SocketManager,
    private storage: StorageManager,
    private ngZone: NgZone,
    public helper: Helper

  ) { }

  async ngOnInit() {
    try {
      this.width = window.innerWidth;
      this.height = window.innerHeight * 0.78;
      this.subscribeToSocket();
      this.socket.init();
    } catch (err) {
      console.log(JSON.stringify(err));
    }

  }

  //******************************** VIEW ********************************/
  public onChangeRangeValue(value: number) {
    console.log('value-> ' + value);
    this.socket.sendMessage(value);
    this.input = value;
  }

  public onClickReconect() {
    this.reconnect();
  }

  public onClickMute() {
    this.socket.sendMessage(0);
    this.setRangeValue(0);
  }

  //***************************** FUNCTIONS *****************************/

  private setRangeValue(value: number) {
    this.input = value;
  }

  private reconnect() {
    try {
      this.socket.destroy();
      this.socket.init();
    } catch (err) {
      if (err.message === 'tiemout loader') {
        this.helper.showMessage('no se ha podido conectar con el host');
      }
    }
  }

  //***************************** SUBSCRIBE *****************************/
  private subscribeToSocket() {
    this.socket.getSocketObservable().subscribe(value => {
      this.ngZone.run(() => {
        this.handlerSocketResponse(value);
      });
    });
  }

  private handlerSocketResponse(value: any) {
    // console.log(JSON.stringify(value, null, 4));
    switch (value.key) {
      case 'connected':
        this.helper.closeLoader();
        this.setRangeValue(value.data.initialValue);
        console.log('connected');
        break;
      case 'response':
        this.setRangeValue(value.data.changeValue);
        break;
      case 'connect_error':
        this.helper.showMessage('no se ha podido conectar con el host');
        this.helper.closeLoader();
        this.socket.destroy();
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
}
