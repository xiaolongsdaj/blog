<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo">
            <el-icon><Document /></el-icon>
            <span>个人博客</span>
          </div>
          <p class="footer-description">
            分享技术心得，记录生活点滴
          </p>
        </div>
        
        <div class="footer-links">
          <h4>快速链接</h4>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/category">分类</router-link></li>
            <li><router-link to="/tag">标签</router-link></li>
            <li><router-link to="/about">关于</router-link></li>
          </ul>
        </div>
        
        <div class="footer-contact">
          <h4>联系方式</h4>
          <ul>
            <li>
              <el-icon><ChatDotRound /></el-icon>
              <span>875634304@qq.com</span>
            </li>
            <li>
              <el-icon><Link /></el-icon>
              <a href="https://github.com/xiaolongsdaj" target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
            <!-- <li>
              <el-icon><Link /></el-icon>
              <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </li> -->
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} 个人博客. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 获取当前年份
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped lang="scss">
.footer {
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
  padding: 40px 0 20px;
  color: #606266;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #333;

  @media (max-width: 768px) {
    justify-content: center;
  }

  .el-icon {
    font-size: 24px;
    color: #409eff;
  }
}

.footer-description {
  line-height: 1.6;
  margin: 0;
}

.footer-links, .footer-contact {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-links h4, .footer-contact h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.footer-links ul, .footer-contact ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a, .footer-contact a {
  color: #606266;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #409eff;
  }
}

.footer-contact li {
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  font-size: 14px;
  color: #909399;
}
</style>