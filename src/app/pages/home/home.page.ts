/* eslint-disable @typescript-eslint/naming-convention */
import { Component, NgZone, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Constants } from 'src/app/services/config/constants';
import { Helper } from '../../services/helper';
import { Http } from '../../services/http';
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

  viewMode = '';
  sensorValue: any;

  constructor(
    public socket: SocketManager,
    private ngZone: NgZone,
    public helper: Helper,
    private platform: Platform,
    private http: Http
  ) { }

  async ngOnInit() {
    try {
      await this.platform.ready();
      this.width = window.innerWidth;
      this.height = window.innerHeight * 0.68;
      this.subscribeToSocket();
      await this.helper.showLoader('conectando ♪ ♫ ♪ ...');
      this.socket.init();
      this.socket.initArduinoSocket((event) => this.onMessage(event), (event) => this.onOpen(event), (event) => this.onClose(event));
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

  public onClickMcuSensor() {
    this.postSensor();
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

  public onClickPad(pad) {
    this.socket.sendKeyCode(pad);
  }


  //***************************** FUNCTIONS *****************************/

  // ------------------ socket arduino ------------------------
  private onMessage(event) {
    const value = JSON.parse(event.data);

    this.socket.sendMessage(value.encoder);
  }

  private onOpen(event) {
    console.log(event)
  }

  private onClose(event) {
    console.log(event)
  }
  // ----------------------------------------------------------

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

  private async postSensor() {
    this.sensorValue = await this.http.get(`http://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}`);
  }


  //***************************** SUBSCRIBES *****************************/
  private subscribeToSocket() {
    this.socket.getSocketObservable().subscribe(value => {
      this.ngZone.run(() => {
        this.handlerSocketResponse(value);
      });
    });
  }



}

// export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
// export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"
// export GRADLE_HOME="/opt/gradle/gradle-7.4.2"
// export PATH=$PATH:$HOME"/Android/Sdk/platform-tools"