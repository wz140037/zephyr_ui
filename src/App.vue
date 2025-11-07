<!--
 * new page
 * @author: wzzz
 * @since: 2025-10-31
 * App.vue
-->
<script setup lang="ts">
import { ElScrollbar, ElTooltip, ElButton } from 'element-plus'
import { h } from 'vue';

// const is = ElScrollbar
const isProps = {
  height: '100px'
}
// const is ={ name: 'zzz' }
// const is = h(ElScrollbar, { height: '300px' })
const is = h(ElTooltip, { trigger: 'click' }, {
  default: () => h(ElButton, '我是按钮'),
  content: () => h('div', 'content2222')
})

</script>

<template>
  <div class="container">
    <ZephyrWrapper :is="is" :show="true"></ZephyrWrapper>
    <!-- <ZephyrWrapper :is="ElTooltip" :show="true">
      <template #default>
        <ElButton>我是按钮</ElButton>
      </template>
      <template #content>
        <div>content2222</div>
      </template>
    </ZephyrWrapper> -->
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 50vh;
  width: 50vw;
  background-color: #f0f0f0;
  margin: 0 auto;
  overflow: hidden;

  .demo-x {
    height: 100vh;
    background-color: red;
  }

  .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
}
</style>