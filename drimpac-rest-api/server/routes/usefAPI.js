'use strict';
const express = require('express');
const shell = require('shelljs');
const https = require('https');
var parser = require('xml2json');
var moment = require('moment');

const yaml = require('js-yaml');
const fs = require('fs');
const url = require('url');


const {
  mongoUser,
  mongoPass,
  mongoIP,
  mongoPort,
  drimpacPort,
  drimpacIP,
  myDatabase,
  usefRefererDSO,
  usefRefererUpperDSO,
  usefRefererDSOUrl} = require('../bin/www');

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
var njs = '';
exports.getEPE = (req, res) => {
  const epeData = shell.exec("python -V");
  if (epeData.stderr === '') {
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

};

//const myDatabase = new JDBC({
//  className: 'org.h2.Driver',
//  url: 'jdbc:h2:tcp://localhost//home/tsotakis/Desktop/ri.usef.energy-develop/usef-environment/nodes/localhost/data/dso1.miwenergia.com;CIPHER\=AES;MVCC\=true',
//  username: 'usef',
//  password: 'sPPuQOfRbEMVjeQ EAerNmYPMNpZjHw'
//})



exports.sendmessage = (req, res) => {
  if (njs !== '') {
    res.json({
      status: 'success',
      data: njs
    }
    );
  }
  else {

    res.json({
      status: 'error'

    }
    )
  }
  njs = '';
}

exports.getmessage = (req, res) => {
  console.log('messge_resvv');
  console.log(req.body.data);
  njs = req.body.data;

  res.json({
    status: 'success',
    data: '1234'
  }
  )

}

exports.getCROs = (_req, _res) => {
  console.log('getCROs');
  const options = {
    hostname: usefRefererDSOUrl(_req),
    port: 8443,
    path: usefRefererDSO(_req) + 'rest/commonreferenceoperators',
    insecure: true
  }

  https.get(options, (res) => {

    let str = '';
    res.on('data', (d) => {
      str += d;
    });

    res.on('end', (en) => {
      _res.json({
        status: 'success',
        body: JSON.parse(str).body
      })
      console.log(str);
    });

  }).on('error', (e) => {
    console.error(e);
  });
}

exports.getSynchronisationCongestionpoints = (_req, _res) => {
  console.log('getCROs');
  const options = {
    hostname: usefRefererDSOUrl(_req),
    port: 8443,
    path: usefRefererDSO(_req) + 'rest/synchronisationcongestionpoints',
    insecure: true
  }

  https.get(options, (res) => {

    let str = '';
    res.on('data', (d) => {
      str += d;
    });

    res.on('end', (en) => {
      _res.json({
        status: 'success',
        body: JSON.parse(str).body
      })
      console.log(str);
    });

  }).on('error', (e) => {
    console.error(e);
  });
}


exports.xmlMessage = (req, res) => {
  try {
    const options = {
      method: "POST",
      hostname: 'agr1.usef-example.com',
      port: "8443",
      path: '/agr1.usef-example.com_AGR/rest/MessageService/sendMessage',
      headers: {
        "Content-Type": "text/xml",
        "cache-control": "no-cache",
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

    _req.write(req.body.parameters);
    _req.end();
    console.log(req.body.parameters);
    res.json({
      status: 'Success',
    });
  }
  catch (error) {

    res.json({
      status: 'Error:' + error,
    });
  }
};


exports.addCRO = (req, res) => {
  console.log('messge_resvv');
  console.log(req.body);
  try {
    const options = {
      method: "POST",
      hostname: usefRefererDSOUrl(req),
      port: "8443",
      path: usefRefererDSO(req) + 'rest/commonreferenceoperators',
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

    _req.write(JSON.stringify(req.body));
    _req.end();
    //console.log(req.body.parameters);
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

exports.getCRO = (req, res) => {
  console.log('getCRO');

  try {
    const options = {
      method: "GET",
      hostname: usefRefererDSOUrl(req),
      port: "8443",
      path: usefRefererDSO(req) + 'rest/commonreferenceoperators',
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

    // _req.write(JSON.stringify(req.body));
    _req.end();
    console.log(_req.body.parameters);
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



exports.addCongestion = (req, res) => {
  console.log('addcong');
  console.log(req.body);
  try {
    const options = {
      method: "POST",
      hostname: usefRefererDSOUrl(req),
      port: "8443",
      path: usefRefererDSO(req) + 'rest/synchronisationcongestionpoints',
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

    _req.write(JSON.stringify(req.body));
    _req.end();
    //console.log(req.body.parameters);
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


exports.getPrognoses = (req, res) => {
  try {
    let _result = [];
    myDatabase.createStatement()
      .then(statement => {
        return statement.executeQuery('SELECT XML FROM ' + usefRefererUpperDSO(req) + '.MESSAGE WHERE XML LIKE \'%Prognosis %\'')
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

  }


  catch (error) {
    console.log(error);
    res.json({
      status: 'Error:' + error,
    });
  }
}


exports.getFlexOffer = (req, res) => {
  try {
    let _result = [];
    myDatabase.createStatement()
      .then(statement => {
        return statement.executeQuery('SELECT XML FROM ' + usefRefererUpperDSO(req) + '.MESSAGE WHERE XML LIKE \'%FlexOffer %\'')
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

  }


  catch (error) {
    console.log(error);
    res.json({
      status: 'Error:' + error,
    });
  }
}

exports.getFlexOrder = (req, res) => {
  try {
    let _result = [];
    myDatabase.createStatement()
      .then(statement => {
        return statement.executeQuery('SELECT XML FROM ' + usefRefererUpperDSO(req) + '.MESSAGE WHERE XML LIKE \'%FlexOrder %\'')
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

  }


  catch (error) {
    console.log(error);
    res.json({
      status: 'Error:' + error,
    });
  }
}

exports.getConfigFile = (req, res) => {
  try {
    var doc = yaml.safeLoad(fs.readFileSync('/home/tsotakis/Desktop/ri.usef.energy-develop/usef-environment/config/usef-environment.yaml', 'utf8'));
    console.log(doc);
    res.json({
      status: 'success',
      body: JSON.stringify(doc),
    }
    )
  }
  catch (error) {
    console.log(error);
    res.json({
      status: 'Error:' + error,
    });
  }
}



exports.commoneferenceupdate = (req, res) => {
  try {
    const options = {
      method: "GET",
      hostname: usefRefererDSOUrl(req),
      port: "8443",
      path: usefRefererDSO(req) + 'rest/Event/CommonReferenceUpdateEvent',
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

    // _req.write(JSON.stringify(req.body));
    _req.end();
    // console.log(_req.body.parameters);
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


exports.commoneferencequery = (req, res) => {
  try {
    const options = {
      method: "GET",
      hostname: usefRefererDSOUrl(req),
      port: "8443",
      path: usefRefererDSO(req) + 'rest/Event/CommonReferenceQueryEvent',
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

    // _req.write(JSON.stringify(req.body));
    _req.end();
    //console.log(_req.body.parameters);
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


exports.connectionforecast = (req, res) => {
  try {
    const options = {
      method: "GET",
      hostname: usefRefererDSOUrl(req),
      port: "8443",
      path: usefRefererDSO(req) + 'rest/Event/CreateConnectionForecastEvent',
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

    // _req.write(JSON.stringify(req.body));
    _req.end();
    //console.log(_req.body.parameters);
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

exports.flexorder = (req, res) => {
  try {
    const options = {
      method: "GET",
      hostname: usefRefererDSOUrl(req),
      port: "8443",
      path: usefRefererDSO(req) + 'rest/Event/FlexOrderEvent',
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

    // _req.write(JSON.stringify(req.body));
    _req.end();
    //console.log(_req.body.parameters);
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
exports.flexrequest = (req, res) => {

  let str = req.body[0].toString() + '/' + req.body[1].toString() + '/' + req.body[2].toString();
  console.log(str);
  try {
    const options = {
      method: "GET",
      hostname: usefRefererDSOUrl(req),
      port: "8443",
      path: usefRefererDSO(req) + 'rest/Event/CreateFlexRequestEvent' + '/' + str,
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

    // _req.write(JSON.stringify(req.body));
    _req.end();
    //console.log(_req.body.parameters);
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


exports.activecongestions = (req, res) => {
  var url2 = req.socket.localAddress;
 // console.log("url: " + url2);    //prints out url: /dashboard
  var user = {
    agent: req.header('user-agent'), // User Agent we get from headers
    referrer:  (((url.parse(req.headers.referer).pathname).replace(/\//g,'')).replace(/\./g,'_')).toUpperCase(), //  Likewise for referrer
    ip: req.header('x-forwarded-for') || req.connection.remoteAddress, // Get IP - allow for proxy
    screen: { // Get screen info that we passed in url post data
      width: req.param('width'),
      height: req.param('height')
    }
  };
  console.log( usefRefererDSO(req) +' usefRefererDSO');
  console.log( usefRefererUpperDSO(req) +' usefRefererUpperDSO' );
  console.log( usefRefererDSOUrl(req) + ' usefRefererDSOUrl');
  try {
    let _result = [];
    myDatabase.createStatement()
      .then(statement => {
        return statement.executeQuery('SELECT * FROM ' + usefRefererUpperDSO(req) + '.CONNECTION_GROUP_STATE')
      })
      .then(resultSet => {
        const arrayOfResults = resultSet.fetchAllResults()
        arrayOfResults.forEach(result => {
          _result.push(result);
        })
        console.log(_result);
        res.json({
          status: 'success',
          body: _result,
        }
        )
      },

      )

  }
  catch{
    console.log(error);
    res.json({
      status: 'Error:' + error,
    });
  }
  }


  exports.activeaggregators = (req, res) => {
    try {
      let _result = [];
      myDatabase.createStatement()
        .then(statement => {
          return statement.executeQuery('SELECT DOMAIN FROM ' + usefRefererUpperDSO(req) + '.AGGREGATOR')
        })
        .then(resultSet => {
          const arrayOfResults = resultSet.fetchAllResults()
          arrayOfResults.forEach(result => {
            _result.push(result);
          })
          console.log(_result);
          res.json({
            status: 'success',
            body: _result,
          }
          )
        },
  
        )
  
    }
    catch{
      console.log(error);
      res.json({
        status: 'Error:' + error,
      });
    }
    }


    exports.flexofferRevoke = (req, res) => {

      
      let host_n=req.body[0].toString();
      let path_n='/'+ req.body[0].toString() +'_AGR/rest/FlexOfferRevocationEndpoint/revokeFlexOffer/'+ req.body[1].toString() + '/'+ req.body[2].toString() + '/'+ req.body[3].toString();
      console.log(host_n);
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
    
        // _req.write(JSON.stringify(req.body));
        _req.end();
        //console.log(_req.body.parameters);
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


    exports.getFlexRevoke = (req, res) => {
      try {
        let _result = [];
        myDatabase.createStatement()
          .then(statement => {
            return statement.executeQuery('SELECT XML FROM ' + usefRefererUpperDSO(req) + '.MESSAGE WHERE XML LIKE \'%FlexOfferRevocationResponse %\'')
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
  

    exports.getusefparameters = (req, res) => {
      let prop=req.body[0].toString();
      
      try {
        var para="";
        const options = {
          method: "GET",
          hostname: usefRefererDSOUrl(req),
          port: "8443",
          path: usefRefererDSO(req) + 'rest/Event/getProperty/' + prop,
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
            res.json({
              status: 'Success',
              data: body.toString()
            });
          });
        });
    
        // _req.write(JSON.stringify(req.body));
        _req.end();
        //console.log(_req.body.parameters);
        
      }
      catch (error) {
        console.log(error);
        res.json({
          status: 'Error:' + error,
        });
      }
    }


    exports.setusefparameters = (req, res) => {
      let prop=req.body[0].toString();
      let prop2=req.body[1].toString();
      try {
        var para="";
        const options = {
          method: "GET",
          hostname: usefRefererDSOUrl(req),
          port: "8443",
          path: usefRefererDSO(req) + 'rest/Event/setProperty/' + prop + '/' + prop2,
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
    
        // _req.write(JSON.stringify(req.body));
        _req.end();
        //console.log(_req.body.parameters);
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


    exports.getPlanboardFlexOffer = (req, res) => {
      try {
        let _result = [];
        myDatabase.createStatement()
          .then(statement => {
            return statement.executeQuery('SELECT * FROM ' + usefRefererUpperDSO(req) + '.PLAN_BOARD_MESSAGE WHERE DOCUMENT_TYPE=\'FLEX_OFFER\'')
          })
          .then(resultSet => {
            const arrayOfResults = resultSet.fetchAllResults()
            arrayOfResults.forEach(result => {
              _result.push(JSON.parse('{"sequence" : "'+result['SEQUENCE_NUMBER'] +'","document":"'+ result['DOCUMENT_STATUS']+'"}'));
    
    
            })
            console.log(_result);
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

