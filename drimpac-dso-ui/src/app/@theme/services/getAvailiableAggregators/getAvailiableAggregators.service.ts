import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GetAvailiableAggregators {

    constructor(private httpClient: HttpClient) { }

    public getPremises() {

        return new Promise(resolve => {
            const url = 'https://160.40.52.193:9000/drimpac-dso/rest/getAvailiableAggregators';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        }); }
    }
