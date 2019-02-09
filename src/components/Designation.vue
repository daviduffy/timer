<template>
  <li class="Timer__item" :class="{ 'Timer__item--active': active }">
    <button
      @click="handleClick"
      class="B B--un"
    >
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve" class="Timer__icon"><path d="m392.09,122.767l15.446,-24.272c6.858,-10.778 3.681,-25.076 -7.097,-31.935c-10.777,-6.86 -25.076,-3.681 -31.935,7.099l-15.409,24.215c-22.708,-11.316 -47.642,-18.798 -73.962,-21.58l0,-30.029l1.448,0c12.775,0 23.133,-10.357 23.133,-23.133s-10.358,-23.132 -23.133,-23.132l-49.163,0c-12.775,0 -23.133,10.357 -23.133,23.133s10.357,23.133 23.133,23.133l1.45,0l0,30.029c-109.629,11.59 -195.333,104.591 -195.333,217.24c0,120.462 98.003,218.465 218.465,218.465s218.465,-98.003 218.465,-218.465c0,-69.048 -32.206,-130.705 -82.375,-170.768zm-136.09,342.968c-94.951,0 -172.2,-77.249 -172.2,-172.2s77.249,-172.2 172.2,-172.2s172.2,77.249 172.2,172.2s-77.249,172.2 -172.2,172.2z"/><path class="Timer__hours" v-bind:style="{ transform: 'rotate(' + rotationHours + 'deg) translate(-6%, 6%)'}" stroke="null" d="m322.238757,246.742332c-0.065422,-12.771332 -9.883791,-23.076043 -21.934118,-23.004951l-88.884228,0.517852c-12.047582,0.069856 -21.761779,10.484057 -21.695193,23.258301c0.065879,12.774905 9.88716,23.075558 21.934118,23.004951l88.884228,-0.517852c12.048205,-0.069107 21.760365,-10.482734 21.695193,-23.258301z"/><path stroke="null" class="Timer__minutes" v-bind:style="{ transform: 'rotate(' + rotationMinutes + 'deg)  translate(-10%, 9%)'}" d="m341.2396,228.19734c-0.03502,-12.77149 -10.62917,-22.10918 -26.13524,-22.07862l-117.37408,-0.78115c-20.50253,0.02933 -27.0424,10.4108 -27.00589,23.18521c0.03559,12.77506 8.6335,23.1087 24.13524,23.07862l118.37407,-0.21886c23.50334,-0.02858 28.04058,-10.40948 28.0059,-23.1852z"/></svg>
    </button>
    
    <div class="Timer__container" @mouseover="handleMouseover" @mouseout="handleMouseout">
      <TimerInput
        v-if="edit"
        v-on:submit="handleSubmit"
        v-on:cancel="handleToggle" />
      <div v-else class="Timer__duration">
        <button
          class="Timer__digits Timer__digits--display B B--un"
          @click="handleClick"
          v-html="getDuration()"></button>
        <div class="Timer__controls">
          <button v-if="showEdit" @click="handleToggle" class="B B--un a a--f">adjust time</button>
        </div>
      </div>
    </div>
    <span class="Timer__designation">{{designation}}</span>
  </li>
</template>

<script>
import display, { timer, jsx, euro } from '@/services/display';
import * as types from '@/constants/constants';
import TimerInput from '@/components/TimerInput.vue';
export default {
  props: {
    designation: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    showEdit: false,
    edit: false,
    rotationMinutes: 0,
    rotationHours: 0
  }),
  components: {
    TimerInput
  },
  methods: {
    handleToggle() {
      console.log('toggle');
      this.edit = !this.edit;
    },
    handleMouseover() { return this.showEdit = true; },
    handleMouseout() { return this.showEdit = false; },
    handleInput({ target }) {
      const { value: VALUE } = target;
      const value = VALUE.replace(/[^0-9]|:/g, '');
      this.userInput = value;
    },
    handleSubmit({ hours, minutes, seconds }) {
      const payload = { designation: this.designation, hours, minutes, seconds };
      this.$store.dispatch('startSetDuration', payload);
      this.edit = false;
    },
    handleClick() {
      const { designation } = this;
      const { designation: prevDesignation } = this.$store.state;

      let action, type;
      switch (prevDesignation) {
        // if currDesignation is equal to the previous designation
        case designation:
          action = 'startStopTimer';
          type = types.STOP_TIMER;
          break;
        case '':
          action = 'startStartTimer';
          type = types.START_TIMER;
          break;
        default:
          action = 'startSwitchTimer';
          type = types.SWITCH_TIMER;
          break;
      }
      this.$store.dispatch(action, { type, designation });
    },
    getDuration() {
      const historicalDuration = this.$store.state.aggregate[this.designation] || 0;
      let totalDuration = historicalDuration;
      if (this.active) {
        // add current time minus start time to stored duration
        const { duration: activeDuration } = this.$store.state
        totalDuration = totalDuration + activeDuration;
      }
      // also sets the rotation of the clock :(
      const minutes = (dayjs(totalDuration).format('mm') / 60);
      const rotationMinutes = (Math.round(minutes * 100) / 100) * 360;
      this.rotationMinutes = rotationMinutes + 90;
      const hours = (dayjs(totalDuration).format('hh') / 12);
      const rotationHours = (Math.round(hours * 100) / 100) * 360;
      this.rotationHours = rotationHours - 27;
      return display(totalDuration, jsx);
    }
  },
  computed: {
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

  .Timer__container
    display: flex
    flex: 2
    max-width: 240px

  .Timer__duration
    display: flex
    align-items: center
    flex: 1
    font-variant-numeric: tabular-nums
  
  .Timer__digits,
  .Timer__controls,
  .Timer__designation
    display: flex
    align-items: center

  .Timer__digits
    flex: 1 0 40%
    min-width: 40%
    max-width: 40%
    align-self: stretch
    color: inherit

  .Timer__digits--display
    padding-left: 1rem

  .Timer__controls
    flex: 1 0 60%
    min-width: 60%
    max-width: 60%

  .Timer__designation
    flex: 1
    text-align: left

  .Timer__minutes,
  .Timer__hours
    transform-origin: 51% 55%

</style>