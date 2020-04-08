import { NgModule, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { AppComponent } from '../app.component';
import { NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@NgModule({
   // declarations: [TimerComponent],
    bootstrap: [AppComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})


export class TimerComponent implements OnInit, OnDestroy {
    public message: any;
    private tick: string;
    private subscription: Subscription;
    constructor( private dialogService: NbDialogService, private httpClient: HttpClient) {
    //  this.message = new Array();
     //   const timer = TimerObservable.create(2000, 10000);
       // this.subscription = timer.subscribe(t => {
       //     this.tick = t.toString();
           //     const urlVesParams = 'drimpac-dso/rest/api/v1/getmessage';
           //     this.httpClient.get(urlVesParams, {
             //     params: {
             //       'email': '0',
             //    },
             //   })
             //   .subscribe(
             //     res => {
              //        if (res['status'] === 'success') {
               //         this.message.push(res['data']);
              //    }},
               //   error => {
               //   },
                //  );
       // });
    }

    ngOnInit() {

    }
    ngOnDestroy() {
      //  this.subscription.unsubscribe();
    }

}
