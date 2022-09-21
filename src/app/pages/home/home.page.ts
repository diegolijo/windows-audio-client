import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SocketManager } from '../../services/socket-manager';
import { StorageManager } from '../../services/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  /*   @ViewChild('range') range: any; */
  /*
    listenFunc: () => void;
    public pxTop = 0;
    public pxLeft = 0; */

  constructor(
    private renderer: Renderer2,
    private socket: SocketManager,
    private storage: StorageManager,

  ) { }

  ngOnInit() {
    this.subscribeToSocket();
    this.socket.init();
    /*     this.pxLeft = (window.innerWidth - 35) / 2; */
  }

  ionViewDidEnter() {
    //  this.listenFunc = this.renderer.listen(this.range.nativeElement, 'input', () => this.onChangeRangeValue());

  }

  ngOnDestroy() {
    /*     this.listenFunc(); // Removes listener */
  }

  //******************************** VIEW ********************************/
  public onChangeRangeValue(value: number) {
    /*     const el = this.range.nativeElement; */
    console.log('value-> ' + value);
    this.socket.sendMessage(value);
    /*     this.pxTop = this.calculateFatherPosition(el.valueAsNumber); */
  }


  /*   private calculateFatherPosition(value: number) {
      const el = this.range.nativeElement;
      let pxTop = (el.clientWidth * (100 - value)) / 100;
      pxTop += el.offsetTop / 2;
      return pxTop;
    }
   */
  //***************************** FUNCTIONS *****************************/
  private setRangeValue(value: number) {
    /*     this.range.nativeElement.valueAsNumber = value ? value : 0; */
    // TODO mover el slide con la respuesta del socket
  }


  private handlerSocketEvent(value: any) {
    console.log(JSON.stringify(value, null, 4));
    switch (value.key) {
      case 'connected':
        this.setRangeValue(value.data.initialValue);
        /*         this.pxTop = this.calculateFatherPosition(value.data.initialValue); */
        break;
      case 'response':
        this.setRangeValue(value.data.changeValue);
        /*         this.pxTop = this.calculateFatherPosition(value.data.changeValue); */
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


  //***************************** SUBSCRIBE *****************************/
  private subscribeToSocket() {
    this.socket.getSocketObservable().subscribe(value => {
      this.handlerSocketEvent(value);
    });
  }

}
