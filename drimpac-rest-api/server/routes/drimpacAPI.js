'use strict';
const shell = require('shelljs');
const axios = require('axios');
const neatCsv = require('neat-csv');
const fs = require('fs');
const JDBC = require('@naxmefy/jdbc').JDBC
const csv = require('csvtojson/v2')
var parser = require('xml2json');

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

const {
    mongoUser,
    mongoPass,
    mongoIP,
    mongoPort,
    drimpacPort,
    drimpacIP } = require('../bin/www');
const db_name = 'drimpac';

const MongoDbHelper = require('./MongoDbHelper');
let url = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoIP + ':' + mongoPort + '/' + db_name + '?authSource=admin';
let mongoDbHelper = new MongoDbHelper(url);
mongoDbHelper.start(() => { });

const { Pool, Client } = require('pg')
const connectionString = 'postgresql://drimpac:Drimpac2020!@160.40.49.244:45432/drimpac'
const pool = new Pool({
    connectionString: connectionString,
})
pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
})
const client = new Client({
    connectionString: connectionString,
})
client.connect()
client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
})

const myDatabase = new JDBC({
    className: 'org.h2.Driver',
    url: 'jdbc:h2:tcp://127.0.0.1//home/tsotakis/Desktop/ri.usef.energy-develop/usef-environment/nodes/localhost/data/agr1.miwenergia.com;CIPHER=AES;MVCC=true',
    username: 'usef',
    password: 'COAJfwfaQCRrPMf lpdeLRQUgHCeKTX'
})



exports.getEPE = (req, res) => {

    try {

        req.body.country;

        const epeData = shell.exec('python ' + __dirname + '/../pythonScripts/getPrices.py --country ' + req.body.country);

        if (epeData.stderr !== '') {
            res.json({
                status: 'error'
            });
        } else {
            res.json({
                status: 'success',
                data: {
                    epeData: epeData
                }
            });
        }
    }
    catch (error) {

        console.error(error);
    }
};


/*
exports.getProfilePrices = (req, res) => {


    try {

        req.body.profile;

         const profilePrices = shell.exec('python ' + __dirname + '/../pythonScripts/timeofuse.py --houseId ' + req.body.profile);

         if (profilePrices.stderr !== '') {
             res.json({
                 status: 'error'
             });
         } else {
             res.json({
                 status: 'success',
                 data: {
                    profilePrices: profilePrices
                 }
             });
         }
     }
     catch (error) {

         console.error(error);

     }

     };
*/

exports.getAvailableServices = (req, res) => {
    try {

        const service = req.query.serviceType
        let find_param = { "serviceType": service };

        mongoDbHelper
            .collection('energy_services')
            .find(find_param)
            .then(results => {
                return new Promise((resolve, reject) => {
                    res.json({
                        status: 'Success',
                        data: {
                            assets: results,
                        }
                    });
                });
            })

    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
}

exports.publishMessage = (req, res) => {

    try {

        req.body.users;


        shell.exec('python ' + __dirname + '/../pythonScripts/publisher.py --h 160.40.49.244 --list ' + req.body.users);
        const subscriber = shell.exec('python ' + __dirname + '/../pythonScripts/subscriber.py');


        if (subscriber.stderr !== '') {
            res.json({
                status: 'error'
            });
        } else {
            res.json({
                status: 'success',
                data: {
                    subscriber: subscriber
                }
            });
        }
    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }

};



/*
exports.subscribeMessage = (req, res) => {

    try {


        const subscriber = shell.exec('python ' + __dirname + '/../pythonScripts/subscriber.py');


        if (subscriber.stderr !== '') {
            res.json({
                status: 'error'
            });
        } else {
            res.json({
                status: 'success',
                data: {
                    subscriber: subscriber
                }
            });
        }
    }
    catch (error) {

        console.error(error);
    }
};
*/
exports.getPVData = (req, res) => {
    try {
        const tok = 'admin:password';
        const hash = Buffer.from(tok).toString('base64')
        const Basic = 'Basic ' + hash;
        axios.get('https://smarthome.iti.gr/energyapi/assignments/1dcc86c8-1593-4b60-9e4a-513ddeb6f1d4/measurements/lastValue?tenantAuthToken=0817e7f4-f555-4b5c-9ae5-69b460b7b15d',
            { headers: { 'Authorization': Basic } })
            .then(response => {
                res.json({
                    status: 'success',
                    data: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
};

exports.getLatestPVW = (req, res) => {

    try {
        const latestwatt = shell.exec(`${__dirname}/../pythonScripts/get_latest_pv.sh`);
        const watt = latestwatt.stdout.match(/floatingpoint\([0-9]*.[0-9]*\)/)[0].match(/\d*\.\d*/)
        const timestamp = latestwatt.stdout.match(/utctime\(.*\)/)[0].replace(/utctime\(/, '').replace(/\.000Z.*/, '')
        res.json({
            status: 'Success',
            data: {
                watt: watt,
                timestamp: timestamp,
            }
        });
    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
};

exports.getFlexibilityOffer = (req, res) => {
    try {
        let myAssets = [];
        let _result = [];
        const congestionID = req.query.congestionID;
        myDatabase.createStatement()
            .then(statement => {
                return statement.executeQuery('SELECT CONNECTION_GROUP_ID,CONNECTION_ID FROM AGR1_MIWENERGIA_COM_AGR.CONNECTION_GROUP_STATE')
            })
            .then(resultSet => {

                const arrayOfResults = resultSet.fetchAllResults()
                console.log(arrayOfResults)
                let find_param = {};
                mongoDbHelper
                    .collection('der_systems')
                    .find(find_param)
                    .then(results => {
                        return new Promise((resolve, reject) => {

                            const tok = 'admin:password';
                            const hash = Buffer.from(tok).toString('base64')
                            const Basic = 'Basic ' + hash;
                            axios.get('https://smarthome.iti.gr/energyapi/assignments/1dcc86c8-1593-4b60-9e4a-513ddeb6f1d4/measurements/series?tenantAuthToken=0817e7f4-f555-4b5c-9ae5-69b460b7b15d&startDate=2020-03-15T22:00:00.000Z&endDate=2020-03-19T00:01:00.000Z&measurementIds=PvLib_Pred&pageSize=1000',
                                { headers: { 'Authorization': Basic } })
                                .then(response => {
                                    for (let i = 0; i < results.length; i++) {
                                        myAssets.push(results[i]['systemID'])
                                    }
                                    let data = response.data;

                                    for (let i = 0; i < arrayOfResults.length; i++) {
                                        if (myAssets.includes(arrayOfResults[i]['CONNECTION_ID']) && congestionID === arrayOfResults[i]['CONNECTION_GROUP_ID']) {
                                            for (let i = 0; i < data[0]['entries'].length; i++) {
                                                const price = Math.floor(Math.random() * (50 - 10 + 1) + 10);
                                                console.log(data[0]['entries'][i])
                                                if(!data[0]['entries'][i]['power'] && !data[0]['entries'][i]['price']) {
                                                    data[0]['entries'][i]['power'] = 0;
                                                    data[0]['entries'][i]['price'] = 0;
                                                }
                                                data[0]['entries'][i]['power'] += data[0]['entries'][i]['value'];
                                                data[0]['entries'][i]['start'] = i + 1;
                                                data[0]['entries'][i]['duration'] = 1;
                                                data[0]['entries'][i]['price'] += price;
                                            }
                                            continue;
                                        }
                                    }

                                    for (let i = 0; i < data[0]['entries'].length; i++) {
                                        data[0]['entries'][i]['power'] * 1000;
                                        delete data[0]['entries'][i]['value'];
                                        delete data[0]['entries'][i]['measurementDate'];
                                    }



                                    res.json({
                                        status: 'success',
                                        data: data[0]['entries']
                                    });
                                })
                                .catch(error => {
                                    let data = [{ 'entries': [] }];
                                    for (let i = 0; i < 96; i++) {
                                        const power = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                                        const price = Math.floor(Math.random() * (50 - 10 + 1) + 10);
                                        data[0]['entries'].push({
                                            "power": power,
                                            "start": i,
                                            "duration": 1,
                                            "price": price
                                        })
                                    }

                                    res.json({
                                        status: 'success',
                                        data: data[0]['entries']
                                    });
                                });
                        });
                    })

            })
    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
};

exports.getAssetLoadForecast = (req, res) => {
    try {
        let myAssets = [];
        let usefAssets = 0;
        let _result = [];
        let data = []
        myDatabase.createStatement()
            .then(statement => {
                return statement.executeQuery('SELECT CONNECTION_GROUP_ID,CONNECTION_ID FROM AGR1_MIWENERGIA_COM_AGR.CONNECTION_GROUP_STATE')
            })
            .then(resultSet => {

                const arrayOfResults = resultSet.fetchAllResults()
                let find_param = {};
                mongoDbHelper
                    .collection('der_systems')
                    .find(find_param)
                    .then(results => {
                        return new Promise((resolve, reject) => {

                            for (let i = 0; i < results.length; i++) {
                                myAssets.push(results[i]['systemID'])
                            }

                            const tok = 'admin:password';
                            const hash = Buffer.from(tok).toString('base64')
                            const Basic = 'Basic ' + hash;
                            axios.get('https://smarthome.iti.gr/energyapi/assignments/1dcc86c8-1593-4b60-9e4a-513ddeb6f1d4/measurements/series?tenantAuthToken=0817e7f4-f555-4b5c-9ae5-69b460b7b15d&startDate=2020-03-15T22:00:00.000Z&endDate=2020-03-19T00:01:00.000Z&measurementIds=PvLib_Pred&pageSize=1000',
                                { headers: { 'Authorization': Basic } })
                                .then(response => {
                                    let powerData = response.data;
                                    console.log(arrayOfResults)
                                    for (let i = 0; i < powerData[0]['entries'].length; i++) {
                                        powerData[0]['entries'][i]['power'] = powerData[0]['entries'][i]['value']
                                        delete powerData[0]['entries'][i]['value'];
                                        delete powerData[0]['entries'][i]['measurementDate'];
                                    }
                                    for (let i = 0; i < arrayOfResults.length; i++) {
                                        if (myAssets.includes(arrayOfResults[i]['CONNECTION_ID'])) {
                                            data.push({
                                                congestionPoint: arrayOfResults[i]['CONNECTION_GROUP_ID'],
                                                connectionPoint: arrayOfResults[i]['CONNECTION_ID'],
                                                power: powerData[0]['entries']
                                            })
                                            continue;
                                        }
                                    }

                                    res.json({
                                        status: 'success',
                                        data: data
                                    });
                                })
                                .catch(error => {
                                    let data = [{ 'entries': [] }];
                                    for (let i = 0; i < 96; i++) {
                                        const power = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                                        data[0]['entries'].push({
                                            "power": power
                                        })
                                    }

                                    res.json({
                                        status: 'success',
                                        data: data[0]['entries']
                                    });
                                    // console.log(error);
                                });

                        });
                    })

            })

    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
};

exports.getLoadForecast = (req, res) => {
    try {
        let myAssets = [];
        let usefAssets = 0;
        let _result = [];
        const congestionID = req.query.congestionID;
        myDatabase.createStatement()
            .then(statement => {
                return statement.executeQuery('SELECT CONNECTION_GROUP_ID,CONNECTION_ID FROM AGR1_MIWENERGIA_COM_AGR.CONNECTION_GROUP_STATE')
            })
            .then(resultSet => {

                const arrayOfResults = resultSet.fetchAllResults()
                console.log(arrayOfResults)
                let find_param = {};
                mongoDbHelper
                    .collection('der_systems')
                    .find(find_param)
                    .then(results => {
                        return new Promise((resolve, reject) => {

                            for (let i = 0; i < results.length; i++) {
                                myAssets.push(results[i]['systemID'])
                            }

                            for (let i = 0; i < arrayOfResults.length; i++) {
                                if (myAssets.includes(arrayOfResults[i]['CONNECTION_ID']) && congestionID === arrayOfResults[i]['CONNECTION_GROUP_ID']) {
                                    usefAssets += 1;
                                    continue;
                                }
                            }

                            const tok = 'admin:password';
                            const hash = Buffer.from(tok).toString('base64')
                            const Basic = 'Basic ' + hash;
                            axios.get('https://smarthome.iti.gr/energyapi/assignments/1dcc86c8-1593-4b60-9e4a-513ddeb6f1d4/measurements/series?tenantAuthToken=0817e7f4-f555-4b5c-9ae5-69b460b7b15d&startDate=2020-03-15T22:00:00.000Z&endDate=2020-03-19T00:01:00.000Z&measurementIds=PvLib_Pred&pageSize=1000',
                                { headers: { 'Authorization': Basic } })
                                .then(response => {

                                    let data = response.data;
                                    for (let i = 0; i < data[0]['entries'].length; i++) {
                                        data[0]['entries'][i]['power'] = data[0]['entries'][i]['value'] * usefAssets * 1000
                                        delete data[0]['entries'][i]['value'];
                                        delete data[0]['entries'][i]['measurementDate'];
                                    }
                                    res.json({
                                        status: 'success',
                                        data: data[0]['entries']
                                    });
                                })
                                .catch(error => {
                                    let data = [{ 'entries': [] }];
                                    for (let i = 0; i < 96; i++) {
                                        const power = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                                        data[0]['entries'].push({
                                            "power": power
                                        })
                                    }

                                    res.json({
                                        status: 'success',
                                        data: data[0]['entries']
                                    });
                                    // console.log(error);
                                });
                        });
                    })

            })

    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
};

exports.publishConnections = (req, res) => {
    try {
        console.log(req.body)

        let method = '';
        if (req.body.delete) {
            method = 'DELETE';
        } else {
            method = 'POST';
        }
        let connections = [
            {
                "method": method,
                "entityAddress": req.body.eanID,
                "isCustomer": true
            }
        ];

        axios.post('https://agr1.miwenergia.com:8443/agr1.miwenergia.com_AGR/rest/synchronisationconnections', connections)
            .then(response => {
                axios.get('https://agr1.miwenergia.com:8443/agr1.miwenergia.com_AGR/rest/Event/CommonReferenceUpdateEvent')
                    .then(response => {
                        axios.get('https://agr1.miwenergia.com:8443/agr1.miwenergia.com_AGR/rest/Event/CommonReferenceQueryEvent')
                            .then(response => {
                                res.json({
                                    status: 'success',
                                });
                            })
                    })
            })
            .catch(error => {
                console.log(error);
                res.json({
                    status: 'Error:' + error,
                });
            });
    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
};

exports.getRegisteredConnections = (req, res) => {
    try {
        let find_param = {};
        mongoDbHelper
            .collection('der_systems')
            .find(find_param)
            .then(results => {
                return new Promise((resolve, reject) => {

                    res.json({
                        status: 'Success',
                        data: results
                    });
                });
            })
    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
};

exports.getLatestPVTimeseries = (req, res) => {
    try {
        let date = new Date();
        date.setHours(date.getHours() - 1);
        const d = { "$gt": date.toISOString() }
        let find_param = { "timestamp": d };
        mongoDbHelper
            .collection('pvSmartHouse')
            .find(find_param)
            .then(results => {
                return new Promise((resolve, reject) => {
                    res.json({
                        status: 'Success',
                        data: {
                            timeseries: results,
                        }
                    });
                });
            })
    }
    catch (error) {

        res.json({
            status: 'Error:' + error,
        });
    }
};
