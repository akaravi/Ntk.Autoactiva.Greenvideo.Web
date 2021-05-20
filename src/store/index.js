import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    superLoading: true,
    baseUrl: 'https://api.webm.demoiran.com',
    apiVersion: 1,
    fp: 'undefined',
    mamad: 250,
    letExpand: true,
    username: 'rezaRahimi',
    name: 'ادمین',
    lname: 'ریمیک',
    workOn: 'permission',
    modalState: false,
    courseObject: {
      Id: '',
      Name: '',
      Teacher: '',
      Summary: '',
      Photo: '',
      Lesson: '',
      TeacherId: '',
      Videos: 20,
    },
    // permission
    permissionManagerMode: 'edit',
    focusPermissionId: '',
    focusPermissionName: '',
    // access
    accessManagerMode: 'edit',
    // grade
    gradeManagerMode: 'edit',
    focusedGradeId: '',
    focusGradeName: '',
    // teachers
    teacherManagerMode: '',
    focusedTeacherId: '',
    focusTeacherName: '',
    teacherEdit: false,
    // courses
    coursesManagerMode: '',
    focusedCourseId: '',
    focusCourseName: '',
    courseEdit: false,
    // lesson
    lessonManagerMode: 'edit',
    focusedLessonId: '',
    focusLessonName: '',
    toastData: [],
    // chat and messages
    conversation: [],
  },
  mutations: {
    setActiveConversation(state, payload) {
      state.conversation = payload;
    },
    newMessage(state, payload) {
      state.conversation.messages.push(payload);
    },
    replyThis(state, payload) {
      state.messageToReply = payload;
    },
    clearReply(state) {
      state.messageToReply = {};
    },
    setFingerPrint(state, payload) {
      state.fp = payload;
    },
    setVideoUploaderData(state, payload) {
      state.courseObject = payload;
      // console.log('payload in:  ', state.courseObject);
    },
    makeToast(state, payload) {
      const el = {};
      let tic = '';
      let tbg = '';
      const tid = Math.floor(Math.random() * (12000 - 2000 + 1) + 2000);
      const tmsg = payload.msg;
      const td = payload.duration;
      switch (payload.type) {
        case 'error': {
          tic = 'report';
          tbg = '#ae4422';
          break;
        }
        case 'warning': {
          tic = 'warning';
          tbg = '#de8422';
          break;
        }
        case 'success': {
          tic = 'done_all';
          tbg = '#42ae62';
          break;
        }
        case 'info': {
          tic = 'info';
          tbg = '#2244ae';
          break;
        }
        default:
          break;
      }
      el.id = tid;
      el.bg = tbg;
      el.ic = tic;
      el.msg = tmsg;
      el.duration = td;
      state.toastData.push(el);
      setTimeout(() => {
        let indx = -1;
        for (let i = 0; i < this.state.toastData.length; i += 1) {
          if (this.state.toastData[i].id === td) {
            // console.log(td, i);
            indx = i;
          }
        }
        this.state.toastData.splice(indx, 1);
        // console.log('tdd', this.state.toastData);
      }, td);
      // console.log(state.toastData);
    },
    disExpand() {
      this.state.letExpand = false;
    },
    enExpand() {
      this.state.letExpand = true;
    },
    openCard(state, payload) {
      this.state.modalState = true;
      state.focusPermissionId = payload;
      // console.log('bad az entekhab kardane access baraye delete', state.focusPermissionId);
    },
    openAccessCard(state, payload) {
      this.state.modalState = true;
      state.focusPermissionId = payload;
      // console.log(this.state.modalState, state.focusPermissionId);
    },
    closeCard() {
      this.state.modalState = false;
      this.state.focusPermissionId = 0;
      this.state.focusPermissionName = '';
      // consolee.log(this.state.modalState, this.state.focusPermissionId);
    },
    setAddMode() {
      this.state.permissionManagerMode = 'add';
      // consolee.log(this.state.permissionManagerMode);
    },
    // grade ↓
    setGradeAddMode() {
      this.state.gradeManagerMode = 'add';
    },
    setGradeEditMode() {
      this.state.gradeManagerMode = 'edit';
    },
    setGradeDeleteMode(state, payload) {
      state.gradeManagerMode = 'delete';
      state.focusGradeName = payload;
    },
    openGradeCard(state, payload) {
      this.state.modalState = true;
      state.focusedGradeId = payload;
    },
    // teacher ↓
    setTeacherAddMode() {
      this.state.teacherManagerMode = 'add';
    },
    setTeacherEditFalse(state) {
      state.teacherEdit = false;
    },
    setTeacherEditMode(state, payload) {
      state.focusedTeacherId = payload;
      // alert(state.focusedTeacherId);
      // state.teacherManagerMode = 'edit';
      state.teacherEdit = true;
    },
    setTeacherDeleteMode(state, payload) {
      state.teacherManagerMode = 'delete';
      // alert(payload);
      state.focusTeacherName = payload;
    },
    openTeacherCard(state, payload) {
      this.state.modalState = true;
      state.focusedTeacherId = payload;
    },
    // course ↓
    setCourseAddMode() {
      this.state.courseManagerMode = 'add';
    },
    setCourseEditFalse(state) {
      state.courseEdit = false;
    },
    setCourseEditMode(state, payload) {
      state.focusedCourseId = payload;
      // alert(state.focusedTeacherId);
      // state.teacherManagerMode = 'edit';
      state.courseEdit = true;
    },
    setCourseDeleteMode(state, payload) {
      state.courseManagerMode = 'delete';
      // alert(payload);
      state.focusCourseName = payload;
    },
    openCourseCard(state, payload) {
      this.state.modalState = true;
      state.focusedCourseId = payload;
    },
    setCourseName(state, payload) {
      state.focusCourseName = payload;
      // alert(state.focusCourseName);
    },
    resetCourseObject() {
      this.courseObject = {
        Id: '',
        Name: '',
        Teacher: '',
        Summary: '',
        Photo: '',
        Lesson: '',
        TeacherId: '',
        Videos: 20,
      };
    },
    // lessons ↓
    setLessonAddMode() {
      this.state.lessonManagerMode = 'add';
    },
    setLessonEditMode() {
      this.state.lessonManagerMode = 'edit';
    },
    setLessonDeleteMode(state, payload) {
      state.lessonManagerMode = 'delete';
      state.focusLessonName = payload;
    },
    openLessonCard(state, payload) {
      this.state.modalState = true;
      state.focusedLessonId = payload;
    },
    setEditMode() {
      this.state.permissionManagerMode = 'edit';
      // consolee.log(this.state.permissionManagerMode);
    },
    setDeleteMode(state, payload) {
      this.state.permissionManagerMode = 'delete';
      state.focusPermissionName = payload;
      // consolee.log(this.state.focusPermissionName);
    },
    setWorkOn(state, payload) {
      state.workOn = payload;
      // console.log('work on', payload);
    },
    // loading
    setLoadingOn(state) {
      state.superLoading = true;
    },
    setLoadingOff(state) {
      state.superLoading = false;
    },
  },
  actions: {
  },
  modules: {
  },
});
