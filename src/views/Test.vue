<template>
  <div>
    
  {{ $store.state.user }}
  <el-button type="danger" :icon="Delete" circle><el-icon><Delete /></el-icon></el-button>

    <!-- 颜色选择器 -->
    <el-select v-model="selectedColors" multiple placeholder="选择颜色" style="width: 240px" @change="filterCategories">
      <el-option
        v-for="color in colors"
        :key="color.value"
        :label="color.label"
        :value="color.value"
      >
        <div class="flex items-center">
          <el-tag :color="color.value" style="margin-right: 8px" size="small" />
          <span :style="{ color: color.value }">{{ color.label }}</span>
        </div>
      </el-option>
    </el-select>

    <!-- 显示类别 -->
    <div v-if="filteredCategories.length">
      <div v-for="category in filteredCategories" :key="category.id" class="category">
        <el-tag :color="category.color" style="margin-right: 8px" size="small">
          {{ category.name }}
        </el-tag>
      </div>
    </div>

    <div v-else>
      <p>没有匹配的类别</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

// 选中的颜色
const selectedColors = ref<string[]>([])

// 可选颜色
const colors = [
  { value: '#E63415', label: 'red' },
  { value: '#FF6600', label: 'orange' },
  { value: '#FFDE0A', label: 'yellow' },
  { value: '#1EC79D', label: 'green' },
  { value: '#14CCCC', label: 'cyan' },
  { value: '#4167F0', label: 'blue' },
  { value: '#6222C9', label: 'purple' },
]

// 类别与颜色的映射
const categories = [
  { id: 1, name: '硬糖', color: '#E63415' },   // 红色
  { id: 2, name: '软糖', color: '#FF6600' },   // 橙色
  { id: 3, name: '巧克力', color: '#FFDE0A' }, // 黄色
  { id: 4, name: '棉花糖', color: '#1EC79D' }, // 绿色
  { id: 5, name: '水果糖', color: '#14CCCC' }, // 青色
  { id: 6, name: '奶糖', color: '#4167F0' },   // 蓝色
  { id: 7, name: '牛轧糖', color: '#6222C9' }, // 紫色
]

// 筛选后的类别列表
const filteredCategories = ref([...categories])

// 根据选择的颜色过滤类别
const filterCategories = () => {
  if (selectedColors.value.length === 0) {
    filteredCategories.value = [...categories] // 如果没有颜色选择，显示所有类别
  } else {
    // 根据选择的颜色过滤类别
    filteredCategories.value = categories.filter((category) =>
      selectedColors.value.includes(category.color)
    )
  }
}

// 初始时显示所有类别
filterCategories()

// 监听选中的颜色变化，自动筛选类别
watch(selectedColors, filterCategories)
</script>

<style scoped>
.el-tag {
  margin-right: 8px;
}
.category {
  margin: 10px 0;
}
</style>

