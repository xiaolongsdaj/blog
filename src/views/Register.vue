<template>
  <div class="register-page">
    <div class="container">
      <div class="register-card">
        <div class="register-header">
          <h1 class="register-title">
            注册
          </h1>
         
        </div>

        <div class="register-form">
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="0">
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                size="large"
                prefix-icon="User"
              ></el-input>
            </el-form-item>

            <!-- 邮箱 -->
            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                type="email"
                placeholder="请输入邮箱"
                size="large"
                prefix-icon="Message"
              ></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                prefix-icon="Lock"
                show-password
              ></el-input>
            </el-form-item>

            <!-- 确认密码 -->
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                size="large"
                prefix-icon="Lock"
                show-password
              ></el-input>
            </el-form-item>

            <!-- 注册协议 -->
            <el-form-item prop="agreement">
              <el-checkbox v-model="registerForm.agreement">
                我已阅读并同意 <a href="#" class="agreement-link">《用户注册协议》</a>
              </el-checkbox>
            </el-form-item>

            <!-- 注册按钮 -->
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="register-btn"
                @click="handleRegister"
                :loading="registering"
              >
                注册
              </el-button>
            </el-form-item>

            <!-- 登录链接 -->
            <div class="login-link-container">
              <span>已有账号？</span>
              <router-link to="/login" class="login-link">立即登录</router-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const registerFormRef = ref()

// 注册状态
const registering = ref(false)

// 注册表单
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 验证确认密码
const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 验证注册协议
const validateAgreement = (_rule: any, value: boolean, callback: any) => {
  if (!value) {
    callback(new Error('请阅读并同意用户注册协议'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '用户名长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,20}$/, message: '密码必须包含字母,符号和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
}



// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  // console.log(111111,registerFormRef.value.username)
  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      registering.value = true
      try {
        const res = await userStore.register(registerForm.username, registerForm.email, registerForm.password, registerForm.confirmPassword)
        console.log(222,res)
        ElMessage.success('注册成功')
        
        router.push('/login')
      } catch (error) {
        console.error('注册失败:', error)
        ElMessage.error('注册失败，请稍后重试')
      } finally {
        registering.value = false
      }
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
.register-page {
  // background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

.register-card {
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

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;

  .el-icon {
    color: #f56c6c;
    font-size: 1.5rem;
  }
}

.register-subtitle {
  color: #909399;
  font-size: 1rem;
}

.register-form {
  margin-bottom: 20px;
}

.register-form .el-input {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.register-form .el-form-item {
  margin-bottom: 25px;
}

.register-form .el-form-item:last-child {
  margin-bottom: 0;
}

.agreement-link {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #66b1ff;
  }
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
  }
}

.login-link-container {
  text-align: center;
  margin-top: 20px;
  color: #909399;
  font-size: 0.9rem;
}

.login-link {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
  transition: color 0.3s ease;

  &:hover {
    color: #66b1ff;
  }
}
</style>