<template>
  <div class="login-page">
    <div class="container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">
            登录
          </h1>
        </div>

        <div class="login-form">
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="0">
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                size="large"
                prefix-icon="User"
              ></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                prefix-icon="Lock"
                show-password
              ></el-input>
            </el-form-item>

            <!-- 记住我 -->
            <el-form-item>
              <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
              <router-link to="/register" class="register-link">还没有账号？立即注册</router-link>
            </el-form-item>

            <!-- 登录按钮 -->
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="login-btn"
                @click="handleLogin"
                :loading="loggingIn"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref()

// 登录状态
const loggingIn = ref(false)

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 10, message: '用户名长度在 6 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  rememberMe: [
    { required: true, message: '请选择是否记住我', trigger: 'change' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
          if (valid) {
            // console.log('表单验证通过，准备登录:', loginForm)
            loggingIn.value = true
            try {
              const loginSuccess = await userStore.login(loginForm.username, loginForm.password)
              // console.log('登录结果:', loginSuccess)
              // console.log('登录后用户状态:', {
              //   isLoggedIn: userStore.isLoggedIn,
              //   userInfo: userStore.userInfo,
              //   token: userStore.token
              // })
              
              if (loginSuccess) {
                ElMessage.success('登录成功')
                // 获取跳转地址，如果没有则跳转到首页
                const redirect = route.query.redirect as string || '/'
                router.push(redirect)
              } else {
                ElMessage.error('登录失败，请检查用户名和密码是否正确')
              }
            } catch (error) {
              console.error('登录失败:', error)
              ElMessage.error('登录失败，请检查用户名和密码是否正确')
            } finally {
              loggingIn.value = false
            }
          } else {
            // console.log('表单验证失败')
          }
        })
}

// 初始化
onMounted(() => {
  // 如果已经登录，则跳转到首页
  if (userStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped lang="scss">
.login-page {
  // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  max-width: 500px;
  width: 100%;
}

.login-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;

  .el-icon {
    color: #409eff;
    font-size: 1.5rem;
  }
}

.login-subtitle {
  color: #909399;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 20px;
}

.login-form .el-input {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.login-form .el-form-item {
  margin-bottom: 25px;
}

.login-form .el-form-item:last-child {
  margin-bottom: 0;
}

.register-link {
  float: right;
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #66b1ff;
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }
}
//解决输入框自动填充背景颜色问题得几种方式

/* 综合解决方案，兼容性最好 */
// :deep(.el-input__inner:-webkit-autofill) {
//   -webkit-text-fill-color: #190404 !important;
//   -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
//   transition: background-color 5000s ease-in-out 0s !important;
// }

// 使用 box-shadow 覆盖背景色（推荐）
:deep(.el-input__inner:-webkit-autofill) {
  -webkit-text-fill-color: #190404;
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  box-shadow: 0 0 0px 1000px white inset !important;
}

</style>