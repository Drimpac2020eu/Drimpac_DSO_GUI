import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DeleteDeviceService {

    constructor(private httpClient: HttpClient) { }

    public deleteDevice(name) {

        return new Promise(resolve => {
            const url = 'https://160.40.52.193:9000/drimpac-dso/rest/delete_device';
            this.httpClient.post(url, { 'name': name })
                .subscribe(
                    res => {
                        // console.log(res)
                        resolve('Device was successfully deleted!');
                    },
                    error => {
                        // console.log(error)
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }
}
