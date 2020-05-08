import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs'; 
import {SseService} from './sse.service';

@Injectable(
    { providedIn: 'root', }
    )

    export class serverEvents { 
        constructor(private _zone: NgZone, private _sseService: SseService) {} 

    /** * Returns the event source stream */

    ServerSentEvent(url: string) { 
        return Observable.create(observer => {
            const eventSource = this._sseService.getEventSource(url); 

            eventSource.onmessage = event => {
                 this._zone.run(() => {
                      observer.next(event); 
                    });
                 };

            eventSource.onerror = error => { 
                this._zone.run(() => { observer.error(error); 
                }); 
            }; 
        }); 
    } 
    } 