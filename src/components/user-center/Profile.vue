<template>
  <div class="profile-container">
    <div class="tab-content">
      <h2 class="tab-title">个人信息</h2>
      <el-form :model="userInfo" :rules="profileRules" ref="profileFormRef" label-width="120px" class="profile-form">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :http-request="handleAvatarUpload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserProfile">保存修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'

interface UserInfo {
  id: number;
  username: string;
  avatar?: string;
  email: string;
}

const props = defineProps<{
  initialUserInfo: UserInfo;
}>();

const emit = defineEmits<{
  (e: 'update', userInfo: UserInfo): void;
}>();

const userStore = useUserStore()
const profileFormRef = ref()

// 用户信息表单
const userInfo = reactive<UserInfo>({
  ...props.initialUserInfo
});

// 用户信息表单验证规则
const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '用户名长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
};

// 更新用户信息
const updateUserProfile = async () => {
  if (!profileFormRef.value && !profileFormRef.value.username) return;
  // console.log(111111111111111111111, profileFormRef.value)
  
  try {
    // 表单验证
    await profileFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        // 创建要更新的数据对象，只包含可编辑字段
        const updateData = {
          id: profileFormRef.value.id,
          email: profileFormRef.value.email,
          avatar: profileFormRef.value.avatar
          // username保持不变，不发送到后端
        };
        
        await userStore.updateUserInfo(updateData);
        ElMessage.success('个人信息更新成功');
        emit('update', userInfo);
      }
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    ElMessage.error('更新失败，请稍后重试');
  }
};

// 头像上传
const handleAvatarUpload = async (req: any) => {
  const file = req.file;
  try {
    // 假设 userStore 中已有上传头像的 action，若不存在需自行实现
    // 假设 userStore 没有 uploadAvatar 方法，直接调用 updateUserInfo 更新头像
    const avatarUrl = await userStore.updateUserInfo({ avatar: file });
    if (avatarUrl) {
      // 更新本地用户信息
      userInfo.avatar = typeof avatarUrl === 'string' ? avatarUrl : avatarUrl.avatar;
      ElMessage.success('头像上传成功');
      emit('update', userInfo);
    } else {
      ElMessage.error('头像上传失败');
    }
  } catch (error) {
    console.error('头像上传失败:', error);
    ElMessage.error('头像上传失败，请稍后重试');
  }
};

// 头像上传前验证
const beforeAvatarUpload = (file: any) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片格式！');
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！');
  }

  return isImage && isLt2M;
};
</script>

<style scoped lang="scss">
.profile-container {
  height: 100%;
  overflow-y: auto;
}

.tab-content {
  min-height: 400px;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
}

/* 个人信息表单 */
.profile-form {
  max-width: 600px;

  .el-form-item {
    margin-bottom: 25px;
  }

  .avatar-uploader {
    text-align: center;

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      cursor: pointer;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>