<template>
  <div class="inputHolder"
    v-bind:class="{ filled: !computedEmpty, error: computedLenError || validationError }">
    <div class="top-row fRow jStart aCenter">
      <div style="color: red; margin-left: 8px" v-if='this.req'>*</div> <p>{{ label }}</p>
      <span v-bind:class="{ dNone: noLenNeed}">{{ inpLen }}/{{ a }}</span>
    </div>
    <div class="ih fCol jStart aStart">
      <!-- comment -->
      <input
        v-if="!computedTextarea"
        @input="whenInput($event)"
        @keyup.enter="handleEnter"
        @focus="toggleDropDown"
        v-bind:class="{ blinkOff: computedHasList }"
        :disabled="isPassword"
        v-model="message"
        :type="inputType"
        autocomplete="off"
        :placeholder="place"
      />
      <div class="newPassword secondary"
        @click="newPassword" v-if="this.isPassword">تولید رمز جدید</div>
      <div class="preview fRow jStart aStart wrap" v-if="this.compType === 'checkbox'">
        <div v-for="item in this.selectedItemLabels" v-bind:key='item'
        class="previewItem primary">{{item}}</div>
      </div>
      <textarea
        v-if="computedTextarea"
        @input="whenInput($event)"
        @focus="toggleDropDown"
        lines= 2
        v-bind:class="{
          filled: computedEmpty && !computedLenError,
          err: computedLenError,
          blinkOff: computedHasList }"
        v-bind:style="{minHeight: `${this.lines * 40}px`}"
        v-model="message"
        :type="inputType"
        :placeholder="place"></textarea>
      <div class="dropDownCloser" v-if="hasDropDown && dropDown" @click="toggleDropDown"></div>
      <div class="dropDown fCol jStart aStart" v-if="hasDropDown && dropDown">
        <div v-for="(item) in this.list" v-bind:key="item.id"
          @mouseover="overItem" @mouseout="outItem" class="dropDownItem fullWidth">
          <!-- radio button  -->
          <label class="rContainer checkBoxHolder dark fRow jStart aCenter fullWidth"
          v-if="compType === 'radio'"
          style="padding: 16px;">
            <input type="radio" name="items" :data-val="item.value"
              :id="item.value" :data-label="item.label"
              @change="ch($event, 'radio')" class="parent fullWidth"/>
            <div class="checkmark dark"></div>
            <div class="checkText fRow jCenter aCenter">
              <div>{{item.label}}</div>
            </div>
          </label>
          <!-- checkbox  -->
          <label class="container checkBoxHolder dark fullWidth"
          v-if="compType === 'checkbox'">
            <input type="checkbox" name="check" :data-val="item.value" :id="item.value"
              :data-label="item.label"
              @change="ch($event, 'check')" />
            <span class="checkmark dark"></span>
            <span class="checkText fRow jCenter aCenter">
              <div>{{item.label}}</div>
            </span>
          </label>
        </div>
      </div>
      <i class="material-icons-round"
        v-bind:class="{
          filledI: !computedEmpty,
          errorI: computedLenError || validationError }">{{ icon }}</i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'inp',
  data() {
    return {
      a: this.len,
      message: '',
      selectedItems: [],
      selectedItemLabels: [],
      selectedPreview: [],
      radioMessage: '',
      dropDown: false,
      letCloseDropDown: true,
      validationError: false,
      validationWarning: false,
      isPassword: false,
      err: false,
      warn: false,
      isActive: false,
      phoneValue: 0,
      emptyMessage: '',
      hasDropDown: false,
      formattedPhoneValue: '0',
      preventNextIteration: false,
      init: true,
    };
  },
  props: ['len', 'min', 'validation', 'inputType', 'compType', 'list', 'lines', 'initData',
    'label', 'place', 'icon', 'patern', 'from', 'noLimit', 'complete', 'req', 'parentError'],
  methods: {
    ch(event, type) {
      if (type === 'radio') {
        this.message = event.target.getAttribute('data-label');
        // console.log(this.message);
        this.radioMessage = event.target.getAttribute('data-val');
        // console.log(this.radioMessage);
        this.passValueOut();
        setTimeout(() => {
          this.toggleDropDown();
        }, 100);
        // this.passListOut();
      } else {
        // is check ↓
        const val = event.target.getAttribute('data-val');
        const lab = event.target.getAttribute('data-label');
        let indexOfItem = 0;
        let indexOfItemLabel = 0;
        if (event.target.checked) {
          if (!this.selectedItems.includes(val)) {
            this.selectedItems.push(val);
          }
          if (!this.selectedItemLabels.includes(lab)) {
            this.selectedItemLabels.push(lab);
          }
        } else {
          indexOfItem = this.selectedItems.indexOf(val);
          this.selectedItems.splice(indexOfItem, 1);
          indexOfItemLabel = this.selectedItemLabels.indexOf(lab);
          this.selectedItemLabels.splice(indexOfItemLabel, 1);
          // console.log('ino hazf kon', indexOfItem);
        }
        // console.log(this.selectedItems);
        // this.message = this.selectedItemLabels.join('، ');
        // console.log(this.message);
        this.passListOut();
      }
    },
    hasList() {
      let chl = false;
      if (this.compType === 'radio' || this.compType === 'checkbox') {
        chl = true;
      }
      return chl;
    },
    dontLetType() {
      this.message = this.message.substr(0, this.message.length - 1);
    },
    toggleDropDown() {
      // console.log(this.list);
      return (async () => {
        if (this.hasList()) {
          // console.log(this.list);
          // console.log('open/close drop down');
          if (!this.dropDown) {
            if (this.from === 'chooseTeacher') {
              // اگر اینپوت فیلتر دوره بر اساس دبیر بود
              this.$emit('getTeachers');
            }
            if (this.from === 'chooseLesson') {
              // اگر اینپوت فیلتر دوره بر اساس درس بود
              this.$emit('getLessons');
            }
            if (this.from === 'addCourseLesson') {
              // اگر اینپوت انتخاب درس برای اضافه کردن دوره بود
              this.$emit('getLessons');
            }
            if (this.from === 'addCourseTeacher') {
              // اگر اینپوت انتخاب دبیر برای اضافه کردن دوره بود
              // console.log('addCourseTeacher');
              this.$emit('gtbl');
            }
            if (this.from === 'editCourse') {
              // اگر اینپوت انتخاب دبیر برای اضافه کردن دوره بود
              // console.log('editCourseTeacher');
              this.$emit('gtbl');
            }
          }
          this.dropDown = !this.dropDown;
          // console.log(this.dropDown);
          // age radio bood
          if (this.compType === 'radio') {
            if (this.from === 'editCourse') {
              if (this.init) {
                setTimeout(() => {
                  try {
                    document.getElementById(this.radioMessage).click();
                  } catch (error) {
                    setTimeout(() => {
                      document.getElementById(this.radioMessage).click();
                    }, 300);
                  }
                  this.init = false;
                  // alert(this.init);
                }, 700);
              }
            }
            if (this.dropDown) {
              if (this.radioMessage.length > 0) {
                if (this.init) {
                  setTimeout(() => {
                    document.getElementById(`${this.radioMessage}`).click();
                    this.init = false;
                  }, 200);
                }
              }
            }
          } else if (this.compType === 'checkbox') {
            if (this.dropDown && this.selectedItems.length > 0) {
              setTimeout(() => {
                for (let i = 0; i < this.selectedItems.length; i += 1) {
                  document.getElementById(this.selectedItems[i]).checked = true;
                }
                document.getElementById(this.radioMessage).checked = true;
                // alert(this.radioMessage);
              }, 30);
            }
          }
        }
      })();
    },
    overItem() {
      this.letCloseDropDown = false;
    },
    outItem() {
      this.letCloseDropDown = true;
    },
    passValueOut() {
      if (!this.hasList()) {
        this.$emit('vmodel', { data: this.message, error: this.errorFlag(), warn: this.computedLenWarn });
      } else if (this.compType === 'radio') {
        this.$emit('vmodel', { data: this.radioMessage, error: this.errorFlag(), warn: this.computedLenWarn });
      }
    },
    passListOut() {
      this.$emit('vmodel', { data: this.selectedItems, error: this.errorFlag(), warn: this.computedLenWarn });
    },
    makeUsername() {
      let username = '';
      let rand = 0;
      for (let i = 0; i < 8; i += 1) {
        rand = Math.floor(Math.random() * (122 - 97)) + 97;
        username += String.fromCharCode(rand);
      }
      return username;
      // alert(pass);
    },
    makePassWord() {
      let pass = '';
      let rand = 0;
      rand = Math.floor(Math.random() * (90 - 65)) + 65;
      pass += String.fromCharCode(rand);
      rand = Math.floor(Math.random() * (90 - 65)) + 65;
      pass += String.fromCharCode(rand);
      rand = Math.floor(Math.random() * (57 - 48)) + 48;
      pass += String.fromCharCode(rand);
      rand = Math.floor(Math.random() * (57 - 48)) + 48;
      pass += String.fromCharCode(rand);
      rand = Math.floor(Math.random() * (57 - 48)) + 48;
      pass += String.fromCharCode(rand);
      rand = Math.floor(Math.random() * (57 - 48)) + 48;
      pass += String.fromCharCode(rand);
      rand = Math.floor(Math.random() * (122 - 97)) + 97;
      pass += String.fromCharCode(rand);
      rand = Math.floor(Math.random() * (122 - 97)) + 97;
      pass += String.fromCharCode(rand);
      return pass;
      // alert(pass);
    },
    newPassword() {
      if (this.isPassword) {
        this.message = this.makePassWord();
      }
    },
    handleEnter() {
      if (this.validation === 'searchQuery') {
        this.$emit('goSearch');
      }
    },
    whenInput(e) {
      switch (this.validation) {
        case 'phone': {
          const phonePattern = /^\(?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
          if (this.message.length > 11) {
            this.message = this.message.substr(0, 11);
            // console.log(this.message);
            this.validationError = false;
          }
          if (this.message.match(phonePattern) && this.message.charAt(0) === '0' && this.message.charAt(1) === '9') {
            this.validationError = false;
          } else {
            this.validationError = true;
          }
          break;
        }
        case 'name': {
          // const pat = /[^a-zA-Z0-9]{50}/g;
          // this.message = this.message.match(pat).join('');
          if (this.message.length < 2) {
            this.validationError = true;
          } else {
            this.validationError = false;
          }
          break;
        }
        case 'lname': {
          if (this.message.length < 2) {
            this.validationError = true;
          } else {
            this.validationError = false;
          }
          break;
        }
        case 'username': {
          // if includes space
          // if (this.message.length !== 0) {
          //   const patt1 = /^[a-zA-Z0-9]{6,10}$/;
          //   const res = this.message.match(patt1).join('');
          //   this.message = res;
          // }
          if (this.message.length < 6) {
            this.validationError = true;
          } else {
            this.validationError = false;
          }
          break;
        }
        case 'password': {
          // if includes space
          if (this.message.length !== 0) {
            const patt1 = /[a-zA-Z0-9]/g;
            const res = this.message.match(patt1).join('');
            this.message = res;
          }
          if (this.message.length === 0) {
            this.validationError = true;
          } else {
            this.validationError = false;
          }
          break;
        }
        case 'login-password': {
          // if includes space
          // const patt1 = /[a-zA-Z0-9]/g;
          // if (this.message.length !== 0) {
          //   const res = this.message.match(patt1).join('');
          //   this.message = res;
          // }
          // if (this.message.length === 0) {
          //   this.validationError = true;
          // } else {
          //   this.validationError = false;
          // }
          if (this.message.length > this.len) {
            this.message = this.message.substr(0, this.len);
            // console.log(this.message);
            this.validationError = false;
          } else if (this.message.length < 8) {
            this.validationError = true;
          } else {
            this.validationError = false;
          }
          break;
        }
        case 'captcha': {
          if (this.message.length >= 4) {
            this.message = this.message.substr(0, 4);
            this.validationError = false;
          } else {
            this.validationError = true;
          }
          break;
        }
        case 'searchQuery': {
          // console.log('hey');
          if (this.message.length > 0) {
            this.validationError = false;
          } else {
            this.validationError = true;
          }
          break;
        }
        case 'courseTitle': {
          // console.log('hey');
          if (this.message.length > 0 || this.message.length < this.len) {
            this.validationError = false;
          } else {
            this.validationError = true;
          }
          if (this.message.length > this.len) {
            this.message = this.message.substr(0, this.len);
            this.validationError = false;
          }
          break;
        }
        case 'duration': {
          // console.log('hey');
          if (!/^\d*:?\d*$/.test(this.message)) {
            this.message = this.message.substr(0, this.message.length - 1);
          }
          if (this.message.charAt(0) === ':') {
            this.message = `00${this.message}`;
          }
          if (this.message.charAt(1) === ':') {
            this.message = `0${this.message}`;
          }
          if (this.message.length === 5) {
            this.validationError = false;
          } else {
            this.validationError = true;
          }
          if (this.message.length > this.len) {
            this.message = this.message.substr(0, this.len);
            this.validationError = false;
          }
          break;
        }
        case 'price': {
          // console.log('hey');
          if (!/^\d*,?\d*$/.test(this.message) || this.message.charAt(0) === '0') {
            this.message = this.message.substr(0, this.message.length - 1);
          }
          this.message = this.message.replace(/,/g, '');
          this.message = this.commaSep(this.message);
          if (this.message.length > 0) {
            this.validationError = false;
          } else {
            this.validationError = true;
          }
          if (this.message.length > this.len) {
            this.message = this.message.substr(0, this.len);
            this.validationError = false;
          }
          break;
        }
        case 'discount': {
          // console.log('hey');
          if (!/^\d*,?\d*$/.test(this.message)) {
            this.message = this.message.substr(0, this.message.length - 1);
          }
          if (this.message.length > 0) {
            this.validationError = false;
          } else {
            this.validationError = true;
          }
          if (this.message.length > this.len) {
            this.message = this.message.substr(0, this.len);
            this.validationError = false;
          }
          break;
        }
        case 'videoTitle': {
          if (this.message.length < 1) {
            this.validationWarning = true;
            this.validationError = true;
          } else {
            this.validationWarning = false;
            this.validationError = false;
          }
          break;
        }
        default:
          break;
      }
      // let msg = '';
      if (!this.hasList()) {
        // msg = this.message;
        // inja halate pishfarze type roo inpute vaghti ke matnie
        this.passValueOut();
      } else {
        if (e.key === 9) {
          this.toggleDropDown();
          return;
        }
        if (this.compType === 'radio' || this.compType === 'checkbox') {
          this.dontLetType();
        }
      }
    },
    acceptNumber() {
      // validation for true phone number
    },
    commaSep(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    errorFlag() {
      // console.log('len error / validation error', this.computedLenError, this.validationError);
      return this.computedLenError || this.validationError;
    },
    warningFlag() {
      // console.log('warnin', this.computedLenWarn, this.validationWarning);
      return this.computedLenWarn || this.validationWarning;
    },
  },
  computed: {
    computedInit() {
      return this.initData;
    },
    computedTextarea() {
      if (this.compType === 'textarea') {
        return true;
      }
      return false;
    },
    computedList() {
      return this.list;
    },
    computedHasList() {
      let chl = false;
      if (this.compType === 'radio' || this.compType === 'checkbox') {
        chl = true;
      }
      return chl;
    },
    computedEmpty() {
      let ce = false;
      if (this.compType === 'radio' || this.compType === 'checkbox') {
        ce = false;
      } else {
        ce = true;
      }
      return ce;
    },
    computedLenError() {
      let cle = false;
      if (!this.computedHasList) {
        const msglen = this.message.length;
        const ln = this.len;
        if (msglen > ln) {
          // inja error miishe
          cle = true;
        } else if (msglen <= ln && msglen > this.min) {
          cle = false;
        } else {
          cle = false;
        }
      }
      return cle;
    },
    computedLenWarn() {
      let cle = false;
      if (!this.hasList()) {
        const msglen = this.message.length;
        if (msglen < this.min) {
          // inja error miishe
          cle = true;
        } else {
          cle = false;
        }
        if (msglen === 0) {
          cle = false;
        }
      }
      return cle;
    },
    inpLen() {
      let il = 0;
      if (this.hasList()) {
        // console.log(this.compType);
        il = 0;
      } else {
        // console.log(this.message);
        il = this.message.length;
      }
      return il;
    },
    noLenNeed() {
      let nln = false;
      if (this.noLimit) {
        nln = true;
      }
      return nln;
    },
  },
  mounted() {
    // this.whenInput();
    // console.clear();
    // console.log(this.list);
    if (this.validation === 'password') {
      setTimeout(() => {
        this.message = this.makePassWord();
        this.isPassword = true;
        this.passValueOut();
      }, 300);
    }
    if (this.validation === 'login-password') {
      setTimeout(() => {
        this.passValueOut();
      }, 300);
    }
    if (this.validation === 'username') {
      if (this.from === 'add') {
        setTimeout(() => {
          this.message = this.makeUsername();
          this.passValueOut();
        }, 300);
      }
    }
    if (this.validation === 'videoTitle') {
      this.whenInput();
    }
    if (this.compType === 'radio' || this.compType === 'checkbox') {
      if (this.from === 'edit') {
        if (this.compType === 'radio') {
          this.radioMessage = this.initData;
          setTimeout(() => {
            this.toggleDropDown();
            // alert(this.radioMessage.data);
            setTimeout(() => {
              document.getElementById(this.radioMessage.data).click();
              setTimeout(() => {
                this.toggleDropDown();
              }, 15);
            }, 15);
          }, 5);
        } else {
          setTimeout(() => {
            this.toggleDropDown();
            // alert(this.radioMessage.data);
            setTimeout(() => {
              this.selectedItems = this.initData;
              for (let i = 0; i < this.selectedItems.length; i += 1) {
                document.getElementById(this.selectedItems[i]).click();
              }
              setTimeout(() => {
                this.toggleDropDown();
              }, 15);
            }, 15);
          }, 45);
        }
      }
      if (this.from === 'editCourse') {
        this.radioMessage = this.initData;
        this.toggleDropDown().then(() => {
        });
      }
    } else {
      this.message = this.initData;
    }
    if (this.hasList()) {
      // alert(this.list);
      this.hasDropDown = true;
    } else {
      this.hasDropDown = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.inputHolder {
  flex-grow: 1;
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
}

.dNone{
  display: none;
}

.top-row {
  padding: 8px 12px 0px 12px;
  color: rgb(71, 71, 71);
}

.top-row p {
  padding: 0;
  margin: 0;
  flex-grow: 1;
  color: rgb(71, 71, 71);
  font-size: 12px;
  margin-bottom: 8px;
  text-align: right;
}

.top-row span {
  font-weight: 700;
  color: #61187a;
  margin-right: 8px;
  font-size: 12px;
}

.blinkOff{
 color: transparent !important;
 cursor: pointer;
 text-shadow: 0 0 0 rgb(34, 34, 34);
}

.ih {
  width: 100%;
  position: relative;
}

.preview{
  margin-top: 8px;
}

.previewItem{
  border-radius: 80px;
  padding: 4px 8px;
  font-size: 10px;
  color: white;
  margin: 0 0 4px 4px;
}

.ih .dropDown{
  position: absolute;
  top: 48px;
  left: 0;
  width: 100%;
  max-height: 264px;
  overflow: hidden scroll;
  z-index: 2000;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 8px 16px 0 rgba($color: #000000, $alpha: 0.15);
}

.ih .dropDownCloser{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(255, 255, 0, 0);
  z-index: 1000;
}

.ih i {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1700;
  pointer-events: none;
  transition: all ease-in-out 0.2s;
  -moz-transition: all ease-in-out 0.2s;
  -ms-transition: all ease-in-out 0.2s;
  -o-transition: all ease-in-out 0.2s;
  color: rgb(78, 78, 78);
}

.error i{
  color: red !important;
}

.error input{
  border: solid 2px red !important;
}

.filled i{
  color: #28d353c7 !important;
}

.filled input{
  border: solid 2px #28d353c7 !important;
}

.ih input, .ih textarea {
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border: solid 2px #61187a3f;
  background-color: #ffffff;
  color: rgb(34, 34, 34);
  padding: 8px 40px 8px 8px;
  text-align: right;
  position: relative;
  transition: all ease-in-out 0.2s;
  -moz-transition: all ease-in-out 0.2s;
  -ms-transition: all ease-in-out 0.2s;
  -o-transition: all ease-in-out 0.2s;
}

.errorI {
  color: #cf3535f5;
}

.inputHolder input:focus, .inputHolder textarea:focus{
  outline: none;
  z-index: 1500;
  border: solid 2px #868686;
}

textarea{
  outline: none;
  padding-top: 12px !important;
  resize: none !important;
}

input[type='radio'], input[type='checkbox'] {
  display: none;
}

.newPassword{
  border-radius: 240px;
  padding: 4px 8px;
  color: white;
  margin-top: 8px;
  font-size: 10px;
}
</style>
