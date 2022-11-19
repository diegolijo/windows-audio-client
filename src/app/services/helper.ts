import { Injectable } from '@angular/core';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { IonicSafeString, LoadingController, ToastController } from '@ionic/angular';

export interface IappLoader {
  spinner?: string;
  translucent?: boolean;
  cssClass?: string | string[];
  message?: string | IonicSafeString;
  backdropDismiss?: boolean;
  idFn?: string;
  shown?: boolean;
  present?: any;
  dismiss?: any;
  onDismiss?: any;
}

@Injectable()
export class Helper {

  public isWifiConected: any;
  public appLoader: IappLoader = { shown: false };
  private toastMgs: HTMLIonToastElement;
  private timeOutLoader: any;



  constructor(
    private device: Device,
    private splashScreen: SplashScreen,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) { }

  public getDevice() {
    return { model: this.device.model, uuid: this.device.uuid };
  }

  public hideSplash() {
    this.splashScreen.hide();
  }

  /**
   * @param msg mensaje del loader
   * @param idFn función desde la que se lanza el loader
   * @param shown flag para saber si esta en pantalla el loader
   * @param options :
   *  spinner?: SpinnerTypes | null;
   *  message?: string;
   *  cssClass?: string | string[];
   *  translucent?: boolean;
   *  backdropDismiss?: boolean;
   * }
   */
  public async showLoader(msg?: string, idFn?: string, options?: any): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.appLoader.shown) {
          this.appLoader.shown = true;
          console.log('abrir loader, no hay uno anterior');
          this.appLoader.idFn = idFn || '';
          let opt;
          if (options) {
            options.mensaje = options.mensaje ? options.mensaje : msg || 'cargando';
          } else {
            opt = {
              spinner: 'circles',
              translucent: true,
              cssClass: 'app-loader',
              message: msg || 'cargando',
              backdropDismiss: false
            };
          }
          this.appLoader = await this.loadingCtrl.create(options || opt);
          this.appLoader.idFn = idFn || '';
          await this.appLoader.present();
          this.appLoader.shown = true;
          await this.setLoaderTimeout();
        } else if (this.appLoader.shown) {
          console.log('cambiar mensaje a loader ' + (msg || 'sin-mensaje.') + 'Anterior idFn: ' + this.appLoader.idFn);
          this.appLoader.idFn = idFn || '';
          this.appLoader.message = msg || 'cargando';
          await this.setLoaderTimeout();
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * cierra el loader que hay en pantalla.
   */
  public async closeLoader(idFn?: string, exception?: boolean): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const loader = await this.loadingCtrl.getTop();
        if (loader) {
          loader.dismiss();
        }
        setTimeout(async () => {
          if (exception && this.appLoader.shown) {
            console.log('cerrar loader por excepción');
            await clearTimeout(this.timeOutLoader);
            await this.appLoader.dismiss();
            this.appLoader.shown = false;
          }
          if (!exception && this.appLoader.shown) {
            if (this.appLoader.idFn === idFn) {
              console.log('cerrar loader con = idFn ' + idFn);
              this.appLoader.dismiss();
              if (this.timeOutLoader) {
                await clearTimeout(this.timeOutLoader);
                this.timeOutLoader = null;
              }
              this.appLoader.shown = false;
            } else if (this.appLoader && !this.appLoader.idFn) {
              console.log('cerrar loader sin idFn');
              this.appLoader.dismiss();
              if (this.timeOutLoader) {
                await clearTimeout(this.timeOutLoader);
                this.timeOutLoader = null;
              }
              this.appLoader.shown = false;
            } else if (this.appLoader.idFn !== idFn && this.appLoader.idFn) {
              console.log('intentamos cerrar un loader anterior');
            }
          }
        }, idFn ? 500 : 500);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async showMessage(mes: any, toastColor?: string) {
    mes = typeof mes === 'string' ? mes : this.getErrorMsg(mes, '');
    await this.closeLoader();
    if (this.toastMgs && this.toastMgs.isConnected) {
      await this.toastMgs.dismiss();
    }
    const options: any = {
      message: mes,
      cssClass: 'toastMarginTop',
      position: 'top',
      duration: 1000 * 4,
      color: toastColor
    };
    this.toastMgs = await this.toastController.create(options);
    await this.toastMgs.present();
  }

  /**
   * recorre las propiedades de un objeto e imprime su contenido, si ulguna propiedades es un objeto
   * realiza la operacion recursivamente
   */
  private getErrorMsg(error: any, msg: any) {
    for (const key in error) {
      if (Object.prototype.hasOwnProperty.call(error, key)) {
        if (typeof error[key] === 'object') {
          msg += this.getErrorMsg(error[key], msg);
        } else if (typeof error[key] === 'string') {
          msg += error[key] + '\n';
        }
      }
    }
    return msg ? msg : 'error indefinido';
  }

  private async setLoaderTimeout() {
    if (this.timeOutLoader) {
      clearTimeout(this.timeOutLoader);
      this.timeOutLoader = null;
    }
    this.timeOutLoader = setTimeout(async () => {
      this.closeLoader();
    }, 1000 * 30);
  }




}
