'use strict';
const shell = require('shelljs');
const axios = require('axios');
const neatCsv = require('neat-csv');
const fs = require('fs');
//const JDBC = require('@naxmefy/jdbc').JDBC
const csv = require('csvtojson/v2')
var parser = require('xml2json');
const express = require('express');
const yaml = require('js-yaml');
const https = require('https');
var moment = require('moment');
const publicIp = require('public-ip');
const EventEmitter = require('events'); 
const Stream = new EventEmitter(); 

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

const {
    mongoUser,
    mongoPass,
    mongoIP,
    mongoPort,
    drimpacPort,
    drimpacIP,
    myDatabase,
    usefRefererAGR,
    usefRefererUpperAGR,
    usefRefererAGRUrl } = require('../bin/www');
const db_name = 'drimpac';

const MongoDbHelper = require('./MongoDbHelper');
let url = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoIP + ':' + mongoPort + '/' + db_name + '?authSource=admin';
let mongoDbHelper = new MongoDbHelper(url);
mongoDbHelper.start(() => {
    updateAggregatorsDB();
 });

 const config = {
    keepalive: true,
  }

const { Pool, Client } = require('pg')

const pool = new Pool({
    user: 'tsotakis',
    host: '160.40.52.193',
    database: 'tsotakis',
    password: 'test_password',
    port: 5432,
    keepalive: true,
  })
  pool.query('SELECT NOW()', (err, res) => {
    console.log("pool_query")
    console.log(err, res)
 //   pool.end()
  })
  const client = new Client({
    user: 'tsotakis',
    host: '160.40.52.193',
    database: 'tsotakis',
    password: 'test_password',
    port: 5432,
    keepalive: true,
  })
  client.connect()
  client.query('SELECT NOW()', (err, res) => {
    console.log("client_query")
    console.log(err, res)
  //  client.end()
  })


function updateAggregatorsDB()
{
    

    publicIp.v4().then(ip => {
    var ipaddress = ip;
    var doc = yaml.safeLoad(fs.readFileSync('/home/tsotakis/Desktop/ri.usef.energy-develop/usef-environment/config/usef-environment.yaml', 'utf8'));
    var Aggregators = new Object();
    Aggregators.upsertconst = "upsert";
    Aggregators.aggregators=new Array();
    for(let i=0; i<doc['nodes'][0]['processes'].length; i++)
    {
        if (doc['nodes'][0]['processes'][i]['agr-role']!=undefined)
        {
            console.log(doc['nodes'][0]['processes'][i]);
            let agr={};
            agr.name=doc['nodes'][0]['processes'][i]['domain-name'];
            agr.country=doc['nodes'][0]['processes'][i]['country'];
            agr.url="https://" +ipaddress+ ':' + doc['nodes'][0]['processes'][i]['forwward'] + '/' + doc['nodes'][0]['processes'][i]['domain-name']+'_AGR/';
            Aggregators.aggregators.push(agr);
        }      
    }
    console.log(Aggregators);
    mongoDbHelper.collection('aggregators').replaceOne({ 'upsertconst' : 'upsert'},
    Aggregators, { upsert: true }
    );
 });
}



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

exports.getAssetFlexibilityOffer = (req, res) => {
    try {
        let myAssets = [];
        let data = []
        myDatabase.createStatement()
            .then(statement => {
                return statement.executeQuery('SELECT CONNECTION_GROUP_ID,CONNECTION_ID FROM ' +usefRefererUpperAGR(req) + '.CONNECTION_GROUP_STATE')
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

                                    let powerData = response.data;
                                    console.log(arrayOfResults)
                                    for (let i = 0; i < powerData[0]['entries'].length; i++) {
                                        const price = Math.floor(Math.random() * (50 - 10 + 1) + 10);
                                        console.log(powerData[0]['entries'][i])
                                        if (!powerData[0]['entries'][i]['power'] && !powerData[0]['entries'][i]['price']) {
                                            powerData[0]['entries'][i]['power'] = 0;
                                            powerData[0]['entries'][i]['price'] = 0;
                                        }
                                        powerData[0]['entries'][i]['power'] += powerData[0]['entries'][i]['value'];
                                        powerData[0]['entries'][i]['start'] = i + 1;
                                        powerData[0]['entries'][i]['duration'] = 1;
                                        powerData[0]['entries'][i]['price'] += price;
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

exports.getFlexibilityOffer = (req, res) => {
    try {
        let myAssets = [];
        const congestionID = req.query.congestionID;
        const hostD = req.query.hostD;
        myDatabase.createStatement()
            .then(statement => {
                return statement.executeQuery('SELECT CONNECTION_GROUP_ID,CONNECTION_ID FROM ' + hostD + '.CONNECTION_GROUP_STATE')
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

                            console.log("POSTGRE");
                            client.query("select flexibility_power_kw from vtn_telemetry order by created_on limit 96")
                        .then(res2 => {
                        console.log(res2.rows)
                        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
                        let dt=[];
                        for (let i=res2.rows.length-1; i>=0; i--)
                        {
                            let dtt={};
                            dtt['power']= Number(res2.rows[i]['flexibility_power_kw'])*1000;
                            dtt['price']= Math.floor(Math.random() * (50 - 10 + 1) + 10);
                            dtt['start']= res2.rows.length -i;
                            dtt['duration']=1;
                            dt.push(dtt);
                        }

                        res.json({
                            status: 'success',
                            data: dt
                        });

                        })
                        .catch(e => console.error(e.stack));

                            // const tok = 'admin:password';
                            // const hash = Buffer.from(tok).toString('base64')
                            // const Basic = 'Basic ' + hash;
                            // axios.get('https://smarthome.iti.gr/energyapi/assignments/1dcc86c8-1593-4b60-9e4a-513ddeb6f1d4/measurements/series?tenantAuthToken=0817e7f4-f555-4b5c-9ae5-69b460b7b15d&startDate=2020-03-15T22:00:00.000Z&endDate=2020-03-19T00:01:00.000Z&measurementIds=PvLib_Pred&pageSize=1000',
                            //     { headers: { 'Authorization': Basic } })
                            //     .then(response => {
                            //         for (let i = 0; i < results.length; i++) {
                            //             myAssets.push(results[i]['systemID'])
                            //         }
                            //         let data = response.data;

                            //         for (let i = 0; i < arrayOfResults.length; i++) {
                            //             if (myAssets.includes(arrayOfResults[i]['CONNECTION_ID']) && congestionID === arrayOfResults[i]['CONNECTION_GROUP_ID']) {
                            //                 for (let i = 0; i < data[0]['entries'].length; i++) {
                            //                     const price = Math.floor(Math.random() * (50 - 10 + 1) + 10);
                            //                     console.log(data[0]['entries'][i])
                            //                     if (!data[0]['entries'][i]['power'] && !data[0]['entries'][i]['price']) {
                            //                         data[0]['entries'][i]['power'] = 0;
                            //                         data[0]['entries'][i]['price'] = 0;
                            //                     }
                            //                     data[0]['entries'][i]['power'] += data[0]['entries'][i]['value'];
                            //                     data[0]['entries'][i]['start'] = i + 1;
                            //                     data[0]['entries'][i]['duration'] = 1;
                            //                     data[0]['entries'][i]['price'] += price;
                            //                 }
                            //                 continue;
                            //             }
                            //         }

                            //         for (let i = 0; i < data[0]['entries'].length; i++) {
                            //             data[0]['entries'][i]['power'] * 1000;
                            //             delete data[0]['entries'][i]['value'];
                            //             delete data[0]['entries'][i]['measurementDate'];
                            //         }



                            //         res.json({
                            //             status: 'success',
                            //             data: data[0]['entries']
                            //         });
                            //     })
                            //     .catch(error => {
                            //         let data = [{ 'entries': [] }];
                            //         for (let i = 0; i < 96; i++) {
                            //             const power = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                            //             const price = Math.floor(Math.random() * (50 - 10 + 1) + 10);
                            //             data[0]['entries'].push({
                            //                 "power": power,
                            //                 "start": i,
                            //                 "duration": 1,
                            //                 "price": price
                            //             })
                            //         }

                            //         res.json({
                            //             status: 'success',
                            //             data: data[0]['entries']
                            //         });
                            //     });
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
        let data = []
        myDatabase.createStatement()
            .then(statement => {
                //return statement.executeQuery('SELECT CONNECTION_GROUP_ID,CONNECTION_ID FROM ' +usefRefererUpperAGR(req) + '.CONNECTION_GROUP_STATE')
                return statement.executeQuery('SELECT CONNECTION_GROUP_ID,CONNECTION_ID FROM WWW_MIWENERGIA_COM_AGR' + '.CONNECTION_GROUP_STATE')
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
        const hostD = req.query.hostD;
       
        myDatabase.createStatement()
            .then(statement => {
                return statement.executeQuery('SELECT CONNECTION_GROUP_ID,CONNECTION_ID FROM ' + hostD + '.CONNECTION_GROUP_STATE')
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
                           
                        client.query("select load_power_kw from vtn_telemetry order by created_on limit 96")
                        .then(res2 => {
                    
                        let dt=[];
                        for (let i=res2.rows.length-1; i>=0; i--)
                        {
                            let dtt={};
                            dtt['power']=Number(res2.rows[i]['load_power_kw'])*1000;
                            dt.push(dtt);
                        }

                        res.json({
                            status: 'success',
                            data: dt
                        });
                        
                        })
                        .catch(e => console.error(e.stack));

                        
                            // const tok = 'admin:password';
                            // const hash = Buffer.from(tok).toString('base64')
                            // const Basic = 'Basic ' + hash;
                            // axios.get('https://smarthome.iti.gr/energyapi/assignments/1dcc86c8-1593-4b60-9e4a-513ddeb6f1d4/measurements/series?tenantAuthToken=0817e7f4-f555-4b5c-9ae5-69b460b7b15d&startDate=2020-03-15T22:00:00.000Z&endDate=2020-03-19T00:01:00.000Z&measurementIds=PvLib_Pred&pageSize=1000',
                            //     { headers: { 'Authorization': Basic } })
                            //     .then(response => {

                            //         let data = response.data;
                            //         for (let i = 0; i < data[0]['entries'].length; i++) {
                            //             data[0]['entries'][i]['power'] = data[0]['entries'][i]['value'] * usefAssets * 1000
                            //             delete data[0]['entries'][i]['value'];
                            //             delete data[0]['entries'][i]['measurementDate'];
                            //         }
                            //         res.json({
                            //             status: 'success',
                            //             data: data[0]['entries']
                            //         });
                            //     })
                            //     .catch(error => {
                            //         let data = [{ 'entries': [] }];
                            //         for (let i = 0; i < 96; i++) {
                            //             const power = Math.floor(Math.random() * (100 - 0 + 1) + 0);
                            //             data[0]['entries'].push({
                            //                 "power": power
                            //             })
                            //         }

                            //         res.json({
                            //             status: 'success',
                            //             data: data[0]['entries']
                            //         });
                            //         // console.log(error);
                            //     });
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

        axios.post('https://' + usefRefererAGRUrl(req) + ':8443' + usefRefererAGR(req) +'rest/synchronisationconnections', connections)
            .then(response => {
                axios.get('https://' + usefRefererAGRUrl(req) + ':8443' + usefRefererAGR(req) +'rest/Event/CommonReferenceUpdateEvent')
                    .then(response => {
                        axios.get('https://' + usefRefererAGRUrl(req) + ':8443' + usefRefererAGR(req) +'rest/Event/CommonReferenceQueryEvent')
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


exports.getFlexResponseStatus = (req, res) => {
    console.log(req.query.Sequence);
   
    let Sequence= req.query.Sequence;
    try {
      let _result = [];
      myDatabase.createStatement()
        .then(statement => {
          return statement.executeQuery('SELECT XML FROM ' + usefRefererUpperAGR(req) + '.MESSAGE WHERE XML LIKE \'%FlexOfferResponse Sequence="' + Sequence +'"%\'')
        })
        .then(resultSet => {
          const arrayOfResults = resultSet.fetchAllResults()
          arrayOfResults.forEach(result => {
            _result.push(JSON.parse(parser.toJson(result['XML'])));
  
  
          })
          res.json({
            status: 'success',
            body: _result,
          }
          )
        },
  
        )
  
    }catch (error) {
      console.log(error);
      res.json({
        status: 'Error:' + error,
      });
    }

  }

  function revokeoffer(agr,offer,dso)
  {
    console.log("revoke async");
    let host_n= agr;
    let path_n = '/'+ agr +'_AGR/rest/FlexOfferRevocationEndpoint/revokeFlexOffer/'+ offer + '/'+ dso + '/DSO';
    console.log(path_n);
    try {
        const options = {
          method: "GET",
          hostname: host_n,
          port: "8443",
          path: path_n,
          headers: {
            "Content-Type": "application/json",
          },
          insecure: true,
        };
    
        var _req = https.request(options, function (_res) {
          var chunks = [];
    
          _res.on("data", function (chunk) {
            chunks.push(chunk);
          });
    
          _res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
          });
        });
    
        _req.end();
      }
      catch (error) {
        console.log(error);
      }
  }

  exports.revoke_offer = (req, res) => {
    console.log(req.body.sequence);
    console.log(req.body.congestionPoint);
    console.log(req.body.flexRequestSequence.toString());
    console.log(req.body.result);
    console.log(req.body.aggregator);
    console.log(req.body.dso);
   
 //   setTimeout(revokeoffer,2000,req.body.aggregator,req.body.sequence,req.body.dso);

    try {
        res.json({
            status: 'success',
            body: '',
          }
          )
        
  
    }catch (error) {
      console.log(error);
      res.json({
        status: 'Error:' + error,
      });

  }
}


exports.insertflexoffer = (req, res) => {
    
   let tmp = req.body;
   var doc = yaml.safeLoad(fs.readFileSync(process.env.USEF_FOLDER +'usef-environment/config/usef-environment.yaml', 'utf8'));
   let croName= ((doc['nodes'][0]['processes'][0]['domain-name'].replace(/\//g,'')).replace(/\./g,'_')).toUpperCase() + '_CRO';

    try {
        let _result = [];
        myDatabase.createStatement()
        .then(statement => {
          return statement.executeQuery('SELECT ENTITY_ADDRESS FROM ' + croName + '.CONNECTION WHERE (SELECT ID FROM ' + croName + '.CONGESTION_POINT WHERE ENTITY_ADDRESS = \''+ tmp['FlexOffer']['CongestionPoint'] +'\')')
        })
        .then(resultSet => {
          const arrayOfResults = resultSet.fetchAllResults()
          arrayOfResults.forEach(result => {
            _result.push(result['ENTITY_ADDRESS']);
  
  
          })
  
          tmp["Connections"]= _result;
          mongoDbHelper.collection('offers').insert(tmp);
        },
  
        )


        res.json({
            status: 'success',
            body: '',
          }
          )
        
  
    }catch (error) {
      console.log(error);
      res.json({
        status: 'Error:' + error,
      });

  }
}


function assign(obj, keyPath, value) {
    lastKeyIndex = keyPath.length-1;
    for (var i = 0; i < lastKeyIndex; ++ i) {
      key = keyPath[i];
      if (!(key in obj)){
        obj[key] = {}
      }
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
 }

exports.insertflexorder = (req, res) => {
    
    let tmp = req.body;
    var doc = yaml.safeLoad(fs.readFileSync(process.env.USEF_FOLDER +'usef-environment/config/usef-environment.yaml', 'utf8'));
    let croName= ((doc['nodes'][0]['processes'][0]['domain-name'].replace(/\//g,'')).replace(/\./g,'_')).toUpperCase() + '_CRO';
 
     try {
         let _result = [];
         var totaldisaggregation=[]
         myDatabase.createStatement()
         .then(statement => {
           return statement.executeQuery('SELECT ENTITY_ADDRESS FROM ' + croName + '.CONNECTION WHERE (SELECT ID FROM ' + croName + '.CONGESTION_POINT WHERE ENTITY_ADDRESS = \''+ tmp['FlexOrder']['CongestionPoint'] +'\')')
         })
         .then(resultSet => {
           const arrayOfResults = resultSet.fetchAllResults()
           arrayOfResults.forEach(result => {
             _result.push(result['ENTITY_ADDRESS']);
   
   
           })

           var totaldisaggregation = new Array();
          
           for (let i = 0; i < _result.length; i++) {
               var disaggregation =new Object();
               disaggregation.type='event';
               disaggregation.drprogram='Program1';//_result[i];
               disaggregation.event_start = moment(tmp['FlexOrder']['Period']).format("YYYY-MM-DDTHH:mm:SS");
               disaggregation.event_end = moment(tmp['FlexOrder']['MessageMetadata']['ValidUntil']).format("YYYY-MM-DDTHH:mm:SS");
               disaggregation.event_notification = moment(tmp['FlexOrder']['Period']).subtract(15, 'minutes').format("YYYY-MM-DDTHH:mm:SS");
               disaggregation.signalName='LOAD_DISPATCH';
               disaggregation.signalType='setpoint';
               let ptus=[];
               for (let y=0; y<tmp['FlexOrder']['PTU'].length; y++)
               {
                let tmpptu={};
                if(tmp['FlexOrder']['PTU'][y]['Duration']!=undefined)
                {
                    var num= +tmp['FlexOrder']['PTU'][y]['Duration'];
                    for (let l=0; l<num; l++)
                    {
                        tmpptu['duration']= parseInt(tmp['FlexOrder']['PTUDuration'].replace( /^\D+/g, '')).toString();
                        tmpptu['uid'] = parseInt(tmp['FlexOrder']['PTU'][y]['Start']) + l;
                        tmpptu['signalPayload']= (tmp['FlexOrder']['PTU'][y]['Power']/_result.length).toFixed(1);
                        ptus.push(tmpptu);
                    }
                }
                else
                {
                    tmpptu['duration']= parseInt(tmp['FlexOrder']['PTUDuration'].replace( /^\D+/g, '')).toString();
                    tmpptu['uid'] = parseInt(tmp['FlexOrder']['PTU'][y]['Start']);
                    tmpptu['signalPayload']= (tmp['FlexOrder']['PTU'][y]['Power']/_result.length).toFixed(1);
                    ptus.push(tmpptu);
                }
               }
               disaggregation.intervals=ptus;
              
              // console.log(disaggregation);
               totaldisaggregation.push(disaggregation);

               axios.post('http://160.40.49.244:8000/vtn_data_create', disaggregation)
               .then(response => {
                console.log(response);
               })
               .catch(error => {
                   console.log(error);
    
               });
              // tmp['disaggregation'].push(JSON.stringify(disaggregation));
              // tmp.disaggregation[JSON.stringify(disaggregation)]=[];
           }
           
           tmp['disaggregation']=totaldisaggregation;
           tmp["Connections"]= _result;
           console.log(tmp);
          mongoDbHelper.collection('orders').insert(tmp);
         },
   
         )
 
 
         res.json({
             status: 'success',
             body: '',
           }
           )
         
   
     }catch (error) {
       console.log(error);
       res.json({
         status: 'Error:' + error,
       });
 
   }
 }


 
 exports.getEvents= (req, res) => {
    res.writeHead(200, 
      { 'Content-Type': 'text/event-stream',
       'Cache-Control': 'no-cache',
        Connection: 'keep-alive', 
      }); 
    
      Stream.on('push', function(event, data) {
         res.write('event: ' + String(event) + '\n' + 'data: ' + JSON.stringify(data) + '\n\n'); 
        });
       
    };
  
    setInterval(function(){
      Stream.emit('push', 'message',{ msg: 'conn' });
    }, 10000); 
    
  
    exports.usefEvents= (req, res) => {
      let prop=req.body.data;
   //   let prop2=req.body.msg;
     console.log(prop);
      try {

        var obj = new Object();
        obj.data1=prop;
      //  obj.data2=prop2;
        Stream.emit('push', 'message',{ obj });
        let insert_params = {
          payload: {
              ['message']: req.body.data,
              ['data']: req.body.congp,
              ['timestamp']: moment().format(),
          },
      };  
       mongoDbHelper.collection('dsoPremises').insert(insert_params);

      res.json({
        status: 'Success',
        data: '1234'
      });
    }
    catch (error) {
      console.log(error);
      res.json({
        status: 'Error:' + error,
      });
    }
    }