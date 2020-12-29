<template>
  <div class="home">
    <TestVRM></TestVRM>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TestVRM from '@/components/TestVRM.vue'; // @ is an alias to /src

@Component({
  components: {
    TestVRM,
  },
})
export default class Home extends Vue {}
</script>
