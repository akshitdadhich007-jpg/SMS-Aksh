const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'diagnostic.log');

function log(message) {
  fs.appendFileSync(logPath, message + '\n');
}

log('Starting diagnostic...');

try {
  log('Checking node version: ' + process.version);
  
  log('Requiring express...');
  const express = require('express');
  log('Express loaded.');
  
  const app = express();
  const PORT = 3000;
  
  const server = app.listen(PORT, () => {
    log('Server successfully bound to port ' + PORT);
    server.close();
    log('Server closed successfully.');
  });
  
  server.on('error', (err) => {
    log('Server error: ' + err.message);
  });

} catch (err) {
  log('CRITICAL ERROR: ' + err.message);
  log(err.stack);
}
