import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../../env.service';
import { v1 as uuid } from 'uuid';
import * as moment from 'moment';

export interface IMessageMetadata {
    SenderDomain: string;
    SenderRole: string;
    RecipientDomain: string;
    RecipientRole: string;
    Precedence: string;
    ValidUntil: string;
}

interface IConnection {
    EntityAddress: string;
    IsCustomer: string;
    BRPDomain: string;
    AGRDomain: string;
}

interface ICommonReferenceUpdate {
    Entity: string;
    EntityAddress: string;
}

interface ICommonReferenceQuery {
    Entity: string;
    EntityAddress: string;
    ConnectionEntityAddress: string;
}

interface IAggregator {
    Domain: string;
    ConnectionCount: string;
}

interface ICongestionPoint {
    EntityAddress: string;
    DSODomain: string;
}

interface IPTU {
    Disposition: string;
    Power: string;
    Start: string;
    Duration: string;
    Price: string;
}

interface IPrognosis {
    Type: string;
    PTUDuration: string;
    Period: string;
    TimeZone: string;
    CongestionPoint: string;
    Sequence: string;
}

interface IFlexRequest {
    PrognosisOrigin: string;
    PrognosisSequence: string;
    PTUDuration: string;
    Period: string;
    TimeZone: string;
    CongestionPoint: string;
    Sequence: string;
    ExpirationDateTime: string;
}

interface IFlexOrder {
    FlexOfferOrigin: string;
    FlexOfferSequence: string;
    Currency: string;
    OrderReference: string;
    PTUDuration: string;
    Period: string;
    TimeZone: string;
    CongestionPoint: string;
    Sequence: string;
    ExpirationDateTime: string;
}

interface IPTUSettlement {
    Start: string;
    Duration: string;
    PrognosisPower: string;
    OrderedFlexPower: string;
    Price: string;
    ActualPower: string;
    DeliveredFlexPower: string;
    PowerDeficiency: string;
    Penalty: string;
    NetSettlement: string;
}

interface IFlexOrderSettlement {
    Period: string;
    OrderReference: string;
    CongestionPoint: string;
}

interface ISettlementMessage {
    TimeZone: string;
    PeriodStart: string;
    PeriodEnd: string;
    Reference: string;
    PTUDuration: string;
    Currency: string;
}

interface IMeterDataQuery {
    DateRangeStart: string;
    DateRangeEnd: string;
    QueryType: string;
    Parent: string;
    Connection: string;
}

export interface iCRO {
    method: string;
    domain: string;
}

export interface iConnection {
    entityAddress: string;
}

export interface iCongestion {
    method: string;
    entityAddress: string;
    connections: iConnection[];
}

export interface iCongestionDel {
    method: string;
    entityAddress: string;
}

export interface iflex {
    method4: string;
    methos2: string;
    numberss: string;
}

@Injectable()
export class XmlRequests {
    httpsServer:string;
    constructor(env: EnvService,private httpClient: HttpClient) { 
        this.httpsServer=env.httpsServer;
    }

    xmlver() {
        const str = '<?xml version="1.0" encoding="utf-8"?>\n';
        return str;
    }



    MessageMetadata(x: IMessageMetadata) {
        const str = '  <MessageMetadata SenderDomain="' + x.SenderDomain + '" SenderRole="' + x.SenderRole +
            '" RecipientDomain="' + x.RecipientDomain + '" RecipientRole="' + x.RecipientRole +
            '" TimeStamp="' + moment().format() + '" MessageID="' + uuid() +
            '" ConversationID="' + uuid() + '" Precedence="' + x.Precedence + '" ValidUntil="' + x.ValidUntil + '" />\n';

        return str;
    }

    Connection(x: IConnection) {
        const str = '<Connection EntityAddress="' + x.EntityAddress + '" IsCustomer="' + x.IsCustomer + '" BRP-Domain="' + x.BRPDomain +
            '" AGR-Domain="' + x.AGRDomain + '" />\n';
        return str;
    }

    Aggregator(x: IAggregator) {
        const str = '<Aggregator Domain="' + x.Domain + '" ConnectionCount="' + x.ConnectionCount + '" />\n';
        return str;
    }

    PTU(x: IPTU) {
        const str = '<PTU Disposition="' + x.Disposition + '" Power="' + x.Power + '" Start="' + x.Start + '" Duration="' + x.Duration + '" Price="' + x.Price + '" />\n';
        return str;
    }

    PTUSettlement(x: IPTUSettlement) {
        const str = '    <PTU-Settlement Start="' + x.Start + '" Duration="' + x.Duration + '" PrognosisPower="' + x.PrognosisPower +
            '" OrderedFlexPower="' + x.OrderedFlexPower + '" Price="' + x.Price + '" ActualPower="' + x.ActualPower +
            '" DeliveredFlexPower="' + x.DeliveredFlexPower + '" PowerDeficiency="' + x.PowerDeficiency + '" Penalty="' + x.Penalty + '" NetSettlement="'
            + x.NetSettlement + '" />\n';
        return str;
    }

    FlexOrderSettlement(x: IFlexOrderSettlement, y: IPTUSettlement) {
        const str = '  <FlexOrderSettlement Period="' + x.Period + '" OrderReference="' + x.OrderReference + '" CongestionPoint="' +
            x.CongestionPoint + '">\n' + this.PTUSettlement(y) + '  </FlexOrderSettlement>\n';
        return str;
    }

    public TestMessage(Metadata: IMessageMetadata) {
        const str = this.xmlver() +
            '<TestMessage\n' +
            this.MessageMetadata(Metadata) + '"</TestMessage>';
        return str;

    }

    public CommonReferenceUpdate(x: ICommonReferenceUpdate, connection: IConnection, Metadata: IMessageMetadata) {
        const str = this.xmlver() + '<CommonReferenceUpdate Entity="' + x.Entity + '" EntityAddress="' + x.EntityAddress + '">\n' +
            this.MessageMetadata(Metadata) + '  ' + this.Connection(connection) + '</CommonReferenceUpdate>';
        return str;
    }

    public CommonReferenceQuery(x: ICommonReferenceQuery, Metadata: IMessageMetadata) {
        const str = this.xmlver() + '<CommonReferenceQuery Entity="' + x.Entity + '" EntityAddress="' + x.EntityAddress + '">\n' +
            this.MessageMetadata(Metadata) + '  ' + '<ConnectionEntityAddress>' + x.ConnectionEntityAddress + '</ConnectionEntityAddress>\n' +
            '</CommonReferenceQuery>';
        return str;
    }

    public CongestionPoint(x: ICongestionPoint, connection: IConnection, aggregator: IAggregator) {
        const str = this.xmlver() + '<CongestionPoint EntityAddress="' + x.EntityAddress + '" DSO-Domain="' + x.DSODomain + '">\n'
            + '  ' + this.Connection(connection) + '  ' + this.Aggregator(aggregator) + '</CongestionPoint>';
        return str;
    }

    public Prognosis(x: IPrognosis, Metadata: IMessageMetadata, pTU: IPTU) {
        const str = this.xmlver() +
            '<Prognosis Type="' + x.Type + '" PTU-Duration="' + x.PTUDuration + '" Period="' + x.Period + '" TimeZone="' + x.TimeZone + '" CongestionPoint="' +
            x.CongestionPoint + '" Sequence="' + x.Sequence + '">\n' + this.MessageMetadata(Metadata) + '  ' + this.PTU(pTU) + '</Prognosis>';
        return str;
    }

    public FlexRequest(x: IFlexRequest, Metadata: IMessageMetadata, pTU: IPTU) {
        const str = this.xmlver() +
            '<FlexRequest PrognosisOrigin="' + x.PrognosisOrigin + '" PrognosisSequence="' + x.PrognosisSequence + '" PTU-Duration="' + x.PTUDuration +
            '" Period="' + x.Period + '" TimeZone="' + x.TimeZone + '" CongestionPoint="' + x.CongestionPoint + '" Sequence="' + x.Sequence +
            '" ExpirationDateTime="' + x.ExpirationDateTime + '">\n' + this.MessageMetadata(Metadata) + '  ' + this.PTU(pTU) + '</FlexRequest>';
        return str;
    }
    public FlexOrder(x: IFlexOrder, Metadata: IMessageMetadata, pTU: IPTU) {
        const str = this.xmlver() +
            '<FlexOrder FlexOfferOrigin="' + x.FlexOfferOrigin + '" FlexOfferSequence="' + x.FlexOfferOrigin + '" Currency="' + x.Currency +
            '" OrderReference="' + x.OrderReference + '" PTU-Duration="' + x.PTUDuration + '" Period="' + x.Period + '" TimeZone="' + x.TimeZone +
            '" CongestionPoint="' + x.CongestionPoint + '" Sequence="' + x.Sequence + '" ExpirationDateTime="' + x.ExpirationDateTime + '">\n'; +
                this.MessageMetadata(Metadata) + '  ' + this.PTU(pTU) + '</FlexOrder>';
        return str;
    }


    public SettlementMessage(x: ISettlementMessage, Metadata: IMessageMetadata, y: IFlexOrderSettlement, z: IPTUSettlement) {
        const str = this.xmlver() + '<SettlementMessage TimeZone="' + x.TimeZone + '" PeriodStart="' + x.PeriodStart + '" PeriodEnd="' + x.PeriodEnd +
            '" Reference="' + x.Reference + '" PTU-Duration="' + x.PTUDuration + '" Currency="' + x.Currency + '">\n' + this.MessageMetadata(Metadata) +
            this.FlexOrderSettlement(y, z) + '</SettlementMessage>';
        return str;
    }

    public MeterDataQuery(x: IMeterDataQuery, Metadata: IMessageMetadata) {
        const str = this.xmlver() +
            '<MeterDataQuery DateRangeStart="' + x.DateRangeStart + '" DateRangeEnd="' + x.DateRangeEnd + '" QueryType="' + x.QueryType + '">\n' +
            this.MessageMetadata(Metadata) + '  <Connections Parent="' + x.Parent + '">\n' + '    ' + '<Connection>' + x.Connection + '</Connection>\n' +
            '  </Connections>\n' + '</MeterDataQuery>';
        return str;
    }

    public getCROs() {
        const headerDict = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }

        const requestOptions = {
            headers: new HttpHeaders(headerDict),
        };
        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/getCROs';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public getSynchronisationCongestionpoints() {
        const headerDict = {
            'Access-Control-Allow-Origin': '*',
        }

        const requestOptions = {
            headers: new HttpHeaders(headerDict),
        };
        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/getSynchronisationCongestionpoints';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public postXMLMessage(str: string) {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/api/v1/xml_message';
            this.httpClient.post(url,
                {
                    method: 'POST',
                    headers: {

                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    parameters: str,
                })
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public addNewCongestion(data) {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/add_Congestion';



            this.httpClient.post(url, data)
                .subscribe(
                    res => {
                        resolve('Command Successfully Sent!');
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public getPrognosis() {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/getPrognoses';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public getFlexOffer() {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/getFlexOffer';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public getFlexOrder() {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/getFlexOrder';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public getConfigFile() {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/getConfigFile';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public CommonReferenceUpdateEvent() {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/commoneferenceupdate';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public CommonReferenceQueryEvent() {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/commoneferencequery';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public CreateConnectionForecastEvent() {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/connectionforecast';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public FlexOrderEvent() {

        return new Promise(resolve => {

            const url = this.httpsServer + '/drimpac-dso/rest/flexorder';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public createFlexrequest(data) {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/flexrequest';



            this.httpClient.post(url, data)
                .subscribe(
                    res => {
                        resolve('Command Successfully Sent!');
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public getDrmsCong() {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/getDrmsCongestions';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public getActiveCongestions() {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/activecongestions';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }


    public getActiveAggregators() {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/activeaggregators';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public revokeflexoffer(data) {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/flexofferrevoke';



            this.httpClient.post(url, data)
                .subscribe(
                    res => {
                        resolve('Command Successfully Sent!');
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }


    public getrevokeflexoffer() {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/getflexofferrevoke';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public getusefProperty(data) {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/getusefparameters';



            this.httpClient.post(url, data)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    public setusefProperty(data) {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/setusefparameters';



            this.httpClient.post(url, data)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }


    public getPlanboardFlexOffer() {

        return new Promise(resolve => {
            const url = this.httpsServer + '/drimpac-dso/rest/planBoardflexoffer';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

}
