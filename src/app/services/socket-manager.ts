/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Constants } from './config/constants';
import { Helper } from './helper';

@Injectable()
export class SocketManager {

  public isConnected = false;
  private socket: Socket;
  private socketEvents = new Subject<any>();
  private url = '';
  private user = 'usuario prueba';
  private arduinoSocket: WebSocket;

  constructor(
    private platform: Platform,
    private constants: Constants,
    private helper: Helper
  ) { }

  public async init() {
    return new Promise(async (rs, rj) => {
      try {
        await this.platform.ready();
        this.url = `http://${this.constants.currentIp[0]}:${Constants.SOCKET_PORT}`;
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
          this.isConnected = true;
          this.onResponse('connect');
        });

        this.socket.on('disconnect', () => {
          this.isConnected = false;
          this.onResponse('disconnect');
        });

        this.socket.on('connect_error', () => {
          this.isConnected = false;
          this.onResponse('connect_error');
        });
        this.connect();
        rs(true);
      } catch (err) {
        rj(err);
      }
    });
  }

  public destroy() {
    if (this.socket) {
      this.socket.disconnect();
      delete this.socket;
    }
  }

  public getSocketObservable() {
    return this.socketEvents.asObservable();
  }

  public sendMessage(value) {
    if (this.isConnected) {
      this.socket.emit('value', { key: 'message', value: value });
    }
  }

  public sendKeyCode(value) {
    if (this.isConnected) {
      this.socket.emit('value', { key: 'keycode', value: value });
    }
  }

  public sendKeyURL(value) {
    if (this.isConnected) {
      this.socket.emit('value', { key: 'url', value: value });
    }
  }

  public sendCommand(press, value) {
    if (this.isConnected) {
      this.socket.emit('value', { key: press, value: value });
    }
  }

  // ------------------ arduino socket -------------------
  public clearArduinoSocket() {
    try {
      delete this.arduinoSocket;
    } catch (err) {
      console.log(err);
    }
  }

  public initArduinoSocket(onMessage, onOpen?, onClose?, onError?) {
    try {
      console.log('Trying to open a WebSocket connection...');
      const gateway = `ws://${Constants.SENSOR_IP}:${Constants.HTTP_PORT}/ws`;
      this.arduinoSocket = new WebSocket(gateway);
      this.arduinoSocket.onopen = onOpen;
      this.arduinoSocket.onclose = onClose;
      this.arduinoSocket.onmessage = onMessage;
      this.arduinoSocket.onerror = onError;
    } catch (err) {
      console.log(err);
    }
  }

  //--------------------------------------------------------

  private connect() {
    this.socket.connect();
  }

  /*   private disconnect() {
         this.socket.disconnect();
    } */

  private onResponse(key, data?) {
    this.socketEvents.next({ key: key, data });
  }




}


