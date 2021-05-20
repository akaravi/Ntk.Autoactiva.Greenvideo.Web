export default {
  methods: {
    makeToast(toastType, toastMsg, d) {
      this.$store.commit('makeToast', { type: toastType, msg: toastMsg, duration: d });
    },
  },
};
