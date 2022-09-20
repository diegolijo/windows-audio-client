import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Http as HttpManager } from '../../services/http';
import { SocketManager } from '../../services/socket-manager';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('range') range: any;

  listenFunc: () => void;

  constructor(
    private renderer: Renderer2,
    private socket: SocketManager,
    private http: HttpManager,

  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.listenFunc = this.renderer.listen(this.range.nativeElement, 'input', () => this.onChangeRangeValue());
    //this.setRangeValue(55);
    this.socket.init();
  }

  ngOnDestroy() {
    // Removes "listen" listener
    this.listenFunc();

  }

  private onChangeRangeValue() {
    console.log('value-> ' + this.range.nativeElement.valueAsNumber);
    this.socket.sendMessage(this.range.nativeElement.valueAsNumber);
  }

  private setRangeValue(value: number) {
    this.range.nativeElement.valueAsNumber = value ? value : 0;
  }

}
