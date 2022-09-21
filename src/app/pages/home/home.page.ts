import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SocketManager } from '../../services/socket-manager';
import { StorageManager } from '../../services/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  input: number;
  width: number;


  constructor(
    private renderer: Renderer2,
    private socket: SocketManager,
    private storage: StorageManager

  ) { }

  ngOnInit() {
    this.subscribeToSocket();
    this.socket.init();

    this.width = window.innerWidth;
  }

  //******************************** VIEW ********************************/
  public onChangeRangeValue(value: number) {
    console.log('value-> ' + value);
    this.socket.sendMessage(value);
    this.input = value;
  }

  //***************************** FUNCTIONS *****************************/
  private handlerSocketEvent(value: any) {
    console.log(JSON.stringify(value, null, 4));
    switch (value.key) {
      case 'connected':
        this.setRangeValue(value.data.initialValue);
        break;
      case 'response':
        this.setRangeValue(value.data.changeValue);
        break;
      case '':

        break;
      case '':

        break;
      case '':

        break;
      case '':

        break;
      default:
        break;
    }
  }

  private setRangeValue(value: number) {
    // TODO mover el slide con la respuesta del socket
  }


  //***************************** SUBSCRIBE *****************************/
  private subscribeToSocket() {
    this.socket.getSocketObservable().subscribe(value => {
      this.handlerSocketEvent(value);
    });
  }

}
