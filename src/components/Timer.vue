<template>
  <div class="T">
    <ul>
      <Designation
        v-for="d in designations"
        :key="d"
        :designation="d"
        :active="d === currentDesignation"
      />
    </ul>
  </div>
</template>

<script>
// External Dependencies
import dayjs from 'dayjs';
window.dayjs = dayjs;

// Internal Components
import Designation from '@/components/Designation';

// Internal Dependencies
import display, { timer } from '@/services/display';
import { uuid } from '@/utils';
import { getAggregate } from '@/services/eventStream';

export default {
  name: 'Timer',
  components: {
    Designation
  },
  computed: {
    currentDesignation() {
      return this.$store.state.designation;
    },
    designations() {
      return this.$store.state.designationsProjection;
    }
  }
};
</script>

<style lang="sass">
  .T
    width: calc(100vh - 2rem)
    max-width: 600px
    margin: 0 auto

  .F__g
    display: flex
    flex-direction: column

  .F__i
    width: 100%
    height: 28px

  .B
    cursor: pointer

  .B--un
    border: 0
    background: 0
    padding: 0.2rem 0.8rem
</style>