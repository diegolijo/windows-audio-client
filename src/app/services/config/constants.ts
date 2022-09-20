/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';



@Injectable()
export class Constants {

  public static readonly HTTP_PORT = '8015';
  public static readonly SOCKET_PORT = '8010';
  static readonly SAVED_IP = 'ip';
  static DEFAULT_IP = '192.168.1.133';

  public currentIp = '';

  constructor() {

  }



}
