<template>
  <div class="home">
    <rotate-box></rotate-box>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RotateBox from '@/components/RotateBox.vue'; // @ is an alias to /src

@Component({
  components: {
    RotateBox,
  },
})
export default class Home extends Vue {}
</script>
