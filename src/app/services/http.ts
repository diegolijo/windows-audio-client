import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Http {

  constructor(
    private httpBrowser: HttpClient
  ) { }


  public post(url: string, body: any) {
    return new Promise((resolve: any, reject: any) => {
      this.httpBrowser.post(url, body).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

}
