'use strict'

const debug = require('debug')('hbserver');
const http = require('http');
const https = require('https');

//const port = process.env.PORT || 8080;

const app = require('../app');

app.set('port', process.env.PORT || 3001);
app.set('httpsport', process.env.PORT || 3002);


//const httpServer = http.createServer(app);

https.createServer(options, app).listen(app.get('httpsport'), function(){
  console.log('Listen Https on port ' + app.get('httpsport'));
});

const server = app.listen(app.get('port'), function() {
  console.log('Express server is in '+process.env.NODE_ENV+' mode and listening on port ' + server.address().port);

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
