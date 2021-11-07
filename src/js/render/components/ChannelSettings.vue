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
          <span contenteditable @blur="updateVoltage" @keydown.enter="exitEdit">{{ setVoltage | toFixed}}</span> V
        </p>
        <p class="text-white text-5xl text-center font-bold flex-grow">
          <span contenteditable @blur="updateCurrent" @keydown.enter="exitEdit">{{ setCurrent | toFixed}}</span> A
        </p>
      </div>
      <hr v-bind:class="bordercolor" class="w-90 m-2 rounded-lg border-t-2 bordercolor"/>
      <p class="w-full text-white text-4xl text-center font-bold">{{ setPower | toFixed }} W</p>
    </div>
    <div v-bind:class="bordercolor" class="w-90 rounded-lg border-2 m-2 bg-black">
      <p class="w-full pr-4 text-white text-7xl text-right font-bold">{{ outVoltage | toFixed }} V</p>
      <hr v-bind:class="bordercolor" class="w-90 m-2 rounded-lg border-t-2" />
      <p class="w-full pr-4 text-white text-7xl text-right font-bold">{{ outCurrent | toFixed }} A</p>
      <hr v-bind:class="bordercolor" class="w-90 m-2 rounded-lg border-t-2" />
      <p class="w-full pr-4 text-white text-2xl text-right font-bold">{{ outPower | toFixed }} W</p>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: ['channel', 'bordercolor', 'backgroundcolor', 'active'],
    data: function() {
      return {
        setVoltage: window.psu.getVoltage(this.channel),
        setCurrent: window.psu.getCurrent(this.channel),
        outVoltage: 0.0,
        outCurrent: 0.0,
        maxVoltage: 32,
        maxCurrent: 3.2,
        pollSupply : null
      }
    },
    filters: {
      toFixed: (num) => num.toFixed(2)
    },
    created: function() {
      this.updateOutputs();
    },
    beforeDestroy: function() {
      clearInterval(this.pollSupply);
    },
    computed: {
      setPower: function() { return this.setVoltage * this.setCurrent; },
      outPower: function() { return this.outVoltage * this.outCurrent; }
    },
    methods: {
      updateOutputs: function() {
        this.pollSupply = setInterval(() => {
          this.outVoltage = window.psu.measureVoltage(this.channel);
          this.outCurrent = window.psu.measureCurrent(this.channel);
        }, 1000);
      },
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
    }
  }
</script>
