<template>
  <div class="grid grid-cols-3 gap-4">
    <channelsettings v-on:toggle-power="togglePower($event)" bordercolor="border-green-500" backgroundcolor="bg-green-500" channel="CH1"></channelsettings>
    <channelsettings v-on:toggle-power="togglePower($event)" bordercolor="border-yellow-300" backgroundcolor="bg-yellow-300" channel="CH2"></channelsettings>
    <controlpanel></controlpanel>
  </div>
</template>

<script type="text/javascript">
  import channelsettings from './ChannelSettings.vue'
  import controlpanel from './ControlPanel.vue'

  export default {
    components: {
      channelsettings,
      controlpanel
    }
  }
</script>
