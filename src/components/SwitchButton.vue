<template>
  <div class="switchBtn fRow aStart jStart" v-bind:class="{load: load}">
    <div class="line"></div>
    <div v-bind:class="{active: this.val, deactive: !this.val, monocolor: this.monocolor}"
    class="handle aCenter jCenter fRow">{{computedLabel}}</div>
  </div>
</template>

<script>
export default {
  props: ['activeLabel', 'deactiveLabel', 'load', 'val', 'monocolor'],
  data() {
    return {
      label: '',
      enterValue: this.val,
    };
  },
  computed: {
    computedLabel() {
      let v = '';
      if (this.val) {
        v = this.activeLabel;
      } else {
        v = this.deactiveLabel;
      }
      return v;
    },
  },
};
</script>

<style lang='scss' scoped>
  .switchBtn{
    height: 24px;
    min-height: 24px;
    position: relative;
    min-width: 48px;
    position: relative;
    cursor: pointer;
    transition: all cubic-bezier(0.5, 0, 0, 1) 0.3s;
    transition: all cubic-bezier(0.5, 0, 0, 1) 0.3s;
  }

  .switchBtn .load {
    pointer-events: none;
    opacity: 0.2;
  }

  .switchBtn .line{
    height: 12px;
    position: absolute;
    left: 0;
    right: 0;
    top: 6px;
    border-radius: 64px;
    background-color: rgba($color: #000000, $alpha: 0.3);
    z-index: 10;
  }
  .switchBtn .handle{
    padding: 0 8px;
    font-size: 12px;
    font-weight: 300;
    position: relative;
    color: white;
    cursor: pointer;
    min-width: 48px;
    border-radius: 80px;
    height: 100%;
    z-index: 20;
    transition: all cubic-bezier(0.5, 0, 0, 1) 0.3s;
  }

  .active{
    background-color: rgb(51, 156, 51);
    margin: 0 8px 0 0;
  }

  .deactive{
    background-color: rgb(121, 121, 121);
    margin: 0 0 0 8px;
  }
  .monocolor {
    background-color: rgb(51, 156, 51) !important;
  }

</style>
