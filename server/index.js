var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var json1 = require('ot-json1');

var standardChart = JSON.stringify(require('./default-chart.vg.json'))

ShareDB.types.register(json1.type);
var backend = new ShareDB();
createDoc(createDoc2(startServer));

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'counter');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create(
        {
          type: "vega",
          spec: JSON.parse(standardChart),
        },
        json1.type.uri, callback,
      );
      return;
    }
    callback();
  });
}
function createDoc2(callback) {
  var connection = backend.connect();
  var doc = connection.get('fancy', '1');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create(
        {
          type: "fancy",
          spec: {
            width: 400,
            height: 400,
            data: [{
              _id: "d1",
              name: "Some test values",
              url: "http://localhost:8080/test1.csv",
              transforms: [],
            }, {
              _id: "d2",
              name: "hotel-5",
              url: "http://localhost:8080/hotel-5.csv",
              transforms: [{
                type: "toDate",
                field: "date",
                key: "date",
              }],
            }],
            transforms: [],
            charts: [{
              _id: "c1",
              name: "Pie chart",
              type: "pie",
              data: "d1",
              categories: "c",
              values: "a",
              width: 200,
              height: 200,
              x: 0,
              y: 0,
            }, {
              _id: "c2",
              name: "Bar chart",
              type: "bar",
              data: "d1",
              categories: "c",
              values: "b",
              labelAngle: 0,
              labelAlign: "center",
              width: 200,
              height: 200,
              x: 100,
              y: 100,
            }, {
              _id: "c3",
              name: "Line chart",
              type: "line",
              data: "d1",
              xField: "a",
              yField: "b",
              width: 200,
              height: 200,
              x: 200,
              y: 0,
            }],
          },
        },
        json1.type.uri, callback,
      );
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();

  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.use(express.static('public'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws) {
    console.log("CONNECTION")
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);

    

  });

  backend.use('connect', function(ctx, next) {
    console.log('connect');
    next();
  });
  backend.use('receive', function(ctx, next) {
    console.log('receive');
    next();
  });
  backend.use('reply', function(ctx, next) {
    console.log('reply');
    next();
  });
  backend.use('receivePresence', function(ctx, next) {
    console.log('receivePresence');
    next();
  });
  backend.use('sendPresence', function(ctx, next) {
    console.log('sendPresence');
    next();
  });
  backend.use('query', function(ctx, next) {
    console.log('query');
    next();
  });
  backend.use('readSnapshots', function(ctx, next) {
    console.log('readSnapshots');
    next();
  });
  backend.use('op', function(ctx, next) {
    console.log('op');
    next();
  });

  backend.use('submit', function(ctx, next) {
    console.log('submit', ctx, ctx.op.op);
    setTimeout(next, 100);
  });
  backend.use('apply', function(ctx, next) {
    console.log('apply');
    next();
  });
  backend.use('commit', function(ctx, next) {
    console.log('commit', ctx.snapshot);
    next();
  });
  backend.use('afterWrite', function(ctx, next) {
    console.log('afterWrite');
    next();
  });

  server.listen(8080);
  console.log('Listening on http://localhost:8080');
}
