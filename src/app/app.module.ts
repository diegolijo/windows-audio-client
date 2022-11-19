import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SocketManager } from './services/socket-manager';
import { HttpClientModule } from '@angular/common/http';
import { Http } from './services/http';
import { Constants } from './services/config/constants';
import { Helper } from './services/helper';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { StorageManager } from './services/storage';
import { ComponentsModule } from './components/components.module';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { DirectivesModule } from './directives/directives-module';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    DirectivesModule
  ],
  providers: [
    // app services
    SocketManager,
    Http,
    Constants,
    Helper,
    StorageManager,
    // cordova plugins
    Vibration,
    AppMinimize,
    SplashScreen,
    Device,
    NativeStorage,
    BarcodeScanner,
    WifiWizard2,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
