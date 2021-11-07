<template>
  <div class="w-9/12 mx-auto h-screen grid place-items-center">
    <div class="w-9/12 border-2 border-green-500 h-1/5 mx-auto rounded">
      <div class="w-auto rounded-br bg-green-500 absolute">
        <p class="text-black font-bold p-1 text-center text-sm">Connection Settings</p>
      </div>
      <div class="w-9/12 mx-auto grid place-items-center h-full">
        <div class="w-full">
          <label class="text-white font-bold pl-4 pr-4" for="address">IP Address</label>
          <input class="rounded p-1 w-48" type="text" name="address" placeholder="x.x.x.x" v-model.trim="ipaddr" />
          <label class="text-white font-bold pl-4 pr-4" for="address">Port</label>
          <input class="rounded p-1 w-16" type="number" name="port" v-model.number="port">
          <span class="text-red-600 font-bold" v-if="!$v.ipaddr.ipAddress">Must Be a valid IP Address</span>
        </div>
      </div>
      <button @click="close" class="pl-4 pr-4 pt-2 pb-2 mt-2 rounded bg-yellow-400 font-bold text-lg float-left hover:bg-yellow-500 transition duration-100" type="button" name="quit">Quit</button>
      <button @click="connect" :disabled="$v.$invalid" :class="[!$v.$invalid ? 'transition duration-100 hover:bg-green-600' : 'cursor-not-allowed']" class="pl-4 pr-4 pt-2 pb-2 mt-2 rounded bg-green-500 font-bold text-lg float-right disabled:opacity-50" type="button" name="connect">
        <svg v-if="connecting" class="animate-spin float-left ml-3 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else>Connect</span>
      </button>
    </div>
  </div>
</template>


<script type="text/javascript">
import { required, ipAddress } from 'vuelidate/lib/validators'

  export default {
    data: function() {
      return {
        ipaddr: '',
        port: 5025,
        connecting: false
      }
    },
    validations: {
      ipaddr: {
        required,
        ipAddress,
      }
    },
    methods: {
      close: function() {
        window.close();
      },
      connect: function() {
        this.connecting = true;
        window.psu.connect(this.port, this.ipaddr).then(() => {
            console.log("Connection Success");
            this.$router.push("/control");
          }).catch((error) => {
            this.connecting = false;
            console.log(`Could not open socket:\n\t${error}`);
            window.psu.disconnect().then((result) => {
              alert("Error Opening Connection...Please Try Again");
            });
          });
      }
    }
  }
</script>
