<template>
  <view class="paper-container">
    <view class="header">
      <text class="title">部门报名问卷</text>
    </view>

    <view class="form-container">
      <view class="form-item">
        <text class="label">姓名</text>
        <input class="input" placeholder="请输入您的姓名" v-model="form.name" />
      </view>

      <view class="form-item">
        <text class="label">学号</text>
        <input class="input" placeholder="请输入您的学号" v-model="form.studentId" />
      </view>

      <view class="form-item">
        <text class="label">联系电话</text>
        <input class="input" placeholder="请输入您的联系电话" v-model="form.phone" />
      </view>

      <view class="form-item">
        <text class="label">报名部门</text>
        <text class="value">{{ departmentName }}</text>
      </view>

      <view class="form-item">
        <text class="label">申请理由</text>
        <textarea class="textarea" placeholder="请输入您的申请理由" v-model="form.reason"></textarea>
      </view>
    </view>

    <view class="btn-container">
      <button class="submit-btn" @click="submitForm">提交报名</button>
    </view>

    <!-- 底部导航 -->
    <view class="tab-bar">
      <view class="tab-item" @click="navigateToDepartment">部门展览</view>
      <view class="tab-item active" @click="navigateToPaper">已填报</view>
      <view class="tab-item" @click="navigateToInfo">个人中心</view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    // 表单数据
    const form = ref({
      name: '',
      studentId: '',
      phone: '',
      reason: ''
    });

    // 部门名称
    const departmentName = ref('产品部门');

    // 提交表单
    const submitForm = () => {
      // 简单验证
      if (!form.value.name || !form.value.studentId || !form.value.phone || !form.value.reason) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }

      // 模拟提交成功
      uni.showToast({
        title: '报名成功',
        icon: 'success'
      });

      // 3秒后返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    };

    // 模拟从路由获取部门信息
    const getDepartmentInfo = () => {
      // 实际项目中，这里会从路由参数或API获取部门信息
      // 这里使用模拟数据
      departmentName.value = '产品部门';
    };

    onMounted(() => {
      getDepartmentInfo();
    });

    // 跳转到部门列表
    const navigateToDepartment = () => {
      uni.navigateTo({
        url: '/pages/department/department'
      });
    };

    // 跳转到已填报页面
    const navigateToPaper = () => {
      // 当前页面，不需要跳转
    };

    // 跳转到个人中心
    const navigateToInfo = () => {
      uni.navigateTo({
        url: '/pages/info/info'
      });
    };

    return {
      form,
      departmentName,
      submitForm,
      navigateToDepartment,
      navigateToPaper,
      navigateToInfo
    };

    // 修复getCurrentPages未定义的问题
    function getCurrentPages() {
      return getApp().$children[0].$children;
    }
  }
};
</script>

<style lang="scss">
.paper-container {
  padding: 20rpx;
  padding-bottom: 100rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.form-container {
  margin-top: 120rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  height: 200rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.value {
  font-size: 28rpx;
  color: #666;
}

.btn-container {
  margin: 40rpx 20rpx;
}

.submit-btn {
  background-color: #e63946;
  color: #fff;
  font-size: 32rpx;
  border-radius: 60rpx;
  height: 88rpx;
  line-height: 88rpx;
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.tab-item {
  font-size: 28rpx;
  color: #999;
  text-align: center;
  padding: 10rpx 0;
}

.tab-item.active {
  color: #e63946;
  font-weight: bold;
}
</style>
