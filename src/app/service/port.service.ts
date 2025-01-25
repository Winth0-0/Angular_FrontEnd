import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortService {
  public port: string = "https://dev.test-api-demo.com/";
  public version: string = '1.2.1';
  public getJwtBearer(): any {
    return {
      Authorization: `Bearer null`
    };
  }
}
