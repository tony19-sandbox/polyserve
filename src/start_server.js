/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var express = require('express');
var http = require('http');
var makeApp = require('./make_app');
var open = require('open');
var util = require('util');
var findPort = require('find-port');

function startWithPort(options) {

  options.port = options.port || 8080;

  console.log('Starting Polyserve on port ' + options.port);

  var app = express();
  var polyserve = makeApp(options.componentDir, options.packageName);

  app.use('/components/', polyserve);

  var server = http.createServer(app);

  server = app.listen(options.port);

  server.on('error', function(err) {
    if (err.code === 'EADDRINUSE')
      console.error("ERROR: Port in use", options.port, "Aborting!");
    process.exit(69);
  });

  var baseUrl = util.format('http://localhost:%d/components/%s/', options.port,
    polyserve.packageName);
  console.log('Files in this directory are available under ' + baseUrl);

  if (options.page) {
    open(
      baseUrl + (options.page === true ? 'index.html' : options.page),
      options.browser
    );
  }
}

function startServer(options) {
  if (!options.port) {
    findPort(8080, 8180, function(ports) {
      options.port = ports[0];
      startWithPort(options);
    });
  }
  else {
    startWithPort(options);
  }
}

module.exports = startServer;
