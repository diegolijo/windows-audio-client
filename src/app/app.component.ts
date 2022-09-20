/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Constants } from './services/config/constants';
import { StorageManager } from './services/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private storage: StorageManager,
    private platform: Platform,
    public constants: Constants
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    const result = await this.storage.getItem(Constants.SAVED_IP);
    this.constants.currentIp = result ? result : Constants.DEFAULT_IP;
  }


  public onChangeIp(event) {
    console.log(event.detail.value);
    this.storage.setItem(Constants.SAVED_IP,event.detail.value);
  }

}
