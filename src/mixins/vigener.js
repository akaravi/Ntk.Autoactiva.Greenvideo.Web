export default {
  data() {
    return {
      alphabetArray: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
        'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '?',
        '!', '\'', '_', '-', '&', '@', '#', '$', '%', '*', '(', ')', ' '],
      isEncrypting: true,
      message: 'wifi password is swordfish.',
      key: 'Good fortune',
    };
  },
  methods: {
    convert_to_array(string) {
      return string.toUpperCase().split('');
    },
    get_adjusted_key_array(item) {
      const itemIndex = this.alphabetArray.indexOf(item);
      const beforeIndexArray = this.alphabetArray.slice(0, itemIndex);
      const afterIndexArray = this.alphabetArray.slice(itemIndex);
      return afterIndexArray.concat(beforeIndexArray);
    },
    encryptedMessage(m, msg, key) {
      // console.log(m, msg, key);
      this.message = msg;
      this.key = key;
      switch (m) {
        case 'e': {
          this.isEncrypting = true;
          break;
        }
        case 'd': {
          this.isEncrypting = false;
          break;
        }
        default:
          break;
      }
      const isEncrypting = this.current_mode;
      const { encryptedArray } = this;
      let finalMessage = encryptedArray.reduce((acc, char) => {
        let ac = acc;
        ac += char;
        return ac; // Can also return other values based on the array
      }, '');
      if (!isEncrypting) {
        finalMessage = finalMessage.toLowerCase();
      }
      return finalMessage;
    },
  },
  computed: {
    current_mode() {
      return (this.isEncrypting === ('true' || true));
    },
    messageArray() {
      return this.convert_to_array(this.message);
    },
    key_array() {
      return this.convert_to_array(this.key);
    },
    keyAdjustedArrays() {
      const adjustedArrays = [];
      this.key_array.forEach((item) => adjustedArrays.push(this.get_adjusted_key_array(item)));
      return adjustedArrays;
    },
    encryptedArray() {
      const isEncrypting = this.current_mode;
      const { messageArray } = this;
      const keyArrays = this.keyAdjustedArrays;
      const { alphabetArray } = this;
      const encryptedArray = messageArray.map((item, index) => {
        const currentIndex = (index % keyArrays.length);
        const currentKeyArray = keyArrays[currentIndex];
        if (isEncrypting) {
          const alphabetIndex = alphabetArray.indexOf(item);
          const encryptedCharacter = currentKeyArray[alphabetIndex];
          return encryptedCharacter;
        }
        const encryptedIndex = currentKeyArray.indexOf(item);
        const decryptedCharacter = alphabetArray[encryptedIndex];
        return decryptedCharacter;
      });
      return encryptedArray;
    },
  },
};
