import { Component, NgZone, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Helper } from 'src/app/services/helper';
import { SocketManager } from '../../services/socket-manager';

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
    public socket: SocketManager,
    private ngZone: NgZone,
    public helper: Helper,
    private platform: Platform

  ) { }

  async ngOnInit() {
    try {
      await this.platform.ready();
      this.width = window.innerWidth;
      this.height = window.innerHeight * 0.68;
      this.subscribeToSocket();
      await this.helper.showLoader('conectando ♪ ♫ ♪ ...');
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

  public onClickLeft() {
    this.socket.sendKeyCode(37);
  }

  public onClickSpace() {
    this.socket.sendKeyCode(32);
  }

  public onClickRight() {
    this.socket.sendKeyCode(39);
  }

  // pantalla completa netflix
  public onClickF() {
    this.socket.sendKeyCode(70);
  }

  //***************************** FUNCTIONS *****************************/

  private setRangeValue(value: number) {
    this.input = value;
  }

  private reconnect() {
    try {
      this.helper.showLoader('conectando ♪ ♫ ♪ ...');
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
