/* eslint-disable @typescript-eslint/naming-convention */
import { Component, NgZone, OnInit } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Constants } from './services/config/constants';
import { Helper } from './services/helper';
import { SocketManager } from './services/socket-manager';
import { StorageManager } from './services/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  resumeSubscription: any;
  pauseSubscription: any;
  menuOpen: any;

  constructor(
    private angularStorage: Storage,
    private storage: StorageManager,
    private platform: Platform,
    public constants: Constants,
    private barcodeScanner: BarcodeScanner,
    private ngZone: NgZone,
    private socket: SocketManager,
    private helper: Helper,
    private appMinimize: AppMinimize,
    private menuCntlr: MenuController
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    this.angularStorage.create();
    this.subscribeToPauseResume();
    this.subscribeToBackBtn();
    const result = await this.storage.getItem(Constants.SAVED_IP);
    this.constants.currentIp = result ? result : [Constants.DEFAULT_IP];
    this.checkSocketConection();
  }


  /**************************************  view EVENTS *******************************************/
  public onChangeIp(event) {
    console.log(event.detail.value);
    this.constants.currentIp[0] = event.detail.value;
    this.storage.setItem(Constants.SAVED_IP, this.constants.currentIp);
  }

  public onClickScan() {
    try {
      this.ngZone.run(async () => {
        const barcodeData = await this.barcodeScanner.scan();
        console.log('Barcode data', barcodeData);
        const ip = JSON.parse(barcodeData.text);
        this.setIpTopPosition(ip);
        this.socket.destroy();
        await this.platform.ready();
        await this.helper.showLoader('conectando ♪ ♫ ♪ ...');
        this.socket.init();
      });
    } catch (err) {
      console.log('Error', err);
    }
  }


  public onClickLine(ip) {
    this.setIpTopPosition(ip);
  }


  //***************************************** FUNCTION ******************************************/
  private setIpTopPosition(ip: any) {
    this.constants.currentIp = this.constants.currentIp.filter((el) => el !== ip);
    this.constants.currentIp.unshift(ip);
    this.storage.setItem(Constants.SAVED_IP, this.constants.currentIp);
  }



  /**************************************  app EVENTS *******************************************/

  private checkSocketConection() {
    setInterval(() => {
      if (!this.socket.isConnected) {
        this.helper.showLoader('conectando ♪ ♫ ♪ ...');
        this.socket.init();
      }
    }, 1000 * 60);
  }

  private async subscribeToPauseResume() {
    if (!this.resumeSubscription || this.resumeSubscription.closed) {
      this.resumeSubscription = await this.platform.resume.subscribe(() => this.ngZone.run(() => {
        if (!this.socket.isConnected) {
          this.helper.showLoader('conectando ♪ ♫ ♪ ...');
          this.socket.init();
        }
      }));
    }
    if (!this.pauseSubscription || this.pauseSubscription.closed) {
      this.pauseSubscription = await this.platform.pause.subscribe(() => this.ngZone.run(() => {
        this.socket.destroy();
      }));
    }
  }

  private subscribeToBackBtn() {
    this.platform.backButton.subscribe(async () => {
      if (await this.menuCntlr.isOpen()) {
        this.menuCntlr.close();
      } else {
        this.appMinimize.minimize();
      }
    });
  }



}
