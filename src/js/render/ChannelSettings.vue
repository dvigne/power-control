<template>
  <div v-bind:class="bordercolor" class="mx-auto w-full border-2 rounded-lg h-screen">
    <div v-bind:class="backgroundcolor" class="w-full flex">
      <button class="w-12 bg-black flex-initial h-8 rounded-lg text-white font-bold m-2"
              type="button"
              name="button">{{ active ? "ON" : "OFF" }}</button>
      <p class="flex-grow font-bold pt-2.5 text-center text-2xl">{{ channel }}</p>
      <p class="flex-shrink font-bold p-2.5 text-right text-2xl">CV</p>
    </div>
    <div v-bind:class="bordercolor" class="w-90 rounded-lg border-2 m-2 bg-black">
      <div class="flex">
        <p class="text-white text-5xl text-center font-bold flex-grow">
          <span v-html="toFixed(setVoltage)" contenteditable @blur="updateVoltage" @keydown.enter="exitEdit" /> V
        </p>
        <p class="text-white text-5xl text-center font-bold flex-grow">
          <span v-html="toFixed(setCurrent)" contenteditable @blur="updateCurrent" @keydown.enter="exitEdit" /> A
        </p>
      </div>
      <hr v-bind:class="bordercolor" class="w-90 m-2 rounded-lg border-t-2 bordercolor"/>
      <p class="w-full text-white text-4xl text-center font-bold">{{ toFixed(setPower) }} W</p>
    </div>
    <div v-bind:class="bordercolor" class="w-90 rounded-lg border-2 m-2 bg-black">
      <p class="w-full pr-4 text-white text-8xl text-right font-bold">{{ toFixed(outVoltage) }} V</p>
      <hr v-bind:class="bordercolor" class="w-90 m-2 rounded-lg border-t-2" />
      <p class="w-full pr-4 text-white text-8xl text-right font-bold">{{ toFixed(outCurrent) }} A</p>
      <hr v-bind:class="bordercolor" class="w-90 m-2 rounded-lg border-t-2" />
      <p class="w-full pr-4 text-white text-2xl text-right font-bold">{{ toFixed(outPower) }} W</p>
    </div>
  </div>
</template>

<script type="text/javascript">
  import EventBus from "./EventBus";

  window.psu.connect(5025, "192.168.3.33");
  export default {
    props: ['channel', 'bordercolor', 'backgroundcolor'],
    data: function() {
      return {
        setVoltage: window.psu.getVoltage(this.channel),
        // setVoltage: 0.0,
        setCurrent: window.psu.getCurrent(this.channel),
        // setCurrent: 0.0,
        outVoltage: 0.0,
        outCurrent: 0.0,
        outPower: 0.0,
        maxVoltage: 32,
        maxCurrent: 3.2,
        active: false,
      }
    },
    created: function() {
      EventBus.$on('toggle-power', this.togglePower)
    },
    computed: {
      setPower: function() { return this.setVoltage * this.setCurrent; }
    },
    methods: {
      toFixed: (x) => x.toFixed(2),
      updateVoltage: function(event) {
        var voltage = parseFloat(event.target.innerHTML);
        if (voltage >= 0 && voltage <= this.maxVoltage) {
          console.log("Voltage Updated to %f", this.setVoltage);
          this.setVoltage = voltage;
          window.psu.setVoltage(this.channel, this.setVoltage);
        }
        else {
          event.target.innerHTML = this.setCurrent;
        }
      },
      updateCurrent: function(event) {
        var current = parseFloat(event.target.innerHTML);
        if (current >= 0 && current <= this.maxCurrent) {
          console.log("Current Updated");
          this.setCurrent = current;
          window.psu.setCurrent(this.channel, this.setCurrent);
        }
        else {
          event.target.innerHTML = this.setCurrent;
        }
      },
      exitEdit: function(event) {
        event.target.blur();
      },
      togglePower: function(channel) {
        if (this.channel == channel) {
          this.active = !this.active;
          window.psu.setOutput(channel, this.active ? "ON" : "OFF");
        }
      }
    }
  }
</script>
