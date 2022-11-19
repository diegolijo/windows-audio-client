/* eslint-disable @typescript-eslint/naming-convention */
import { Component, NgZone, OnInit } from '@angular/core';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2/ngx';
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
  resumeSubscription: any;
  pauseSubscription: any;

  constructor(
    public socket: SocketManager,
    private ngZone: NgZone,
    public helper: Helper,
    private platform: Platform,
    private http: Http,
    private wifiWizard2: WifiWizard2
  ) { }

  async ngOnInit() {
    try {
      await this.platform.ready();
      this.width = window.innerWidth;
      this.height = window.innerHeight * 0.60;
      this.subscribeToSocket();
      this.subscribeToPauseResume();
      this.helper.isWifiConected = await this.wifiWizard2.getConnectedSSID();
      await this.helper.showLoader('conectando ♪ ♫ ♪ ...');
      this.socket.init();
      this.socket.initArduinoSocket((event) => this.onMessage(event), (event) => this.onOpen(event), (event) => this.onClose(event));
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  }

  async ionViewDidEnter() {

  }

  //******************************** VIEW ********************************/
  public onChangeRangeValue(value: number, el: any) {
    if (el && el.lastValue !== value) {
      const factor = 3;
      console.log('value-> ' + value + '/ ' + (value * factor));
      this.socket.sendMessage(value);
      this.input = value;
      this.http.get(`http://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}/motor/${(value * factor)}`);
      el.lastValue = value;
    }
  }

  public onClickViewMode() {
    const value = this.input;
    delete this.input;
    this.viewMode = !this.viewMode ? 'keyboard' : '';
    setTimeout(() => {
      this.input = value;
    }, 1);;
  }

  public async onClickReconect() {
    try {
      await this.wifiWizard2.getConnectedSSID();
      this.reconnect();
    } catch (err) {
      this.helper.showMessage('Conectate a la wifi!!!');
    }
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
    this.http.get(`http://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}/motor/2`);
  }

  public onClickSpace() {
    this.socket.sendKeyCode(32);
  }

  public onClickRight() {
    this.socket.sendKeyCode(39);
    this.http.get(`http://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}/motor/1`);
  }

  // pantalla completa netflix
  public onClickF() {
    this.socket.sendKeyCode(70);
  }

  public onClickPad(pad, event, el) {
    console.log('press: ' + event);
    if (event === 'DOWN') {
      let value = pad;
      if (pad === '►') {
        value = '1';
      }
      if (pad === '◄') {
        value = '2';
      }
      el.style.background = '#115675';
      this.http.get(`http://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}/motor/${value}`);
    }
    if (event === 'UP') {
      el.style.background = '#218dbe';
      if (pad === '►' || pad === '◄') {
        this.http.get(`http://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}/motor/0`);
      }
    }
  }

  public async onClickWifi() {
    try {
      await this.wifiWizard2.getConnectedSSID();
      this.reconnect();
    } catch (err) {
      this.helper.showMessage('Conectate a la wifi!!!');
    }
  }

  //***************************** FUNCTIONS *****************************/

  // ------------------ socket arduino ------------------------
  private onMessage(event) {
    const value = JSON.parse(event.data);

    this.socket.sendMessage(value.encoder);
  }

  private onOpen(event) {
    console.log(event);
  }

  private onClose(event) {
    console.log(event);
  }
  private onError(event: any) {
    console.log('Error: ' + event);
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
      // arduino socket
      this.socket.clearArduinoSocket();
      this.socket.initArduinoSocket(
        (event) => this.onMessage(event),
        (event) => this.onOpen(event),
        (event) => this.onClose(event),
        (event) => this.onError(event));
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
        setTimeout(() => { this.helper.closeLoader(); }, 1000);
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


  private async subscribeToPauseResume() {
    if (!this.resumeSubscription || this.resumeSubscription.closed) {
      this.resumeSubscription = await this.platform.resume.subscribe(() => this.ngZone.run(async () => {
        if (!this.socket.isConnected) {

        }
      }));
    }

    if (!this.pauseSubscription || this.pauseSubscription.closed) {
      this.pauseSubscription = await this.platform.pause.subscribe(() => this.ngZone.run(() => {

      }));
    }
  }


}

// export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
// export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"
// export GRADLE_HOME="/opt/gradle/gradle-7.4.2"
// export PATH=$PATH:$HOME"/Android/Sdk/platform-tools"
