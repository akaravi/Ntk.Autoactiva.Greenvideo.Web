<template>
  <div class="fRow jStart aCenter fullWidth uploadItem" v-bind:class="{hide: uploaded}">
    <div class="fRow fullWidth jStart aCenter fileForm" v-if="!uploaded">
      <div class="ind">{{index}}</div>
      <div class="fCol jCenter aStart growFull fileInputHolder">
        <span>عنوان فایل را وارد کنید</span>
        <input type="text"
          v-model="fileTitle"
          class="fullWidth"
          placeholder="مثلاً: جزوه‌ی آموزش زبان فارسی">
        <input type="file" ref="file" @input="getFile"
          accept=".rar, .zip">
        <!-- btns -->
        <div class="fRow jStart aCenter fullWidth">
          <div class="b fRow jStart aCenter active"
            v-if="!selected"
            @click="selectFile">
            <i class="material-icons-round">attachment</i>
            <label>انتخاب فایل</label>
          </div>
          <div class="b fRow jStart aCenter f"
            v-if="selected"
            @click="selectFile">
            <i class="material-icons-round">edit</i>
          </div>
          <div class="fCol jCenter aStart fileInfoHolder growFull"
            v-if="selected">
            <span class="name">{{file.name}}</span>
            <span class="size">{{fileSize}}</span>
          </div>
        </div>
      </div>
      <div class="startUpload fCol jCenter aCenter"
        @click="startUpload"
        v-if="selected && !uploading && !uploaded">آپلود</div>
      <div class="startUpload fCol jCenter aCenter"
        @click="startUpload"
        v-if="uploaded">
        <i class="material-icons-round">done_all</i>
      </div>
      <radial-progress-bar :diameter="72"
        v-if="uploading"
        class="remainingTime"
        v-bind:style="{marginRight: '24px'}"
        :completed-steps="progress"
        startColor="#61187A"
        stopColor="#61187A"
        innerStrokeColor="rgba(0, 0, 0, 0.133)"
        :animateSpeed='100'
        :innerStrokeWidth="6"
        :strokeWidth="8"
        :total-steps="100">
        <div class="span prog">%{{progress}}</div>
      </radial-progress-bar>
    </div>
    <div class="fRow jStart aCenter fullWidth uploaded" v-if="uploaded">
      <i class="material-icons-round">done_all</i>
      <p class="growFull">فایل «{{fileTitle}}» با موفقیت آپلود شد</p>
      <div class="b fRow jStart aCenter">
        <i class="material-icons-round">delete</i>
        <label>حذف فایل</label>
      </div>
    </div>
  </div>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress';
import axios from 'axios';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';

export default {
  props: ['index', 'uploaderId', 'cId'],
  mixins: [errorHandler, makeToast],
  data() {
    return {
      isDeleted: false,
      selected: false,
      file: '',
      fileSize: '',
      fileType: '',
      fileTitle: '',
      fTitleLen: 64,
      fTitleErr: true,
      uploading: false,
      uploaded: false,
      progress: 67,
    };
  },
  watch: {
    file() {
      if (this.file.size < 1024000) {
        this.fileSize = `${(this.file.size / (1024)).toFixed(1)} KB`;
      } else {
        this.fileSize = `${(this.file.size / (1024 * 1024)).toFixed(2)} MB`;
      }
    },
    fileTitle() {
      const l = this.fileTitle.length;
      if (l > this.fTitleLen) {
        this.fileTitle = this.fileTitle.splice(0, this.fTitleLen);
        this.fTitleErr = false;
      } else if (l > 0) {
        this.fTitleErr = false;
      } else {
        this.fTitleErr = true;
      }
    },
    progress() {
      if (this.progress === 100) {
        this.uploading = false;
        this.uploaded = true;
      }
    },
  },
  computed: {
    isFileReady() {
      return !this.fTitleErr && this.selected;
    },
    baseURL() {
      return this.$store.state.baseUrl;
    },
    V() {
      return this.$store.state.apiVersion;
    },
    token() {
      return `bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`;
    },
  },
  components: {
    RadialProgressBar,
  },
  methods: {
    deleteUploader() {
      this.isDeleted = true;
      this.$emit('delete', this.uploaderId);
    },
    selectFile() {
      this.$refs.file.click();
    },
    getFile() {
      const extensions = [
        'rar',
        'zip',
      ];
      [this.file] = [this.$refs.file.files[0]];
      let isFileSizeOk = true;
      if (this.file.size > 209715200) {
        isFileSizeOk = false;
        this.makeToast('warning', 'لطفا یک فایل کمتر از 200 مگابایت انتخاب کنید', 3000);
      }
      let isValidExtension = false;
      for (let i = 0; i < extensions.length; i += 1) {
        if (this.file.name.split('.').pop() === extensions[i]) {
          isValidExtension = true;
          this.fileType = this.file.name.split('.').pop();
        }
      }
      if (!isValidExtension) {
        this.makeToast('warning', 'نوع فایل مجاز انتخاب کنید', 3000);
      }
      if (isFileSizeOk && isValidExtension) {
        this.selected = true;
        // console.log(this.file);
      } else {
        this.file = '';
        this.selected = false;
      }
    },
    startUpload() {
      if (this.isFileReady) {
        const formData = new FormData();
        formData.append('files', this.file);
        this.uploading = true;
        this.progress = 0;
        // eslint-disable-next-line
        const uploadURL = `${this.$store.state.baseUrl}/api/v${this.V}/Uploads/file?courseId=${this.cId}`;
        axios({
          method: 'post',
          url: uploadURL,
          headers: {
            Authorization: this.token,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            // eslint-disable-next-line
            this.progress = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100), 10);
          },
          data: formData,
        }).then(
          (response) => {
            if (response.data.isSuccess) {
              this.$emit('uploadComplete', {
                url: response.data.data,
                label: this.fileTitle,
                size: this.fileSize,
                type: this.fileType,
              });
            } else {
              // this.makeToast('error', 'خطا در آپلود فایل، دوباره تلاش کنید', 3000);
            }
          },
          (error) => {
            this.makeToast('error', this.errorHandler(error), 3000);
          },
        ).catch(() => {
          this.makeToast('warning', 'خطای سامانه', 3000);
        });
      } else {
        this.makeToast('warning', 'لطفا عنوان فایل را وارد کنید', 3000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.uploadItem {
  margin-bottom: 8px;
  border-radius: 8px;
  padding: 8px;
  border: dashed 1px rgba($color: #000000, $alpha: 0.45);
  .fileForm {
    .ind {
      font-size: 12px;
      width: 32px;
      min-width: 32px;
      text-align: center;
    }
    span {
      font-size: 12px;
      font-weight: 300;
      text-align: right;
      margin-bottom: 4px;
    }
    input[type='text'] {
      padding: 8px;
      border: none;
      outline: none;
      border-bottom: solid 1px rgba($color: #000000, $alpha: 0.2);
      border-radius: 8px 8px 0 0;
      background-color: rgba($color: #000000, $alpha: 0.05);
      margin-bottom: 8px;
    }
    input[type='file'] {
      display: none;
    }
    i.option {
      margin-right: 16px;
      padding: 8px;
      border-radius: 50%;
      background-color: rgba($color: #000000, $alpha: 0.05);
    }
    .fileInfoHolder {
      span.name {
        font-size: 14px;
        font-weight: bold;
        word-spacing: -1px;
        color: #624421;
        margin-bottom: 0;
      }
      span.size {
        margin-top: 0;
        font-size: 10px;
        font-weight: 300;
        color: #624421;
        word-spacing: 2px;
      }
    }
    .startUpload {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background-color: rgb(64, 141, 64);
      color: white;
      font-size: 14px;
      font-weight: 300;
      margin-right: 16px;
    }
  }
  .uploaded {
    padding: 8px;
    i {
      color: rgb(63, 141, 63);
      margin-left: 8px;
    }
    p {
      font-size: 14px;
      font-weight: 300;
      text-align: right;
      padding: 0;
      margin: 0;
    }
  }
}
span.prog {
  font-size: 14px;
  font-weight: 300;
}
.hide {
  display: none;
}
</style>
