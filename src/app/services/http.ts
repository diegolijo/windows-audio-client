import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Http {

  constructor(
    private httpBrowser: HttpClient
  ) { }


  public get(url: string) {
    return new Promise((resolve: any, reject: any) => {
      this.httpBrowser.get(url, { responseType: 'text' }).subscribe((res: any) => {
        resolve(JSON.parse(res));
      }, (err: any) => {
        reject(err);
      });
    });
  }

}

// export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
// export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"
// export GRADLE_HOME=/opt/gradle/gradle-7.4.2
// export PATH=$PATH:$HOME"/Android/Sdk/platform-tools"