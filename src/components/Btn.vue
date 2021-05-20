<template>
  <div :title="this.label" class="Btn fRow jStart aCenter primary"
  v-bind:class="{fab: isFab, mini: isMini}"
  v-bind:style="{width: `${this.btnWidth}`, backgroundColor: `${this.bc}`}">
    <div class="btnEffect"></div>
    <i v-bind:class="{stepTwoIcon: stepCalculator}"
    class="itemIcon material-icons-round">{{ icon }}</i>
    <label v-if="!isFab" class="menuItem">{{ label }}</label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFab: this.fabBtn,
    };
  },
  props: ['label', 'icon', 'path', 'step', 'havePage', 'btnWidth', 'bc', 'fabBtn', 'isMini'],
  computed: {
    stepCalculator() {
      let st2 = false;
      if (this.step === '2') {
        // console.log(this.step);
        st2 = true;
      }
      return st2;
    },
    haveNoPage() {
      let hp = false;
      if (this.havePage === 'no') {
        // console.log(this.havePage);
        hp = true;
      }
      return hp;
    },
  },
};
</script>

<style lang="scss" scoped>
.rl label {
  color: rgb(0, 0, 0);
  flex-grow: 1;
  height: 56px;
  min-height: 56px;
  font-size: 14px;
  align-items: center;
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  padding: 0 24px;
}

.fab {
  width: 40px;
  max-width: 40px;
  min-width: 40px;
  border-radius: 50% !important;
  height: 40px;
  min-height: 40px;
  margin: 0 !important;
  justify-content: center !important;
}

.rl.twoStep label{
  padding: 0 24px;
  margin-right: 24px;
  border-right: dashed 2px #61187A;
}

.pointerEventNone{
  pointer-events: none;
}

.Btn {
  padding: 8px 16px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-image: url('../assets/btnback.svg');
  background-size: 0px 56px;
  background-repeat: repeat-x;
  cursor: pointer;
  margin: 0 8px 0 0;
  background-position: left center;
  transition: all cubic-bezier(0.5, 0, 0, 1) 0.5s;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.096);
}

.Btn.mini {
  padding: 4px 8px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-image: url('../assets/btnback.svg');
  background-size: 0px 56px;
  background-repeat: repeat-x;
  cursor: pointer;
  background-position: left center;
  transition: all cubic-bezier(0.5, 0, 0, 1) 0.5s;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.096);
}

.stepTwoIcon{
  color: #f0f0f050 !important;
}

.Btn .btnEffect{
    position: absolute;
    left: 28px;
    top: 50%;
    width: 0px;
    height: 0px;
    pointer-events: none;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: solid 0px rgba(255, 255, 255, 0.123);
    background-color: rgba(0, 0, 0, 0.096);
    transition: all cubic-bezier(0.5, 0, 0, 1) 0.8s;
}

.Btn:hover .btnEffect{
    width: 512px;
    height: 512px;
    border: solid 64px rgba(255, 255, 255, 0);
}

.Btn:active .btnEffect{
    width:  48px;
    height: 48px;
    border: solid 8px rgba(255, 255, 255, 0);
}

.fab .btnEffect {
    left: 20px;
}

.fab:hover .btnEffect {
    left: 20px;
}

.fab:active .btnEffect {
    border: solid 18px rgba(255, 255, 255, 0);
}

.Btn:hover {
  filter: brightness(110%);
  box-shadow: 0 16px 16px 0 rgba(0, 0, 0, 0.096);
  border-radius: 8px;
}

.Btn:active {
  filter: brightness(110%);
  box-shadow: 0 16px 16px 0 rgba(0, 0, 0, 0.226);
  border-radius: 8px;
}

.Btn .itemIcon {
  color: rgb(255, 255, 255);
  pointer-events: none;
}

.Btn.mini .itemIcon {
  color: rgb(255, 255, 255);
  font-size: 12px;
  pointer-events: none;
  margin: 0;
}

.Btn label{
  color: #ffffff;
  font-weight: 400;
  flex-grow: 1;
  margin-left: 8px;
  pointer-events: none;
}

.Btn.mini label{
  color: #ffffff;
  font-weight: 400;
  font-size: 12px;
  flex-grow: 1;
  margin-left: 8px;
  pointer-events: none;
}

</style>
