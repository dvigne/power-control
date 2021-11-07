const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("psu",
{
  connect: function(host, port) {
    return ipcRenderer.invoke('connect', [host, port]);
  },
  disconnect: function() {
    return ipcRenderer.invoke('disconnect');
  },
  systemInfo: function() {
    return ipcRenderer.sendSync('systemInfo');
  },
  setCurrentChannel: function(channel) {
    ipcRenderer.sendSync('setCurrentChannel', channel);
  },
  getCurrentChannel: function() {
    return ipcRenderer.sendSync('getCurrentChannel');
  },
  measureCurrent: function(channel) {
    return ipcRenderer.sendSync('measureCurrent', channel);
  },
  measureVoltage: function(channel) {
    return ipcRenderer.sendSync('measureVoltage', channel);
  },
  setCurrent: function(channel, current) {
    ipcRenderer.sendSync('setCurrent', [channel, current]);
  },
  getCurrent: function(channel) {
    return ipcRenderer.sendSync('getCurrent', channel);
  },
  setVoltage: function(channel, current) {
    ipcRenderer.sendSync('setVoltage', [channel, current]);
  },
  getVoltage: function(channel) {
    return ipcRenderer.sendSync('getVoltage', channel);
  },
  setOutput: function(channel, state) {
    ipcRenderer.sendSync('setOutput', [channel, state]);
  },
  setTrack: function(state) {
    ipcRenderer.sendSync('setTrack', state);
  },
  errors: function() {
    return ipcRenderer.sendSync('errors');
  },
  version: function() {
    return ipcRenderer.sendSync('version');
  },
  status: function() {
    return ipcRenderer.sendSync('status');
  },
  lock: function() {
    return ipcRenderer.sendSync('lock');
  },
  unlock: function() {
    return ipcRenderer.sendSync('unlock');
  }
});
