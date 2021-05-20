export default {
  data() {
    return {
      mounth: 'س',
    };
  },
  methods: {
    displayTime(t) {
      if (t === 0) {
        // alert('هنوز وارد نشده');
        return `${this.mounth}وارد نشده`;
      }
      // eslint-disable-next-line
      const fullDateTime = new Date((t / 10000) - Math.abs(new Date(0, 0, 1).setFullYear(1))).toLocaleString('fa-IR');
      // console.log(fullDateTime.split('،')[0].split('/'));
      return {
        time: fullDateTime.split('،')[1],
        H: fullDateTime.split('،')[1].split(':')[0],
        M: fullDateTime.split('،')[1].split(':')[1],
        S: fullDateTime.split('،')[1].split(':')[2],
        date: fullDateTime.split('،')[0],
        DD: fullDateTime.split('،')[0].split('/')[2],
        MM: fullDateTime.split('،')[0].split('/')[1],
        MN: this.sayMounthName(fullDateTime.split('،')[0].split('/')[1]),
        YY: fullDateTime.split('،')[0].split('/')[0],
        full: fullDateTime,
      };
    },
    sayMounthName(num) {
      // let mountName = '';
      const em = '';
      const n = num;
      // console.log(num);
      // ۱۱۰۱۲۳۴۵۶۷۸۹۰
      switch (n) {
        case '۱': {
          this.mounth = `${em}فروردین`;
          break;
        }
        case '۲': {
          this.mounth = `${em}اردیبهشت`;
          break;
        }
        case '۳': {
          this.mounth = `${em}خرداد`;
          break;
        }
        case '۴': {
          this.mounth = `${em}تیر`;
          break;
        }
        case '۵': {
          this.mounth = `${em}مرداد`;
          break;
        }
        case '۶': {
          this.mounth = `${em}شهریور`;
          break;
        }
        case '۷': {
          this.mounth = `${em}مهر`;
          break;
        }
        case '۸': {
          this.mounth = `${em}آبان`;
          break;
        }
        case '۹': {
          this.mounth = `${em}آذر`;
          break;
        }
        case '۱۰': {
          this.mounth = `${em}دی`;
          break;
        }
        case '۱۱': {
          this.mounth = `${em}بهمن`;
          break;
        }
        case '۱۲': {
          this.mounth = `${em}اسفند`;
          break;
        }
        default: {
          this.mounth = `${em}`;
          break;
        }
      }
      return this.mounth;
    },
  },
};
