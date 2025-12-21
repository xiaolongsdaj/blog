<template>
  <div class="tab-content">
    <h2 class="tab-title">账号设置</h2>
    <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px" class="settings-form">
      <el-form-item label="当前密码" prop="currentPassword">
        <el-input v-model="passwordForm.currentPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePassword">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '../../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits<{
  refresh: []
}>()

const passwordFormRef = ref()
const userStore = useUserStore()

// 密码修改表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证确认密码
const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 密码验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,20}$/, message: '密码必须包含字母,符号和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, message: '两次输入的密码不一致', trigger: 'blur' }
  ]
}

// 修改密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    // 表单验证
    await passwordFormRef.value.validate()
    
    // 调用用户存储中的修改密码方法
    const success = await userStore.updatePassword(passwordForm.currentPassword, passwordForm.newPassword)
    
    if (success) {
      ElMessage.success('密码修改成功')
    } else {
      throw new Error('密码修改失败')
    }
    
    // 重置表单
    resetPasswordForm()
    emit('refresh')
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改密码失败，请稍后重试')
  }
}

// 重置密码表单
const resetPasswordForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
  
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
}
</script>

<style scoped>
.settings-form {
  max-width: 500px;
  margin-top: 20px;
}
</style>