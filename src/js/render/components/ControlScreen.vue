<template>
  <div class="grid grid-cols-3 gap-4">
    <channelsettings
      v-on:toggle-power="togglePower($event)"
      :active="CH1"
      bordercolor="border-green-500"
      backgroundcolor="bg-green-500"
      channel="CH1">
    </channelsettings>
    <channelsettings
      v-on:toggle-power="togglePower($event)"
      :active="CH2"
      bordercolor="border-yellow-300"
      backgroundcolor="bg-yellow-300"
      channel="CH2">
    </channelsettings>
    <controlpanel
      @togglePower="togglePower"
      @setTrack="setTrack"
      @toggleLock="toggleLock"
      :CH1="CH1"
      :CH2="CH2"
      :CH3="CH3"
      :lock="lock"
      :track="track">
    </controlpanel>
  </div>
</template>

<script type="text/javascript">
  import  {status_flags, track_state} from "../types.js";
  import channelsettings from './ChannelSettings.vue'
  import controlpanel from './ControlPanel.vue'

  export default {
    components: {
      channelsettings,
      controlpanel
    },
    data: function() {
      return {
        CH1: 0.0,
        CH2: 0.0,
        CH3: 0.0,
        lock: false,
        track: 0.0
      }
    },
    created: function() {
      var currentStatus = window.psu.status();
      this.CH1 = (currentStatus & status_flags.CH1_STATE) == status_flags.CH1_STATE;
      this.CH2 = (currentStatus & status_flags.CH2_STATE) == status_flags.CH2_STATE;
      this.CH3 = (currentStatus & status_flags.CH3_STATE) == status_flags.CH3_STATE;
      switch (currentStatus & (status_flags.TRACK_STATE1 | status_flags.TRACK_STATE2)) {
        case track_state.PARALLEL:
          this.track = 2;
          break;
        case track_state.SERIES:
          this.track = 1;
          break;
        case track_state.INDEPENDANT:
          this.track = 0;
          break;
        default:
          this.track = 0;
          break;
      }
    },
    methods: {
      togglePower: function(channel) {
        switch (channel) {
          case "CH1":
            this.CH1 = !this.CH1;
            window.psu.setOutput(channel, this.CH1 ? "ON" : "OFF");
            break;
          case "CH2":
            this.CH2 = !this.CH2;
            window.psu.setOutput(channel, this.CH2 ? "ON" : "OFF");
            break;
          case "CH3":
            this.CH3 = !this.CH3;
            window.psu.setOutput(channel, this.CH3 ? "ON" : "OFF");
            break;
          default:
            console.log("Unknown Channel Recieved...skipping");
        }
      },
      setTrack: function(track) {
        if(this.track == track) {
          window.psu.setTrack(0);
          this.track = 0;
        }
        else{
          window.psu.setTrack(track);
          this.track = track;
        }
      },
      toggleLock: function() {
        this.lock ? window.psu.unlock() : window.psu.lock();
        this.lock = !this.lock;
      }
    }
  }
</script>
