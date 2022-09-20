import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Injectable()
export class StorageManager {

  constructor(
    public platform: Platform,
    public storageBrowser: Storage,
    public storageNative: NativeStorage
  ) {
    this.storageBrowser.create();
  }

  public setItem(key: string, value: any): Promise<void> {
    if (this.platform.is('cordova')) {
      return new Promise((resolve, reject) => {
        this.storageNative.setItem(key, value).then(() => {
          resolve();
        }, (err: any) => {
          reject(err);
        });
      });
    } else {
      return this.storageBrowser.set(key, value);
    }
  }

  public getItem(key: string): Promise<any> {
    if (this.platform.is('cordova')) {
      return new Promise((resolve, reject) => {
        this.storageNative.getItem(key).then((value: any) => {
          resolve(value);
        }, (err: any) => {
          if (err.code === 2) {
            resolve(null);
          } else {
            reject(err);
          }
        });
      });
    } else {
      return this.storageBrowser.get(key);
    }
  }

  public removeItem(key: string) {
    if (this.platform.is('cordova')) {
      return new Promise((resolve, reject) => {
        this.storageNative.remove(key).then(() => {
          resolve(null);
        }).catch((err: any) => {
          reject(err);
        });
      });
    } else {
      return this.storageBrowser.remove(key);
    }
  }

  public clear() {
    if (this.platform.is('cordova')) {
      return new Promise((resolve, reject) => {
        this.storageNative.clear().then(() => {
          resolve(null);
        }, (err: any) => {
          reject(err);
        });
      });
    } else {
      return this.storageBrowser.clear();
    }
  }
}
