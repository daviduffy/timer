<template>
  <div class="Timer__duration">
    <div class="Timer__digits">
      <input class="i i--h" type="number" v-model="hours" placeholder="HH" />
      <span>:</span>
      <input class="i i--m" type="number" v-model="minutes" placeholder="MM" />
      <span>:</span>
      <input class="i i--s" type="number" v-model="seconds" placeholder="SS" />
    </div>
    <div class="Timer__controls">
      <button class="B" @click="handleSubmit">save</button>
      <button class="B" @click="handleCancel">cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimerInput',
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
  .i
    all: unset
    background-color: white
    text-align: right
    flex: 1
    max-width: 2rem
    border: 1px solid lightgray
    border-radius: 2px
    padding: 0.25rem 0.125rem 0.25rem 0

  .i[type="number"]::-webkit-outer-spin-button, .i[type="number"]::-webkit-inner-spin-button
    -webkit-appearance: none
    margin: 0

  .i[type="number"]
    -moz-appearance: textfield

  span
    min-width: 0.25rem

  .i--h
  .i--m
  .i--s
</style>