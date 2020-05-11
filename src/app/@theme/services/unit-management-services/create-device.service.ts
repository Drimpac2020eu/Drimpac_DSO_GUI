import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  HttpHeaders} from '@angular/common/http';
@Injectable()
export class CreateDeviceService {

    constructor(private httpClient: HttpClient) { }

    public createNewDevice( name, description,  ip, port) {

        return new Promise(resolve => {
            const url = 'https://160.40.52.193:9000/drimpac-dso/rest/add_device';
            const data = {
                'type': 'Resource',
                'unitType': 'Aggregator',
                'name': name,
                'IP': ip,
                'Port': port,
                'description': description,
            };

            const options = {
                headers: new HttpHeaders().append('Access-Control-Allow-Origin', '*'),
              }
           
            
            this.httpClient.post(url, data, options )
                .subscribe(
                    res => {
                        resolve('Device was successfully created!');
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }
}
