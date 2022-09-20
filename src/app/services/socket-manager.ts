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

  private url ='';

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
          console.log('response: ' + data);
          this.onResponse(data);
        });
        await this.connect();
        this.subscribeToPauseResume();
        rs(true);
      } catch (err) {
        rj(err);
      }
    });
  }


  public async connect() {
    return new Promise(async (rs, rj) => {
      try {
        this.socket.connect();
        this.socket.on('connect', () => {
          console.log('cliente conectado');
          this.connected = true;
          rs(true);
        });
        this.socket.on('disconnect', () => {
          console.log('cliente desconectado');
          this.connected = false;
          rs(true);
        });
        this.socket.on('connect_error', () => {
          console.log('error al conectar');
          this.connected = false;
          rs(false);
        });
      } catch (err) {
        rj(err);
      }
    });
  }

  public disconect() {
    this.socket.disconnect();
  }

  public sendMessage(value) {
    this.socket.emit('value', { value: value });
  }

  public getSocketObservable() {
    return this.socketEvents.asObservable();
  }

  private onResponse(data) {
    this.socketEvents.next(data);
  }

  /**************************************  SOCKET EVENTS *******************************************/

  private async subscribeToPauseResume() {
    if (!this.resumeSubscription || this.resumeSubscription.closed) {
      this.resumeSubscription = await this.platform.resume.subscribe(() => this.ngZone.run(() => {
        this.connect();
      }));
    }
    if (!this.pauseSubscription || this.pauseSubscription.closed) {
      this.pauseSubscription = await this.platform.pause.subscribe(() => this.ngZone.run(() => {
        this.disconect();
      }));
    }
  }





}


