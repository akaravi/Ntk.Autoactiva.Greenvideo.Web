import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default {
  methods: {
    fpGenerator() {
      return (async () => {
        // We recommend to call `load` at application startup.
        const fpd = await FingerprintJS.load();
        const result = await fpd.get();
        this.$store.commit('setFingerPrint', result.visitorId);
        // console.log('fp is ', this.$store.state.fp);
      })();
    },
  },
};
