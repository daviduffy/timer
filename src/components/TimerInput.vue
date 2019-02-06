<template>
  <div class="Timer__duration">
    <div class="Timer__digits">
      <input class="h" type="number" v-bind="hours" placeholder="HH" />
      <span>:</span>
      <input class="m" type="number" v-bind="minutes" placeholder="MM" />
      <span>:</span>
      <input class="s" type="number" v-bind="seconds" placeholder="SS" />
    </div>
    <div class="Timer__controls">
      <button class="B" @click="handleSubmit">save</button>
      <button class="B" @click="handleCancel">cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimerInput",
  data: () => ({
    hours: '',
    minutes: '',
    seconds: ''
  }),
  methods: {
    handleSubmit() {
      const types = [this.hours, this.minutes, this.seconds];
      if (types.filter(it => !!it).length > 0) {
        this.$emit('submit', {
          hours: this.hours,
          minutes: this.minutes,
          seconds: this.seconds
        });
      }
    },
    handleCancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped lang="sass">

  input
    all: unset
    text-align: right
    flex: 1
    max-width: 2rem

  input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button
    -webkit-appearance: none
    margin: 0

  input[type="number"]
    -moz-appearance: textfield

  span
    min-width: 0.25rem

  .h
  .m
  .s
</style>