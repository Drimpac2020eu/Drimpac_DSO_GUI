'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const session = require('express-session');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(
  session({
    secret: 'dog vs cat',
    resave: true,
    saveUninitialized: false,
  })
);
const authApi = require('./routes/authAPI');
const drimpacApi = require('./routes/drimpacAPI');
const epe = require('./routes/epe.js')
//const epe = require('./routes/epe')
const unitManagementApi = require('./routes/unitManagementAPI');
const usefAPI = require('./routes/usefAPI');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})
  .options('*', function (req, res, next) {
    res.end();
  });
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(fileUpload({}));

/* DRIMPAC API */

app.post('/drimpac-aggregator/rest/api/v1/get_EPE', drimpacApi.getEPE);
//app.post('/drimpac-aggregator/rest/api/v1/get_profilePrices', drimpacApi.getProfilePrices);
app.post('/drimpac-aggregator/rest/api/v1/get_publish_message', drimpacApi.publishMessage);
//app.get('/drimpac-aggregator/rest/api/v1/get_subscribe_message', drimpacApi.subscribeMessage);
app.get('/drimpac-aggregator/rest/api/v1/get_PV_Data', drimpacApi.getPVData);
app.get('/drimpac-aggregator/rest/api/v1/get_available_services', drimpacApi.getAvailableServices);
app.get('/drimpac-aggregator/rest/api/v1/get_latest_pvw', drimpacApi.getPVData);
app.post('/drimpac-aggregator/rest/api/v1/publish_connections', drimpacApi.publishConnections);
app.get('/drimpac-aggregator/rest/api/v1/get_load_forecast', drimpacApi.getLoadForecast);
app.get('/drimpac-aggregator/rest/api/v1/get_asset_load_forecast', drimpacApi.getAssetLoadForecast);
app.get('/drimpac-aggregator/rest/api/v1/get_flexibility_offer', drimpacApi.getFlexibilityOffer);
app.get('/drimpac-aggregator/rest/api/v1/get_registered_connections', drimpacApi.getRegisteredConnections);
app.get('/drimpac-aggregator/rest/api/v1/get_latest_pvTimeseries', drimpacApi.getLatestPVTimeseries);
app.get('/drimpac-dso/rest/api/v1/getmessage', usefAPI.sendmessage);
app.post('/drimpac-dso/rest/api/v1/sendmessage', usefAPI.getmessage);
app.get('/drimpac-dso/rest/getCROs', usefAPI.getCROs);
app.get('/drimpac-dso/rest/getSynchronisationCongestionpoints', usefAPI.getSynchronisationCongestionpoints);
app.post('/drimpac-dso/rest/api/v1/xml_message', usefAPI.xmlMessage)
app.post('/drimpac-dso/rest/add_CRO', usefAPI.addCRO);
app.post('/drimpac-dso/rest/get_CRO', usefAPI.getCRO);
app.post('/drimpac-dso/rest/add_Congestion', usefAPI.addCongestion);
app.get('/drimpac-dso/rest/getPrognoses', usefAPI.getPrognoses);
app.get('/drimpac-dso/rest/getFlexOffer', usefAPI.getFlexOffer);
app.get('/drimpac-dso/rest/getConfigFile', usefAPI.getConfigFile);
app.get('/drimpac-dso/rest/commoneferenceupdate', usefAPI.commoneferenceupdate);
app.get('/drimpac-dso/rest/commoneferencequery', usefAPI.commoneferencequery);
app.get('/drimpac-dso/rest/connectionforecast', usefAPI.connectionforecast);
app.get('/drimpac-dso/rest/flexorder', usefAPI.flexorder);
app.get('/drimpac-dso/rest/activecongestions', usefAPI.activecongestions);
app.get('/drimpac-dso/rest/activeaggregators', usefAPI.activeaggregators);



/* AUTH API */

app.post('/drimpac/rest/api/v1/create_user', authApi.create_user);
app.post('/drimpac/rest/api/v1/update_user', authApi.update_user);
app.post('/drimpac/rest/api/v1/login_with_email_password', authApi.login_with_email_password);
app.post('/drimpac/rest/api/v1/logout', authApi.logout);
app.get('/drimpac/rest/api/v1/get_user_list', authApi.get_user_list);
app.post('/drimpac/rest/api/v1/remove_user', authApi.remove_user);
app.post('/drimpac/rest/api/v1/forgot', authApi.forgot);
app.post('/drimpac/rest/api/v1/reset', authApi.reset);
app.post('/drimpac/rest/api/v1/refresh', authApi.refresh);

app.post('/drimpac-dso/rest/add_device', unitManagementApi.addDevice);
app.get('/drimpac-dso/rest/get_devices', unitManagementApi.getDevices);
app.post('/drimpac-dso/rest/edit_device', unitManagementApi.editDevice);
app.post('/drimpac-dso/rest/delete_device', unitManagementApi.deleteDevice);
app.post('/drimpac-dso/rest/dsoPremises', unitManagementApi.dsoPremises);
app.get('/drimpac-dso/rest/getdsoPremises', unitManagementApi.getdsoPremises);
app.get('/drimpac-dso/rest/getDrmsCongestions', unitManagementApi.getDrmsCongestions);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
