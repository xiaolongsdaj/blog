<template>
  <div class="wallpaper">
    <!-- 完整时间显示 -->
    <div class="full-time">
      {{ fullTime }}
    </div>
    
    <!-- 星空背景 -->
    <!-- <div class="starry-background">
      <div v-for="i in 150" :key="i" class="star" :style="{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${2 + Math.random() * 3}s` }"></div>
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
    </div> -->
    
    <!-- 时钟主体 -->
    <div class="clock-container">
      <!-- 中心年份显示 -->
      <div class="center-year">
        {{ currentYear }}
      </div>
      
      <!-- 月环 -->
      <div class="ring ring-1">
        <div 
          v-for="(month, index) in months" 
          :key="index"
          class="ring-item"
          :class="{ active: isMonthActive(index) }"
          :style="getRingItemStyle(1, index, months.length, currentMonthIndex)"
        >
          {{ month }}
        </div>
      </div>
      
      <!-- 日期环 -->
      <div class="ring ring-2">
        <div 
          v-for="(day, index) in days" 
          :key="index"
          class="ring-item"
          :class="{ active: isDayActive(index) }"
          :style="getRingItemStyle(2, index, days.length, currentDayIndex)"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- 节气环 -->
      <div class="ring ring-3">
        <div 
          v-for="(solar, index) in solarTerms" 
          :key="index"
          class="ring-item"
          :class="{ active: isSolarActive(index) }"
          :style="getRingItemStyle(3, index, solarTerms.length, currentSolarIndex)"
        >
          {{ solar }}
        </div>
      </div>
      
      <!-- 时环 -->
      <div class="ring ring-4">
        <div 
          v-for="(hour, index) in hours" 
          :key="index"
          class="ring-item"
          :class="{ active: isHourActive(index) }"
          :style="getRingItemStyle(4, index, hours.length, currentHourIndex)"
        >
          {{ hour }}
        </div>
      </div>
      
      <!-- 分钟环 -->
      <div class="ring ring-5">
        <div 
          v-for="(minute, index) in minutes" 
          :key="index"
          class="ring-item"
          :class="{ active: isMinuteActive(index) }"
          :style="getRingItemStyle(5, index, minutes.length, currentMinuteIndex)"
        >
          {{ minute }}
        </div>
      </div>
      
      <!-- 秒钟环 -->
      <div class="ring ring-6">
        <div 
          v-for="(second, index) in seconds" 
          :key="index"
          class="ring-item"
          :class="{ active: isSecondActive(index) }"
          :style="getRingItemStyle(6, index, seconds.length, currentSecondIndex)"
        >
          {{ second }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 月份
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

// 日期
const days = Array.from({ length: 31 }, (_, i) => `${i + 1}号`)

// 二十四节气
const solarTerms = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
]

// 小时
const hours = Array.from({ length: 24 }, (_, i) => `${i}时`)

// 分钟
const minutes = Array.from({ length: 60 }, (_, i) => `${i}分`)

// 秒钟
const seconds = Array.from({ length: 60 }, (_, i) => `${i}秒`)

// 当前时间
const currentTime = ref(new Date())

// 当前年份
const currentYear = computed(() => {
  return `${currentTime.value.getFullYear()}年`
})

// 完整时间显示
const fullTime = computed(() => {
  const date = currentTime.value
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

// 计算当前月份索引
const currentMonthIndex = computed(() => {
  return currentTime.value.getMonth()
})

// 计算当前日期索引
const currentDayIndex = computed(() => {
  return currentTime.value.getDate() - 1
})

// 计算当前节气索引（简化处理，实际应根据具体日期计算）
const currentSolarIndex = computed(() => {
  const month = currentTime.value.getMonth()
  const day = currentTime.value.getDate()
  // 简化计算：每个月两个节气
  return Math.min(month * 2 + Math.floor(day / 15), 23)
})

// 计算当前小时索引
const currentHourIndex = computed(() => {
  return currentTime.value.getHours()
})

// 计算当前分钟索引
const currentMinuteIndex = computed(() => {
  return currentTime.value.getMinutes()
})

// 计算当前秒钟索引
const currentSecondIndex = computed(() => {
  return currentTime.value.getSeconds()
})

// 检查月份是否激活
const isMonthActive = (index: number) => {
  return index === currentMonthIndex.value
}

// 检查日期是否激活
const isDayActive = (index: number) => {
  return index === currentDayIndex.value
}

// 检查节气是否激活
const isSolarActive = (index: number) => {
  return index === currentSolarIndex.value
}

// 检查小时是否激活
const isHourActive = (index: number) => {
  return index === currentHourIndex.value
}

// 检查分钟是否激活
const isMinuteActive = (index: number) => {
  return index === currentMinuteIndex.value
}

// 检查秒钟是否激活
const isSecondActive = (index: number) => {
  return index === currentSecondIndex.value
}

// 获取环形项目样式
const getRingItemStyle = (ringLevel: number, index: number, total: number, currentIndex: number) => {
  // 计算基础角度
  const baseAngle = (index / total) * 360
  // 计算旋转角度，使当前时间项位于右侧（0度位置）
  const rotationAngle = -((currentIndex / total) * 360)
  const radius = 100 + (ringLevel - 1) * 70
  const x = Math.cos((baseAngle - 0) * Math.PI / 180) * radius
  const y = Math.sin((baseAngle - 0) * Math.PI / 180) * radius
  
  return {
    transform: `translate(${x}px, ${y}px) rotate(${baseAngle}deg)`,
    transformOrigin: 'center',
    // 对整个环应用旋转，使当前项位于右侧
    '--ring-rotation': `${rotationAngle}deg`
  }
}

// 定时更新时间
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.wallpaper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 完整时间显示
.full-time {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(100, 181, 246, 0.8);
  z-index: 3;
  
  @media (max-width: 768px) {
    font-size: 14px;
    top: 10px;
    left: 10px;
  }
}

// 星空背景
.starry-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 30%, #2a2a6a 50%, #1a1a4a 70%, #0a0a2a 100%);
  z-index: 1;
  
  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #ffffff;
    border-radius: 50%;
    animation: twinkle 3s infinite ease-in-out;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
  
  // 星云效果
  .nebula {
    position: absolute;
    border-radius: 50%;
    filter: blur(50px);
    opacity: 0.3;
    animation: nebula-move 20s infinite linear;
  }
  
  .nebula-1 {
    width: 400px;
    height: 400px;
    background: rgba(100, 149, 237, 0.5);
    top: 10%;
    left: 10%;
  }
  
  .nebula-2 {
    width: 600px;
    height: 600px;
    background: rgba(138, 43, 226, 0.3);
    top: 30%;
    right: 10%;
  }
  
  .nebula-3 {
    width: 300px;
    height: 300px;
    background: rgba(255, 105, 180, 0.2);
    bottom: 10%;
    left: 30%;
  }
  
  @keyframes nebula-move {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(20px, 20px) rotate(360deg); }
  }
}

// 时钟容器
.clock-container {
  position: relative;
  width: 800px;
  height: 800px;
  z-index: 2;
  
  @media (max-width: 768px) {
    width: 400px;
    height: 400px;
  }
}

// 中心年份显示
.center-year {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(100, 181, 246, 1);
  z-index: 10;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
}

// 环形布局
.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(var(--ring-rotation, 0deg));
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.ring-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(100, 181, 246, 0.3);
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 0 10px rgba(100, 181, 246, 0.6);
  }
  
  &.active {
    color: #ffffff;
    text-shadow: 0 0 20px rgba(100, 181, 246, 1);
    font-weight: bold;
    animation: pulse 1s infinite ease-in-out;
  }
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

// 不同环的样式
.ring-1 {
  width: 250px;
  height: 250px;
  
  @media (max-width: 768px) {
    width: 125px;
    height: 125px;
  }
}

.ring-2 {
  width: 350px;
  height: 350px;
  
  @media (max-width: 768px) {
    width: 175px;
    height: 175px;
  }
}

.ring-3 {
  width: 450px;
  height: 450px;
  
  @media (max-width: 768px) {
    width: 225px;
    height: 225px;
  }
}

.ring-4 {
  width: 550px;
  height: 550px;
  
  @media (max-width: 768px) {
    width: 275px;
    height: 275px;
  }
}

.ring-5 {
  width: 650px;
  height: 650px;
  
  @media (max-width: 768px) {
    width: 325px;
    height: 325px;
  }
}

.ring-6 {
  width: 750px;
  height: 750px;
  
  @media (max-width: 768px) {
    width: 375px;
    height: 375px;
  }
}
</style>