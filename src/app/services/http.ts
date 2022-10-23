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
