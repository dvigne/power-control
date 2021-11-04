<template>
  <div class="mx-auto w-full border-2 rounded-lg h-screen">
    <div class="bg-gray-300 w-full flex">
      <p class="flex-grow font-bold pt-2.5 pb-2.5 text-center text-2xl">Settings</p>
    </div>
    <div class="pt-2 flex justify-center">
      <div class="flex">
        <button v-bind:class="[series ? 'bg-green-500': 'bg-gray-300']" v-on:click="setTrack(1)" type="button" name="button" class="p-3 text-lg bg-gray-300 m-1 font-bold rounded">Series</button>
      </div>
      <div class="flex">
        <button v-bind:class="[parallel ? 'bg-green-500': 'bg-gray-300']" v-on:click="setTrack(2)" type="button" name="button" class="p-3 w-full text-lg bg-gray-300 m-1 font-bold rounded">Parallel</button>
      </div>
      <div class="flex">
        <button v-bind:class="[lock ? 'bg-green-500': 'bg-gray-300']" v-on:click="toggleLock" type="button" name="button" class="p-3 w-full text-lg bg-gray-300 m-1 font-bold rounded">Lock Display</button>
      </div>
    </div>
    <div class="w-9/12 mx-auto pt-5">
      <button v-bind:class="[CH1 ? 'bg-green-500': 'bg-gray-300']" v-on:click="togglePower('CH1'); CH1 = !CH1;" type="button" name="button" class="w-full p-4 mt-1 mb-1 font-bold rounded text-lg">CH1</button>
      <button v-bind:class="[CH2 ? 'bg-green-500': 'bg-gray-300']" v-on:click="togglePower('CH2'); CH2 = !CH2;" type="button" name="button" class="w-full p-4 mt-1 mb-1 font-bold rounded">CH2</button>
      <button v-bind:class="[CH3 ? 'bg-green-500': 'bg-gray-300']" v-on:click="togglePower('CH3'); CH3 = !CH3;" type="button" name="button" class="w-full p-4 mt-1 mb-1 font-bold rounded">CH3</button>
    </div>
  </div>
</template>

<script type="text/javascript">
  import EventBus from "./EventBus";

  export default {
    data: function() {
      return {
        CH1: false,
        CH2: false,
        CH3: false,
        track: 0,
        lock: false
      }
    },
    computed: {
      series: function() { return this.track == 1; },
      parallel: function() { return this.track == 2; }
    },
    methods: {
      togglePower: function(channel) {
        EventBus.$emit('toggle-power', channel);
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
