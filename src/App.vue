<template>
  <div id="app" class="appHolder">
    <div class="header fCol jCenter aCenter">
      <h2>▬ chroma key remover ▬</h2>
      <p>Try to upload some videos</p>
    </div>
    <div class="formsHolder fCol jCenter aCenter fullWidth">
      <uploaders v-for="(item, index) in uploaderArray" v-bind:key="item.id"
        :id='`uploader${index}`' :uploaderId='index'
        :course='cName' :courseId='cId'
        @fileSelected='addNewUploader'/>
      <!-- <router-view /> -->
    </div>
  </div>
</template>

<script>
import Uploaders from '@/components/Uploaders.vue';

export default {
  data() {
    return {
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
      uploaderArray: ['1'],
      cName: 'videoUpload',
      cId: '608e3103b4683d088214078b',
    };
  },
  computed: {
    loading() {
      return this.$store.state.superLoading;
    },
  },
  components: {
    Uploaders,
  },
  watch: {
    loading() {
    },
  },
  methods: {
    addNewUploader() {
      // alert(event);
      this.isVideoUploading = true;
      this.uploaderCount += 1;
      this.uploaderArray.push(this.uploaderCount.toString());
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@keyframes l {
  0% {
    transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
    -moz-transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
    -ms-transform: rotate(-360deg);
    -o-transform: rotate(-360deg);
  }
}
.appHolder {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: white;
  overflow: auto;

  .header {
    padding: 24px;
    height: 264px;
    z-index: 100;
    h2 {
      font-size: 32px;
      font-weight: 500;
      margin: 0;
      padding: 0;
      margin-bottom: 8px;
    }
    p {
      margin: 0;
      padding: 0;
      font-size: 20px;
      font-weight: 200;
    }
  }

  .formsHolder {
    background-color: white;
    padding: 24px;
    overflow: hide auto;
  }

  .footer {
    padding: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    ul {
      padding: 0;
      margin: 0;
      li {
        list-style-type: none;
        width: 100%;
        text-align: left;
        h3, a {
          width: 100%;
        }
        h3 {
          font-size: 20px;
          font-weight: bold;
          padding: 0px 0px 0px 16px;
          border-left: solid 2px rgba($color: #fff, $alpha: 0.85);
          color: white;
        }
        a {
          text-decoration: none;
          font-size: 16px;
          font-weight: 300;
          padding: 4px 0px 4px 16px;
          transition: all ease-in-out 0.4s;
          border-left: solid 2px rgba($color: #fff, $alpha: 0.15);
          color: rgb(182, 182, 182);
        }
        a:hover {
          border-left: solid 2px rgba($color: #fff, $alpha: 0.45);
          color: white;
        }
      }
    }
  }

  .loading{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99999999999999999999;
  }

  .p{
    width: 24px;
    height: 24px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation: l linear 1s infinite;
  }

  .loading.hide{
    transform: translateY(-100%);
    -webkit-transform: translateY(-100%);
    -moz-transform: translateY(-100%);
    -o-transform: translateY(-100%);
    -ms-transform: translateY(-100%);
  }
}
</style>
