import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  HttpHeaders} from '@angular/common/http';
@Injectable()
export class registerCroService {

    constructor(private httpClient: HttpClient) { }

    public addNewCro( data) {

        return new Promise(resolve => {
            const url = 'https://160.40.52.193:9000/drimpac-dso/rest/add_CRO';


            
            this.httpClient.post(url, data )
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