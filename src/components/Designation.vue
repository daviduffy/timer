<template>
  <li class="Timer__item" :class="{ 'Timer__item--active': active }">
    <button
      @click="handleClick(designation)"
      class="B B--un"
    >
      <svg class="Timer__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
        <path d="M392.09,122.767l15.446-24.272c6.858-10.778,3.681-25.076-7.097-31.935c-10.777-6.86-25.076-3.681-31.935,7.099    l-15.409,24.215c-22.708-11.316-47.642-18.798-73.962-21.58V46.265h1.448c12.775,0,23.133-10.357,23.133-23.133    S293.356,0,280.581,0h-49.163c-12.775,0-23.133,10.357-23.133,23.133s10.357,23.133,23.133,23.133h1.45v30.029    C123.239,87.885,37.535,180.886,37.535,293.535C37.535,413.997,135.538,512,256,512s218.465-98.003,218.465-218.465    C474.465,224.487,442.259,162.83,392.09,122.767z M256,465.735c-94.951,0-172.2-77.249-172.2-172.2s77.249-172.2,172.2-172.2    s172.2,77.249,172.2,172.2S350.951,465.735,256,465.735z"/>
        <path d="M333.172,205.084c-9.623-8.397-24.238-7.407-32.638,2.222l-61.964,71.02c-8.399,9.626-7.404,24.24,2.222,32.638    c9.626,8.399,24.24,7.404,32.638-2.222l61.964-71.02C343.794,228.096,342.798,213.484,333.172,205.084z"/>
      </svg>
    </button>
    
    <div class="Timer__duration Timer__duration--edit" v-if="edit">
      <input type="text" :value="userInput" @input="handleInput" />
      <button @click="handleSave" class="B">save</button>
      <button @click="handleToggle" class="B">cancel</button>
    </div>
    <div class="Timer__duration" v-else>
      <span>{{duration}}</span>
      <button @click="handleToggle" class="B">edit</button>
    </div>
    <span class="Timer__designation">{{designation}}</span>
  </li>
</template>

<script>
export default {
  props: {
    designation: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      default: '00:00'
    }
  },
  data: () => ({
    edit: false,
    userInput: ''
  }),
  methods: {
    handleToggle() {
      this.edit = !this.edit;
      // this.userInput = duration;
    },
    handleInput({ target }) {
      const { value: VALUE } = target;
      // const value = VALUE.replace(/[^0-9]|:/g, '');
      // console.log(value);
      this.userInput = VALUE;

    },
    handleSave() {
      console.log(this.userInput);

      this.edit = false;
    },
    handleClick(nextDesignation) {
      this.$store.dispatch('startSelectDesignation', nextDesignation);
    }
  },
  computed: {
    active() {
      this.$store.state.designation === this.designation;
    },
    userInputDigital() {
      return [...this.userInput].reverse().map((num, index) => {
        if (index % 2 === 0 && index !== 0) {
          return `${num}:`;
        }
        return num;
      }).reverse().join('')
    }
  }
};
</script>

<style lang="sass">
  .Timer__item
    font-size: 1rem
    transition: background-color 0.2s ease-in-out
    width: 100%
    display: flex
    &:hover
      background-color: #efefef

  .Timer__item--active .Timer__icon
    fill: #ff9900

  .B
    font-size: inherit
    &:focus
      outline: none
    
  .Timer__icon
    width: 2rem
    height: 2rem
    flex: 1
    max-width: 1.25rem
    fill: gray

  .Timer__duration
    flex: 2
    max-width: 180px
    font-variant-numeric: tabular-nums
  
  .Timer__duration--edit
    // flex: 2

  .Timer__designation
    flex: 1
    text-align: left
</style>