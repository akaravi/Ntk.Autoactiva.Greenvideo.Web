<template>
  <div v-bind:class="{done: this.videoSaved}" v-if="!this.killUploader"
    class="videoUploaderHolder fCol jCenter aStart">
    <input type="file" name="video" ref="video"
      accept="video/mp4, video/webm" @change="showForm">
      <!-- <input type="text" v-model="test">
      <label>{{this.makeMD5()}}</label> -->
    <div class="compPreloadHolder fCol jCenter aCenter fullWidth transition-fast"
      v-if="!this.isFileSelected" @click="selectFile">
      <i class="material-icons-round">add</i>
      <div class="clickToAdd fullWidth">Click to add and upload a new video</div>
    </div>
    <div class="videoPreview fCol jStart aStart" v-if="this.isFileSelected">
      <div class="videoBox">
        <video controls ref="preview">
          <source src="" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="uploadStates fCol jCenter aCenter" v-if="this.uploadStarted">
          <span>uploading / {{this.progress}}%</span>
          <!-- progress bar ↓ -->
          <div class="pbarHolder fullWidth">
            <div class="pbar">
              <div class="bar transition-medium" v-bind:style="{width: `${this.progress}%`}"></div>
            </div>
          </div>
          <span>{{(this.progress * this.vSize / 100).toFixed(2)}}MB / {{this.vSize}}MB</span>
        </div>
        <div class="uploadStates fCol jCenter aCenter"
          v-if="this.uploadFinished">
          <i class="material-icons-round doneAll">done_all</i>
          <span>Upload completed!<br>You can download your video below</span>
        </div>
      </div>
      <div class="fRow jStart aCenter fullWidth">
        <div class="vidInfoBlock fRow jCenter aCenter">
          <i class="material-icons-round">timelapse</i>
          <!-- eslint-disable-next-line -->
          <div class="v ltr">{{this.vDuration.full}}"</div>
        </div>
        <div class="vidInfoBlock fRow jCenter aCenter">
          <i class="material-icons-round">insert_drive_file</i>
          <div class="v">{{this.vSize}}MB</div>
        </div>
        <div class="vidInfoBlock fRow jCenter aCenter">
          <i class="material-icons-round">straighten</i>
          <div class="v">{{this.vWidth}}px × {{this.vHeight}}px</div>
        </div>
      </div>
    </div>
    <div class="videoForm fCol jStart aStart fullWidth"
      v-if="this.isFileSelected">
      <div class="inputWrapper fCol aStart jStart fullWidth" v-if="false">
        <inp len='150' min='16' inputType='text' place='Video title'
          v-if="false"
          :initData='this.videoTitle.data' req='true' validation='videoTitle'
          @vmodel='getFromInput($event, "videoTitle")'
          icon='account_circle' label='Video title' />
        <span class="fRow jStart aCenter fullWidth">
          <i class="material-icons-round">text_snippet</i>
          Enter video title
        </span>
        <input type="text" v-model="videoTitle" class="fullWidth">
      </div>
      <div class="fRow fullWidth jBetween aCenter" v-if="false">
        <div class="inputWrapper fCol aCenter jStart w33">
          <span class="switchHead">وضعیت کلی</span>
          <switch-button activeLabel="فعال" deactiveLabel="غیرفعال"
            :val="this.statusSwitch" @click.native="toggleValue('status')" />
        </div>
        <div class="inputWrapper fCol aCenter jStart w33">
          <span class="switchHead">ویدئو رایگان است؟</span>
          <switch-button activeLabel="رایگان" deactiveLabel="رایگان"
            :val="this.stateSwitch" @click.native="toggleValue('state')" />
        </div>
        <div class="inputWrapper fCol aCenter jStart w33">
          <span class="switchHead">ویدئو دمو است؟</span>
          <switch-button activeLabel="دمو" deactiveLabel="دمو"
            :val="this.isPreviewSwitch" @click.native="toggleValue('preview')" />
        </div>
      </div>
      <div class="btns fRow jStart aCenter fullWidth">
        <keep-alive>
          <div class="growFull fRow jEnd aCenter"
            v-if="this.uploadStoped && !this.uploadFinished">
            <btn label='Start Upload' icon='publish'
              class="fullWidth" @click.native="startUpload"/>
          </div>
        </keep-alive>
        <keep-alive>
          <div class="growFull fRow jEnd aCenter"
            v-if="uploading && !uploadPaused && isChunk">
            <btn label='Pause' icon='pause' bc='#9a9a9a'
              class="fullWidth" @click.native="pauseUpload"/>
          </div>
        </keep-alive>
        <keep-alive>
          <div class="growFull fRow jEnd aCenter"
            v-if="uploading && uploadPaused && isChunk">
            <btn label='Resume' icon='play_arrow'
              class="fullWidth" @click.native="resumeUpload"/>
          </div>
        </keep-alive>
        <keep-alive>
          <div class="growFull fRow jCenter aCenter" v-if="saveVideo">
            <a :href="`${baseURL}/videos/${videoSrc}`" class="get fRow jCenter aCenter">
              <i class="material-icons-round" style="margin-right: 8px">get_app</i>
              Download your video
            </a>
          </div>
        </keep-alive>
        <keep-alive>
          <btn isMini='false' label='Choose another video' icon='loop'
            @click.native="selectFile" v-if="uploadStoped && !uploadFinished" />
        </keep-alive>
        <keep-alive>
          <btn label='Stop' icon='stop' bc='#df3528'
            @click.native="stopUpload"  v-if="uploading" />
        </keep-alive>
      </div>
    </div>
    <div class="mainStateHolder fCol jCenter aCenter"
      v-if="this.uploaderModal" @click="handleDismiss">
      <div class="loading" v-if="this.mainLoad"></div>
      <div class="msgBox fCol jCenter aCenter videoSaved" v-if="this.videoSaved">
        <i class="material-icons-round green">cloud_done</i>
        <label class="tip big">ویدئوی «{{this.videoTitle.data}}»</label>
        <label class="tip">با موفقیت به «{{this.course}}» اضافه شد</label>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SparkMD5 from 'spark-md5';
import Inp from '@/components/Inp.vue';
import SwitchButton from '@/components/SwitchButton.vue';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';
import Btn from '@/components/Btn.vue';

export default {
  name: 'uploader',
  mixins: [makeToast, errorHandler],
  props: ['uploaderId', 'course', 'courseId'],
  data() {
    return {
      videoTitle: '',
      stateSwitch: false,
      statusSwitch: true,
      isPreviewSwitch: false,
      videoSrc: '',
      // handle ↓
      closeUploader: false,
      isChunk: false,
      firstSelect: true,
      isFileSelected: false,
      uploadStarted: false,
      uploading: false,
      uploadPaused: false,
      uploadStoped: true,
      uploadFinished: false,
      videoSaved: false,
      videoNotSaved: false,
      mainLoad: false,
      uploaderModal: false,
      killUploader: false,
      // video
      file: [],
      test: 'test test test',
      totalFileCheckSum: '',
      uploadId: '',
      chunks: [],
      chunkSize: 1024000,
      sequenceNumber: 1,
      az: 0,
      ta: 0,
      totalPartNumber: 0,
      chunkProgress: 0,
      partCheckSum: '',
      uploaded: 0,
      vSize: 0,
      vExt: '',
      vWidth: 0,
      vHeight: 0,
      vDuration: {
        h: 0,
        m: 0,
        s: 0,
        full: '',
      },
      // upload states
      request: null,
      cancelToken: null,
      progress: 0,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
      lastFile: null,
    };
  },
  methods: {
    getVideo() {

    },
    toggleValue(val) {
      switch (val) {
        case 'status': {
          this.statusSwitch = !this.statusSwitch;
          break;
        }
        case 'state': {
          this.stateSwitch = !this.stateSwitch;
          break;
        }
        case 'preview': {
          this.isPreviewSwitch = !this.isPreviewSwitch;
          break;
        }
        default:
          break;
      }
    },
    getFromInput(event, inp) {
      switch (inp) {
        case 'videoTitle': {
          this.videoTitle = event;
          break;
        }
        default:
          break;
      }
    },
    selectFile() {
      this.$refs.video.click();
    },
    showForm() {
      this.uploaderModal = true;
      this.mainLoad = true;
      // eslint-disable-next-line
      if (this.$refs.video.files.length === 0) {
        this.isFileSelected = false;
        this.uploaderModal = false;
        this.mainLoad = false;
      } else if (this.$refs.video.files[0].type !== 'video/mp4' && this.$refs.video.files[0].type !== 'video/webm') {
        this.isFileSelected = false;
        this.uploaderModal = false;
        this.mainLoad = false;
        this.makeToast('warning', 'فقط فرمت های Mp4 و webM مجاز هستند.', 5000);
      } else if (((this.$refs.video.files[0].size / 1024) / 1024) > 500) {
        this.isFileSelected = false;
        this.uploaderModal = false;
        this.mainLoad = false;
        this.makeToast('warning', 'حجم فایل انتخابی نباید بیشتر از 500 مگابایت باشد', 5000);
      } else {
        this.isFileSelected = true;
        if (this.firstSelect) {
          this.$emit('fileSelected', this.uploaderId);
          this.firstSelect = false;
        }
        this.progress = 0;
        this.uploadStarted = false;
        // make preview before upload
        const URL = window.URL || window.webkitURL;
        const file = this.$refs.video.files[0];
        [this.file] = [this.$refs.video.files[0]];
        // const aa = this.file.slice(0, 1024000, 'video/mp4');
        // const bb = this.file.slice(10240000, 1024000 * 2, 'video/mp4');
        // blobCompare.isEqual(aa, bb).then((res) => {
        //   alert(res);
        // });
        this.vSize = (file.size / 1024) / 1024;
        if (this.vSize > 0.1) {
          // alert('boro too chunk');
          // چانک آپلود
          this.isChunk = true;
        } else {
          this.isChunk = false;
        }
        this.vSize = this.vSize.toFixed(2);
        // ازینجا
        const fileURL = URL.createObjectURL(file);
        setTimeout(() => {
          this.$refs.preview.src = fileURL;
          setTimeout(() => {
            this.vWidth = this.$refs.preview.videoWidth;
            this.vHeight = this.$refs.preview.videoHeight;
            const d = Math.floor(this.$refs.preview.duration).toFixed(0);
            if (d < 60) {
              this.vDuration.h = 0;
              this.vDuration.m = 0;
              this.vDuration.s = d;
              let ss = d.toString();
              if (d < 10) {
                ss = `0${d}`;
              }
              this.vDuration.full = `00:00:${ss}`;
            } else if (d >= 60 && d < 3600) {
              this.vDuration.h = 0;
              this.vDuration.m = Math.floor(d / 60).toFixed(0);
              this.vDuration.s = Math.floor(d % 60).toFixed(0);
              let mm = this.vDuration.m.toString();
              if (this.vDuration.m < 10) {
                mm = `0${this.vDuration.m}`;
              }
              let s = this.vDuration.s.toString();
              if (this.vDuration.s < 10) {
                s = `0${this.vDuration.s}`;
              }
              this.vDuration.full = `00:${mm}:${s}`;
            } else {
              this.vDuration.h = Math.floor(d / 3600).toFixed(0);
              const temp = Math.floor(d % 3600).toFixed(0);
              this.vDuration.m = Math.floor(temp / 60).toFixed(0);
              this.vDuration.s = Math.floor(temp % 60).toFixed(0);
              let mm = this.vDuration.m.toString();
              if (this.vDuration.m < 10) {
                mm = `0${this.vDuration.m}`;
              }
              let s = this.vDuration.s.toString();
              if (this.vDuration.s < 10) {
                s = `0${this.vDuration.s}`;
              }
              this.vDuration.full = `00:${mm}:${s}`;
            }
            this.uploaderModal = false;
            this.mainLoad = false;
          }, 500);
        }, 100);
      }
    },
    // 1st
    startUpload() {
      this.uploadVideo();
    },
    // 2st
    uploadVideo() {
      switch (this.isChunk) {
        case true: {
          // 3St
          this.makeTotalCheckSum();
          break;
        }
        case false: {
          const formData = new FormData();
          formData.append('files', this.file);
          this.cancelToken = axios.CancelToken;
          this.request = this.cancelToken.source();
          const a = axios({
            method: 'post',
            url: `${this.baseURL}/api/v${this.V}/Uploads/video?CourseId=${this.courseId}`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            cancelToken: this.request.token,
            onUploadProgress: (progressEvent) => {
              // eslint-disable-next-line
              this.progress = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100), 10);
            },
          }).then((response) => {
            this.uploading = false;
            if (response.data.isSuccess) {
              this.videoSrc = response.data.data;
              this.progress = 100;
            } else {
              this.makeToast('info', 'خطا در آپلود تصویر', 2000);
            }
          }, (error) => {
            this.makeToast('error', this.errorHandler(error), 3000);
          });
          a.catch(() => {
            this.makeToast('info', 'آپلود ویدئو متوقف شد', 4000);
          });
          break;
        }
        default:
          break;
      }
    },
    // 3st
    makeTotalCheckSum() {
      (async () => {
        // eslint-disable-next-line
        const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        const [file] = [this.file];
        const vm = this;
        // Read in chunks of 2MB ↓
        const chunkSize = 2097152;
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const spark = new SparkMD5.ArrayBuffer();
        // console.log('████', spark);
        const fileReader = new FileReader();
        function loadNext() {
          const start = currentChunk * chunkSize;
          const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        fileReader.onload = await function (e) {
          // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
          // Append array buffer ↓
          spark.append(e.target.result);
          currentChunk += 1;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            vm.totalFileCheckSum = spark.end();
            // console.log('finished loading');
            // Compute hash ↓
            // console.info('computed hash', spark.end());
            // alert(spark.end());
            // for test
          }
        };
        fileReader.onerror = function () {
          // console.warn('oops, something went wrong.');
        };
        loadNext();
      })();
    },
    // 4st
    uploadInit() {
      axios({
        method: 'get',
        headers: {
        },
        url: `${this.baseURL}/api/Uploads?CheckSum=${this.totalFileCheckSum}`,
      }).then((response) => {
        if (response.data.isSuccess) {
          this.uploadId = response.data.data;
          if (!response.data.isSuccess) {
            this.makeToast('warning', 'Something wrong', 2000);
            this.videoSrc = response.data.data;
            this.progress = 100;
          } else {
            this.videoSrc = response.data.data;
            this.$refs.preview.pause();
            this.uploadStarted = true;
            this.uploadStoped = false;
            this.uploadPaused = false;
            this.uploading = true;
            this.uploadFinished = false;
            this.uploadChunk();
          }
          // console.log(response.data.data);
        } else {
          this.makeToast('warning', 'خطا در ثبت ویدئو', 2000);
        }
      }, (error) => {
        this.makeToast('error', this.errorHandler(error), 3000);
      });
    },
    // 5st
    uploadChunk() {
      this.totalPartNumber = Math.ceil(this.file.size / this.chunkSize);
      // eslint-disable-next-line
      this.progress = (((this.sequenceNumber) / this.totalPartNumber) * 100).toFixed(0);
      this.vExt = this.file.type.split('/').pop();
      this.az = ((this.sequenceNumber - 1) * this.chunkSize);
      if (this.sequenceNumber === this.totalPartNumber) {
        this.chunkSize = this.file.size % this.chunkSize;
      }
      this.ta = this.az + this.chunkSize;
      this.uploadPart();
    },
    // 6st ↓
    uploadPart() {
      (async () => {
        const [file] = [this.file];
        const sliced = this.file.slice(this.az, this.ta, file.type);
        this.lastFile = sliced;
        // const arrayBuffer = await sliced.arrayBuffer();
        // console.log('------*****------', arrayBuffer.byteLength);
        // const chars = new Uint8Array(arrayBuffer);
        // eslint-disable-next-line
        // const hash = this.CryptoJS.MD5(this.CryptoJS.enc.Utf8.stringify(chars));
        // const md5 = hash.toString(this.CryptoJS.enc.Hex);
        const vm = this;
        const reader = new FileReader();
        let hash = '';
        reader.readAsBinaryString(file);
        reader.onloadend = function () {
          hash = vm.$CryptoJS.MD5(reader.result).toString();
          vm.partCheckSum = hash;
          vm.uploadChunkPart(sliced);
        };
      })();
    },
    // 7st
    uploadChunkPart(part) {
      const formData = new FormData();
      formData.append('files', part);
      this.cancelToken = axios.CancelToken;
      this.request = this.cancelToken.source();
      if (true) {
        axios({
          method: 'post',
          url: `${this.baseURL}/api/Uploads`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            UploadId: this.uploadId,
            PartSize: this.chunkSize,
            SequenceNumber: this.sequenceNumber,
            TotalPartNumber: this.totalPartNumber,
          },
          cancelToken: this.request.token,
        }).then((response) => {
          this.uploading = false;
          if (response.data.isSuccess) {
            if (this.sequenceNumber < this.totalPartNumber) {
              this.sequenceNumber += 1;
            } else {
              this.completeUpload();
            }
          } else {
            this.makeToast('info', 'خطا در آپلود تصویر', 2000);
          }
        }, (error) => {
          this.makeToast('error', this.errorHandler(error), 3000);
        }).catch(() => {
          this.makeToast('info', 'آپلود ویدئو متوقف شد', 4000);
        });
      }
    },
    pauseUpload() {
      this.uploadStarted = true;
      this.uploadStoped = false;
      this.uploadPaused = true;
      this.uploading = true;
    },
    resumeUpload() {
      this.uploadStarted = true;
      this.uploadStoped = false;
      this.uploadPaused = false;
      this.uploading = true;
    },
    stopUpload() {
      this.request.cancel();
      // this.request = null;
      this.uploadStarted = false;
      this.uploadStoped = true;
      this.uploadPaused = false;
      this.uploading = false;
      this.progress = 0;
    },
    makeMD5() {
      return this.CryptoJS.MD5(this.test).toString();
    },
    completeUpload() {
      const b = axios({
        method: 'get',
        url: `${this.baseURL}/api/Uploads/compelete`,
        headers: {
          'Content-Type': 'multipart/form-data',
          UploadId: this.uploadId,
          FileExt: `.${this.vExt}`,
          CheckSum: this.totalFileCheckSum,
          TotalPartNumber: this.totalPartNumber,
        },
        cancelToken: this.request.token,
        // onUploadProgress: (progressEvent) => {
        // eslint-disable-next-line
        // this.progress = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100), 10);
        // console.log(this.progress);
        // },
      }).then((response) => {
        this.uploading = false;
        if (response.data.isSuccess) {
          this.videoSrc = response.data.data;
        } else {
          this.makeToast('info', 'خطا در آپلود', 2000);
        }
      }, (error) => {
        this.makeToast('error', this.errorHandler(error), 3000);
      });
      b.catch(() => {
        this.makeToast('info', 'آپلود ویدئو متوقف شد', 4000);
      });
    },
    createChunks() {
      const [f] = [this.file];
      // const myBlob = new Blob(f.slice, { type: 'video/mp4' });
      // eslint-disable-next-line
      const myBlob = f.slice(this.sequenceNumber - 1, this.sequenceNumber - 1 + 1000, 'video/mp4');
      const myReader = new FileReader();
      myReader.onload = function d() {
        // console.log(myBlob);
        // console.log(JSON.stringify(myReader.result));
      };
      myReader.readAsArrayBuffer(myBlob);
    },
    videoFormValidation() {
      if (this.videoTitle.error || this.videoTitle.data === '') {
        this.makeToast('error', 'عنوان ویدئو را وارد کنید', 4000);
        return false;
      }
      return true;
    },
    createNewVideo() {
      // alert(this.vDuration.full);
      if (this.videoFormValidation()) {
        this.uploaderModal = true;
        this.mainLoad = true;
        let tmpStatus = 0;
        if (this.statusSwitch) {
          tmpStatus = 1;
        } else {
          tmpStatus = 2;
        }
        let tmpState = 0;
        if (this.stateSwitch) {
          tmpState = 1;
        } else {
          tmpState = 2;
        }
        // console.log(this.courseId, this.videoTitle.data, this.vDuration.full);
        // console.log(this.videoSrc, this.isPreviewSwitch);
        // console.log(tmpState, tmpStatus);
        const ivideos = [
          {
            CourseId: this.courseId,
            Title: this.videoTitle.data,
            Duration: this.vDuration.full,
            MediaId: this.videoSrc,
            IsPreview: this.isPreviewSwitch,
            Status: tmpStatus,
            State: tmpState,
          },
        ];
        // console.log(JSON.parse(JSON.stringify(ivideos)));
        axios({
          method: 'post',
          url: `${this.baseURL}/api/v${this.V}/Videos`,
          headers: {
          },
          data: {
            videos: ivideos,
          },
        }).then((response) => {
          this.uploading = false;
          if (response.data.isSuccess) {
            this.mainLoad = false;
            this.videoSaved = true;
          } else {
            this.mainLoad = false;
            this.videoSaved = false;
            this.makeToast('warning', 'خطا در ثبت ویدئو', 2000);
          }
        }, (error) => {
          this.mainLoad = false;
          this.videoSaved = false;
          this.uploaderModal = false;
          this.makeToast('error', this.errorHandler(error), 3000);
        });
      }
    },
    closeThisUploader() {
      this.killUploader = true;
    },
    // sparkPartChecksum(part) {
    //   (async () => {
    //     // eslint-disable-next-line
    // const blobSlice = File.prototype.slice
    // || File.prototype.mozSlice
    // || File.prototype.webkitSlice;
    //     const file = part;
    //     const vm = this;
    //     // Read in chunks of 2MB ↓
    //     const chunkSize = 1024000;
    //     const chunks = Math.ceil(file.size / chunkSize);
    //     let currentChunk = 0;
    //     const spark = new SparkMD5.ArrayBuffer();
    //     const fileReader = new FileReader();
    //     function loadNext() {
    //       const start = currentChunk * chunkSize;
    //       const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
    //       fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    //     }
    //     fileReader.onload = await function (e) {
    //       // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    //       // Append array buffer ↓
    //       spark.append(e.target.result);
    //       currentChunk += 1;
    //       if (currentChunk < chunks) {
    //         loadNext();
    //       } else {
    //         vm.partCheckSum = spark.end();
    //         vm.uploadChunkPart(file);
    //       }
    //     };
    //     fileReader.onerror = function () {
    //     };
    //     loadNext();
    //   })();
    // },
    sparkPartChecksum(part) {
      (async () => {
        // eslint-disable-next-line
        const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        const file = part;
        const vm = this;
        // Read in chunks of 2MB ↓
        const chunkSize = 1024000;
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        // const spark = new SparkMD5.ArrayBuffer();
        // barresiiiiii
        const fileReader = new FileReader();
        fileReader.onload = await function () {
          // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
          // Append array buffer ↓
          const hash = vm.$CryptoJS.MD5(fileReader.result).toString();
          currentChunk += 1;
          if (currentChunk < chunks) {
            // loadNext();
          } else {
            vm.partCheckSum = hash;
            alert(vm.partCheckSum);
            vm.uploadChunkPart(file);
          }
        };
        fileReader.onerror = function () {
        };
      })();
    },
    handleDismiss() {
      if (this.videoSaved) {
        this.closeThisUploader();
      }
    },
  },
  computed: {
    videoLen() {
      return this.vDuration;
    },
    saveVideo() {
      let sv = false;
      if (this.progress > 99.999999) {
        // console.log(sv, this.progress);
        sv = true;
        return sv;
      }
      // console.log(sv, this.progress);
      return sv;
    },
    formData() {
      const formData = new FormData();
      formData.set('is_last', this.chunks.length === 1);
      formData.set('file', this.chunks[0], `${this.file.name}.part`);
      return formData;
    },
    config() {
      return {
        method: 'POST',
        data: this.formData,
        url: `${this.baseURL}/api/v${this.V}/Uploads/video?CourseId=${this.courseId}`,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        onUploadProgress: (event) => {
          this.uploaded += event.loaded;
        },
      };
    },
  },
  watch: {
    saveVideo() {
      // وقتی حالت اتمام آپلود اتفاق افتاد
      if (this.saveVideo) {
        // console.log('upload finished, now save video');
        this.uploadStarted = false;
        this.uploadStoped = true;
        this.uploadPaused = false;
        this.uploading = false;
        this.uploadFinished = true;
      }
    },
    sequenceNumber() {
      this.uploadChunk();
    },
    test() {
      this.makeMD5();
    },
    totalFileCheckSum() {
      this.uploadInit();
    },
  },
  components: {
    Inp,
    SwitchButton,
    Btn,
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.mainStateHolder{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba($color: #ffffff, $alpha: 1.0);
  z-index: 50000;
}

.mainStateHolder .loading{
  background-size: 100%;
  width: 56px;
  height: 56px;
  background-repeat: no-repeat;
  background-position: center;
}

.msgBox i{
  color: rgb(54, 54, 54);
  font-size: 64px;
  margin-bottom: 16px;
}

.msgBox i.green{
  color: rgb(84, 134, 61);
  font-size: 64px;
  margin-bottom: 16px;
}

.msgBox label.tip {
  font-size: 16px;
  font-weight: 100;
  word-spacing: -1px;
  color: #313131;
}

.msgBox label.tip.big {
  font-size: 22px;
  font-weight: 300;
  word-spacing: -2px;
  color: #464646;
  margin-bottom: 4px;
}
.doneAll{
  font-size: 64px !important;
  color: green !important;
}
.vidInfoBlock{
  padding: 4px 8px;
}
.vidInfoBlock i{
  font-size: 16px;
  color: rgb(110, 102, 117);
  margin-right: 8px;
}
.vidInfoBlock .v{
  font-size: 12px;
  font-weight: 500;
  color: rgb(141, 140, 141);
  text-align: left;
}
.videoForm {
  span {
    font-size: 14px;
  }
  i {
    font-size: 16px;
    margin-right: 8px;
  }
  .inputWrapper {
    input[type='text'] {
      padding: 8px;
      border-radius: 4px;
      outline: none;
      border: 0;
      margin-top: 8px;
      direction: ltr !important;
      background-color: rgba($color: #000000, $alpha: 0.15);
    }
  }
}
.v.ltr{
  direction: ltr !important;
}
.videoUploaderHolder{
  padding: 16px;
  margin: 24px;
  box-shadow: 0 16px 16px 0 rgba($color: #000000, $alpha: 0.15);
  background-color: white;
  margin-top: 0;
  border-radius: 28px 28px 8px 8px;
  position: relative;
  overflow: hidden;
  border: solid 1px rgba($color: #000000, $alpha: 0.15);
  transition: border ease-in-out 0.2s;
}

.videoUploaderHolder.done{
  min-height: 64px;
  height: 192px;
  border: solid 4px rgba($color: #42c954, $alpha: 1);
}

.videoUploaderHolder input[type='file']{
  display: none;
}

.compPreloadHolder{
  border-radius: 16px;
  height: 68px;
  cursor: pointer;
}
.compPreloadHolder:hover{
  background-color: rgba(0, 0, 0, 0.034);
}
.compPreloadHolder *{
  pointer-events: none;
}
.compPreloadHolder i{
  font-size: 64px;
  color: rgb(128, 128, 128);
}
.clickToAdd{
  text-align: center;
  font-size: 14px;
  color: rgb(128, 128, 128);
  word-spacing: -1px;
  font-weight: 100;
}

$vw: 30vw;
$vh: $vw * 0.5625;
$minvw: 400px;
$minvh: $minvw * 0.5625;
.videoBox{
  width: $vw;
  height: $vh;
  min-width: $minvw;
  min-height: $minvh;
  border-radius: 16px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.055);
  position: relative;
}

.videoBox video{
  z-index: 150;
  width: 100%;
  height: 100%;
}

.videoBox video:focus{
  outline: none;
  border: none;
}

.videoBox .uploadStates{
  position: absolute;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.836);
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
}
.uploadStates span{
  font-size: 12px;
  font-weight: 300;
  margin: 0;
  padding: 0;
  text-shadow: 0 2px 2px rgba($color: #000000, $alpha: 0.9);
  color: white;
}
.pbarHolder{
  padding: 12px;
}
.pbar{
  width: 100%;
  height: 4px;
  border-radius: 80px;
  position: relative;
  direction: ltr;
  background-color: rgba($color: #000000, $alpha: 0.3);
}
@keyframes barAnimation {
  0%{
    background-color: rgb(109, 196, 38);
  }
  100%{
    background-color: rgb(248, 197, 86);
  }
}
.bar{
  width: 50%;
  height: 200%;
  transform: translateY(-25%);
  padding: 4px;
  border-radius: 80px;
  transition: all cubic-bezier(0.5,0,0,0.5) 1s;
  animation: barAnimation 2s infinite alternate linear;
  box-shadow: 0 0 24px 0 rgba($color: #d0ff27, $alpha: 0.3);
}

.switchHead{
  font-size: 12px;
  margin: 16px 0 8px;
}

.btns{
  margin-top: 16px;
}

a.get {
  text-decoration: none;
  font-size: 17px;
  padding: 4px 16px;
  border-radius: 16px;
  color: #131313;
  background-color: rgba($color: #000000, $alpha: 0.25);
}
</style>
