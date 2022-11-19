/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';



@Injectable()
export class Constants {

  public static readonly HTTP_PORT = '8015';
  public static readonly SOCKET_PORT = '8010';
  public static readonly SAVED_IP = 'ip';
  public static readonly DEFAULT_IP = '192.168.1.133';

  public static readonly SENSOR_IP = '192.168.1.200';

  public currentIp: string[] = [Constants.DEFAULT_IP];

  constructor() {

  }



}
