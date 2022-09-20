/* eslint-disable object-shorthand */
import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Constants } from '../config/constants';


@Injectable()
export class SocketManager {

  public connected = false;

  private socket: Socket;
  private socketEvents = new Subject<any>();

  private url = '';

  private user = 'usuario prueba';

  private resumeSubscription: any;
  private pauseSubscription: any;

  constructor(
    private platform: Platform,
    private ngZone: NgZone
  ) { }

  public async init() {
    return new Promise(async (rs, rj) => {
      try {
        this.url = 'http://172.18.2.78:8010';
        this.socket = io(this.url,
          {
            autoConnect: false,
            reconnection: true,
            query: {
              user: this.user
            }
          });

        this.socket.on('response', (data) => {
          this.onResponse('response', data);
        });

        this.socket.on('connected', (data) => {
          this.onResponse('connected', data);
        });

        this.socket.on('connect', () => {
          this.connected = true;
          this.onResponse('connect');
        });

        this.socket.on('disconnect', () => {
          this.connected = false;
          this.onResponse('disconnect');
        });

        this.socket.on('connect_error', () => {
          this.connected = false;
          this.onResponse('connect_error');
        });

        this.subscribeToPauseResume();
        this.connect();
        rs(true);
      } catch (err) {
        rj(err);
      }
    });
  }

  public getSocketObservable() {
    return this.socketEvents.asObservable();
  }

  public sendMessage(value) {
    this.socket.emit('value', { value: value });
  }

  private connect() {
    this.socket.connect();
  }

  private disconect() {
    this.socket.disconnect();
  }

  private onResponse(key, data?) {
    this.socketEvents.next({ key: key, data });
  }

  /**************************************  SOCKET EVENTS *******************************************/

  private async subscribeToPauseResume() {
    if (!this.resumeSubscription || this.resumeSubscription.closed) {
      this.resumeSubscription = await this.platform.resume.subscribe(() => this.ngZone.run(() => {

      }));
    }
    if (!this.pauseSubscription || this.pauseSubscription.closed) {
      this.pauseSubscription = await this.platform.pause.subscribe(() => this.ngZone.run(() => {
        this.disconect();
      }));
    }
  }





}


