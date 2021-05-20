export default {
  methods: {
    errorHandler(err) {
      let errorMsg = '';
      switch (err.response.status) {
        case 400: {
          errorMsg = 'درستی اطلاعات ورودی را بررسی نمایید.';
          break;
        }
        case 401: {
          // errorMsg = 'کاربر ناشناخته، در حال ورود به صفحه لاگین...';
          // localStorage.clear();
          // this.$router.push('/login');
          alert('goToLogin');
          // this.$authObeject.refresh();
          break;
        }
        case 403: {
          errorMsg = 'شما به این صفحه دسترسی ندارید';
          this.$router.push('/dashboard');
          break;
        }
        case 404: {
          errorMsg = 'پاسخی برای درخواست شما یافت نشد.';
          break;
        }
        case 405: {
          errorMsg = 'خطایی در پنل مدیریت اتفاق افتاده است.';
          break;
        }
        case 500: {
          errorMsg = 'خطای سرور';
          break;
        }
        default: {
          errorMsg = 'خطای سرور';
          break;
        }
      }
      // console.clear();
      // console.log('from mixin', err.status);
      return errorMsg;
    },
    makeToast(toastType, toastMsg, d) {
      this.$store.commit('makeToast', { type: toastType, msg: toastMsg, duration: d });
    },
  },
};
