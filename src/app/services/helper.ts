import { Injectable } from '@angular/core';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';

@Injectable()
export class Helper {

  constructor(
    private device: Device,
    private splashScreen: SplashScreen,

  ) { }

  public getDevice() {
    return { model: this.device.model, uuid: this.device.uuid };
  }

  public hideSplash() {
    this.splashScreen.hide();
  }

  public buildURL() {

  }
}
