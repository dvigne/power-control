const { ipcMain } = require('electron');
const net = require('net')

/*
*IDN? - Get system information
INSTrument {CH1|CH2} - Select channel to be operated
INSTrument ? - Get currently operating channel
MEASure:CURRent? <CH1|CH2> - Retrieve current level on channel
MEAsure:VOLTage? <CH1|CH2> - Retrieve voltage level on channel
[SOURce:]CURRent <current> - Set current on operating channel
[SOURce(<CH1|CH2>):]CURRent? - Get current output on channel
[SOURce:]VOLTage <volt> - Set voltage on operating channel
[SOURce(<CH1|CH2>):]VOLTage?- Get current voltage output on operating channel
OUTPut <source>,<state - Set source (CH1, CH2, Ch3) to state (ON, OFF)
OUTPut:TRACk <NR1> - Set track operation (0 = independant, 1 = series, 2 = parallel)
SYSTem:ERRor? - Get system errors
SYSTem:VERSion? - Get software version
SYSTem: STATus? - Get system status
*/

let client;

function handleData(cb) {
  client.once('data', cb);
}

ipcMain.handle('connect', async function(event, args) {
  console.log(`Connecting to: ${args[1]} on port ${args[0]}`);;
  client = new net.Socket();
  client.setTimeout(5000);
  let result = new Promise((resolve,reject) => {
    client.on('error', function(error) {
      reject(error);
    });
    client.on('timeout', function() {
      reject("Connection Timeout");
    });
    client.on('ready', function() {
      console.log("Connection Success!");
      resolve();
    });
  });
  client.connect(args[0], args[1]);
  return await result;
});

ipcMain.handle('disconnect', async function(event, args) {
  console.log("Disconnecting");
  let result = new Promise((resolve, rejected) => {
    client.on('close', function(success) {
      resolve(success);
    });
  });
  client.destroy();
  return await result;
});

ipcMain.on('systemInfo', function(event, args) {
  console.log("Fetching System Info");
  client.write("*IDN?", function() {
    handleData(function(data) {
      console.log(data);
      event.returnValue = data.toString();
    })
  })
});

ipcMain.on('setCurrentChannel', function(event, args) {
  client.write(`INST ${args}`, function() {
    event.returnValue = null;
  });
});

ipcMain.on('getCurrentChannel', function(event, args) {
  client.write(`INST?`, function() {
    handleData(function(response) {
      event.returnValue = response.toString();
    });
  });
});

ipcMain.on('measureCurrent', function(event, args) {
  client.write(`MEAS:CURR? ${args}`, function() {
    handleData(function(response) {
      event.returnValue = parseFloat(response);
    });
  });
});

ipcMain.on('measureVoltage', function(event, args) {
  client.write(`MEAS:VOLT? ${args}`, function() {
    handleData(function(response) {
      event.returnValue = parseFloat(response);
    });
  });
});

ipcMain.on('setCurrent', function(event, args) {
  client.write(`${args[0]}:CURR ${args[1]}`, function() {
    event.returnValue = null;
  });
});

ipcMain.on('getCurrent', function(event, args) {
  client.write(`${args}:CURR?`, function() {
    handleData(function(response) {
      event.returnValue = parseFloat(response);
    });
  });
});

ipcMain.on('setVoltage', function(event, args) {
  client.write(`${args[0]}:VOLT ${args[1]}`, function() {
    event.returnValue = null;
  });
});

ipcMain.on('getVoltage', function(event, args) {
  client.write(`${args}:VOLT?`, function() {
    handleData(function(response) {
      event.returnValue = parseFloat(response);
    });
  });
});

ipcMain.on('setOutput', function(event, args) {
  client.write(`OUTP ${args[0]},${args[1]}`, function() {
    event.returnValue = null;
  });
});

ipcMain.on('setTrack', function(event, args) {
  client.write(`OUTP:TRACK ${args}`, function() {
    event.returnValue = null;
  });
});

ipcMain.on('errors', function(event, args) {
  client.write("SYST:ERR?", function() {
    handleData(function(response) {
      event.returnValue = response.toString();
    });
  });
});

ipcMain.on('version', function(event, args) {
  client.write("SYST:VERS?", function() {
    handleData(function(response) {
      event.returnValue = response.toString();
    });
  });
});

ipcMain.on('status', function(event, args) {
  client.write("SYST:VERS?", function() {
    handleData(function(response) {
      event.returnValue = parseInt(response.toString(), 16);
    });
  });
});

ipcMain.on('lock', function(event, args) {
  client.write("*LOCK", function() {
    event.returnValue = null;
  });
});

ipcMain.on('unlock', function(event, args) {
  client.write("*UNLOCK", function() {
    event.returnValue = null;
  });
});
