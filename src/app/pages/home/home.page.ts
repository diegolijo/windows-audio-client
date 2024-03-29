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

  searchValue: string;

  urlNetflix = 'https://www.netflix.com/search?q=';
  keybShow: boolean;
  dateShow = 0;

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
      this.height = window.innerHeight * 0.55;
      this.subscribeToSocket();
      this.subscribeTokeyboard();
      this.subscribeToPauseResume();
      this.helper.isWifiConected = await this.platform.is('cordova') ? await this.wifiWizard2.getConnectedSSID() : true;
      await this.helper.showLoader('conectando ♪ ♫ ♪ ...');
      this.socket.init();
      return;
      this.socket.initArduinoSocket(
        (event) => this.onMessage(event),
        (event) => this.onOpen(event),
        (event) => this.onClose(event));
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
      el.lastValue = value;
      return;
      this.http.get(`http://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}/motor/${(value * factor)}`);
    }
  }

  public onClickViewMode() {
    this.viewMode = !this.viewMode ? 'keyboard' : '';
    this.refreshValueFather();
  }


  public async onClickReconect() {
    try {
      if (this.platform.is('cordova')) {
        await this.wifiWizard2.getConnectedSSID();
      }
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
    return;
    this.http.get(`http://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}/motor/2`);
  }

  public onClickSpace() {
    this.socket.sendKeyCode(32);
  }

  public onClickRight() {
    this.socket.sendKeyCode(39);
    return;
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
      if (this.platform.is('cordova')) {
        await this.wifiWizard2.getConnectedSSID();
      }
      this.reconnect();
    } catch (err) {
      this.helper.showMessage('Conectate a la wifi!!!');
    }
  }

  public async onClickUndo() {
    try {
      if (this.platform.is('cordova')) {
        this.socket.sendCommand('control-shift', '84'); // T
      } else {
        this.keybShow = !this.keybShow;
        this.refreshValueFather();
      }
    } catch (err) {
      this.helper.showMessage(err);
    }
  }

  public async onClickURL() {
    try {
      if (this.searchValue) {
        this.socket.sendCommand('control', '115'); // F4
        setTimeout(() => {
          const url = this.urlNetflix + this.searchValue.replaceAll(' ', '%20');
          this.socket.sendKeyURL(url);
        }, 500);
      }
    } catch (err) {
      this.helper.showMessage(err);
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

  private refreshValueFather() {
    const value = this.input;
    delete this.input;
    setTimeout(() => {
      this.input = value;
    }, 1);
  }

  private reconnect() {
    try {
      this.helper.showLoader('conectando ♪ ♫ ♪ ...');
      this.socket.destroy();
      this.socket.init();
      // arduino socket
      this.socket.clearArduinoSocket();
      return;
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

  private subscribeTokeyboard() {
    window.addEventListener('ionKeyboardDidShow', ev => {
      console.log('ionKeyboardDidShow date: ' + new Date().getTime());
      this.dateShow = new Date().getTime();
      this.keybShow = true;

      console.log('ionKeyboardDidShow keybShow: ' + this.keybShow);
    });
    window.addEventListener('ionKeyboardDidHide', () => {
      if (new Date().getTime() - this.dateShow > 500) {
        console.log('ionKeyboardDidHide date: ' + this.dateShow);
        this.keybShow = false;
        this.refreshValueFather();
        console.log('ionKeyboardDidHide keybShow: ' + this.keybShow);
      }
    });
  }







}

// export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
// export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"
// export GRADLE_HOME="/opt/gradle/gradle-7.4.2"
// export PATH=$PATH:$HOME"/Android/Sdk/platform-tools"
