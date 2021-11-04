import Vue from 'vue'

import channelsettings from './ChannelSettings.vue'
import controlpanel from './ControlPanel.vue'

var app = new Vue({
  el: '#power-control',
  components: {
    channelsettings,
    controlpanel
  }
});
