import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  HttpHeaders} from '@angular/common/http';
@Injectable()
export class deleteCroService {

    constructor(private httpClient: HttpClient) { }

    public getCro() {

        return new Promise(resolve => {
            const url = 'https://160.40.52.193:9000/drimpac-dso/rest/get_CRO';


            
            this.httpClient.get(url )
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