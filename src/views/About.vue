<template>
  <div class="about-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>关于我</h1>
        <p>个人简介与经历</p>
      </div>

      <!-- 个人介绍 -->
      <section class="about-section">
        <div class="about-content">
          <div class="about-avatar">
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20portrait&image_size=square" alt="个人头像" />
          </div>
          <div class="about-info">
            <h2>你好，我是开发者</h2>
            <p class="about-description">
              我是一名热爱技术的全栈开发工程师，专注于前端和后端技术的研究与应用。
              我喜欢通过技术解决实际问题，不断学习和探索新的技术领域。
              这个博客是我分享技术心得、生活感悟的地方，希望能与大家一起成长。
            </p>
            <div class="about-stats">
              <div class="stat-item">
                <div class="stat-value">5+</div>
                <div class="stat-label">年开发经验</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">20+</div>
                <div class="stat-label">完成项目</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">10+</div>
                <div class="stat-label">技术栈</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="contact-section">
        <h2 class="section-title">
          <el-icon><Phone /></el-icon>
          联系方式
        </h2>
        <div class="contact-content">
          <div class="contact-item">
            <el-icon><Message /></el-icon>
            <span>邮箱：contact@example.com</span>
          </div>
          <div class="contact-item">
            <el-icon><Position /></el-icon>
            <span>地址：北京市朝阳区</span>
          </div>
          <div class="contact-item">
            <el-icon><Link /></el-icon>
            <span>GitHub：<a href="#" target="_blank">github.com/username</a></span>
          </div>
          <div class="contact-item">
            <el-icon><ChatLineRound /></el-icon>
            <span>微信：wechat_username</span>
          </div>
        </div>
      </section>

      <!-- 我的经历 -->
      <section class="experience-section">
        <h2 class="section-title">
          <el-icon><Timer /></el-icon>
          我的经历
        </h2>
        <div class="experience-content">
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-date">2020 - 至今</div>
              <div class="timeline-content">
                <h3>高级全栈开发工程师</h3>
                <p class="timeline-company">某科技公司</p>
                <p class="timeline-description">
                  负责公司核心产品的前后端开发，参与技术架构设计，带领团队完成多个重要项目。
                  技术栈：Vue.js、Node.js、MongoDB、Redis等。
                </p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">2018 - 2020</div>
              <div class="timeline-content">
                <h3>前端开发工程师</h3>
                <p class="timeline-company">某互联网公司</p>
                <p class="timeline-description">
                  负责公司Web应用的前端开发，参与项目需求分析和UI设计，实现了多个响应式页面。
                  技术栈：React、Redux、TypeScript等。
                </p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">2014 - 2018</div>
              <div class="timeline-content">
                <h3>计算机科学与技术</h3>
                <p class="timeline-company">某大学</p>
                <p class="timeline-description">
                  学习计算机基础理论和编程技能，参与多个校园项目，获得优秀毕业生称号。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 项目经历 -->
      <section class="projects-section">
        <h2 class="section-title">
          <el-icon><Notebook /></el-icon>
          项目经历
        </h2>
        <div class="projects-content">
          <div class="project-item">
            <div class="project-info">
              <h3>个人博客系统</h3>
              <p class="project-date">2023 - 至今</p>
              <p class="project-description">
                基于Vue 3和Node.js开发的个人博客系统，支持文章发布、分类管理、标签管理、评论等功能。
                技术栈：Vue 3、TypeScript、Express、MongoDB。
              </p>
            </div>
          </div>
          <div class="project-item">
            <div class="project-info">
              <h3>电商管理系统</h3>
              <p class="project-date">2021 - 2022</p>
              <p class="project-description">
                为某电商公司开发的后台管理系统，支持商品管理、订单管理、用户管理等功能。
                技术栈：React、Redux、Node.js、MySQL。
              </p>
            </div>
          </div>
          <div class="project-item">
            <div class="project-info">
              <h3>移动应用前端</h3>
              <p class="project-date">2019 - 2020</p>
              <p class="project-description">
                为某金融公司开发的移动应用前端，实现了账户管理、交易查询等功能。
                技术栈：React Native、Redux、TypeScript。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Phone, Message, Position, Link, ChatLineRound, Timer, Notebook } from '@element-plus/icons-vue'

onMounted(() => {
  // 页面加载时的逻辑
  document.title = '关于我 - 个人博客'
})
</script>

<style scoped lang="scss">
.about-page {
  padding: 20px 0;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #303133;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.1rem;
    color: #606266;
  }
}

.about-section {
  margin-bottom: 60px;

  .about-content {
    display: flex;
    gap: 40px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    padding: 40px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20px;
    }
  }

  .about-avatar {
    flex-shrink: 0;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #409eff;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .about-info {
    flex: 1;

    h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      color: #303133;
    }

    .about-description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #606266;
      margin-bottom: 30px;
    }

    .about-stats {
      display: flex;
      gap: 30px;

      @media (max-width: 768px) {
        justify-content: center;
      }

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #409eff;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #909399;
        }
      }
    }
  }
}

.contact-section,
.experience-section,
.projects-section {
  margin-bottom: 60px;

  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.5rem;
    margin-bottom: 30px;
    color: #303133;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.contact-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 30px;

  .contact-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    font-size: 1.1rem;
    color: #606266;

    &:last-child {
      margin-bottom: 0;
    }

    .el-icon {
      font-size: 1.2rem;
      color: #409eff;
    }

    a {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.experience-content {
  .timeline {
    position: relative;
    padding-left: 30px;

    &::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: #e4e7ed;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 40px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      padding: 25px;

      &::before {
        content: '';
        position: absolute;
        left: -35px;
        top: 30px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #409eff;
        border: 3px solid #ecf5ff;
      }

      &:last-child {
        margin-bottom: 0;
      }

      .timeline-date {
        font-size: 0.9rem;
        color: #909399;
        margin-bottom: 10px;
      }

      h3 {
        font-size: 1.2rem;
        margin-bottom: 5px;
        color: #303133;
      }

      .timeline-company {
        font-size: 1rem;
        color: #409eff;
        margin-bottom: 15px;
      }

      .timeline-description {
        font-size: 1rem;
        line-height: 1.6;
        color: #606266;
      }
    }
  }
}

.projects-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;

  .project-item {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    padding: 25px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    h3 {
      font-size: 1.2rem;
      margin-bottom: 10px;
      color: #303133;
    }

    .project-date {
      font-size: 0.9rem;
      color: #909399;
      margin-bottom: 15px;
    }

    .project-description {
      font-size: 1rem;
      line-height: 1.6;
      color: #606266;
    }
  }
}

@media (max-width: 768px) {
  .about-content,
  .contact-content,
  .timeline-item,
  .project-item {
    padding: 20px;
  }

  .about-stats {
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>