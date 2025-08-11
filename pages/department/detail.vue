<template>
  <view class="detail-container">
    <view class="header">
      <text class="title">部门详情</text>
    </view>

    <!-- 海报区域 -->
    <view class="poster-container">
      <image :src="departmentInfo.posterUrl || '/static/assets/detail.png'" mode="aspectFill"></image>
    </view>

    <!-- 部门介绍 -->
    <view class="intro-container">
      <view class="section-title">部门介绍</view>
      <view class="section-content">{{ departmentInfo.description || '暂无部门介绍' }}</view>
    </view>

    <!-- 部门职责 -->
    <view class="duty-container">
      <view class="section-title">部门职责</view>
      <view class="section-content">{{ departmentInfo.duties || '暂无部门职责信息' }}</view>
    </view>

    <!-- 问卷填报按钮 -->
    <view class="btn-container">
      <button class="submit-btn" @click="navigateToQuestionnaire">点击报名</button>
    </view>

    <!-- 底部导航 -->
    <view class="tab-bar">
      <view class="tab-item active" @click="navigateToDepartment">部门展览</view>
      <view class="tab-item" @click="navigateToPaper">已填报</view>
      <view class="tab-item" @click="navigateToInfo">个人中心</view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useFirstStore } from '@/stores/index.js';
// 移除接口请求依赖，使用模拟数据

export default {
  setup() {
    const store = useFirstStore();
    const departmentInfo = ref({});
    const questionnaireId = ref('');
    const departmentId = ref('');

    // 获取部门ID
    const getDepartmentId = () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      departmentId.value = currentPage.options.id || '';
    };

    // 加载状态
    const loading = ref(false);
    const errorMsg = ref('');

    // 跳转到问卷页面
    const navigateToQuestionnaire = () => {
      if (questionnaireId.value) {
        uni.navigateTo({
          url: `/pages/paper/paper?id=${questionnaireId.value}`
        });
      } else {
        uni.showToast({
          title: '该部门暂无问卷',
          icon: 'none'
        });
      }
    };

    onMounted(() => {
      getDepartmentId();
      // 直接设置模拟数据，不再调用fetchDepartmentDetail
      departmentInfo.value = {
        name: '产品部门',
        description: '产品部门负责公司所有产品的规划、设计和管理工作，确保产品满足用户需求并实现商业目标。',
        duties: '1. 负责产品的需求分析和规划\n2. 制定产品 roadmap\n3. 与设计、开发团队协作，推动产品落地\n4. 收集用户反馈，持续优化产品体验',
        posterUrl: '/static/assets/detail.png'
      };
      // 直接设置问卷ID，不再调用fetchQuestionnaire
      questionnaireId.value = 'mock_questionnaire_123';
      console.log('使用模拟问卷ID:', questionnaireId.value);
    });

    // 已清理不再需要的函数定义，避免潜在冲突

    // 跳转到部门列表
    const navigateToDepartment = () => {
      uni.navigateTo({
        url: '/pages/department/department'
      });
    };

    // 跳转到已填报页面
    const navigateToPaper = () => {
      uni.navigateTo({
        url: '/pages/paper/paper'
      });
    };

    // 跳转到个人中心
    const navigateToInfo = () => {
      uni.navigateTo({
        url: '/pages/info/info'
      });
    };

    return {
      departmentInfo,
      navigateToQuestionnaire,
      loading,
      navigateToDepartment,
      navigateToPaper,
      navigateToInfo
    };

    // 使用uni-app提供的getCurrentPages API
    const getCurrentPages = () => {
      return uni.getCurrentPages();
    };
  }
};
</script>

<style lang="scss">
.detail-container {
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

.poster-container {
  margin-top: 88rpx;
  width: 100%;
  height: 400rpx;
  overflow: hidden;
}

.poster-container image {
  width: 100%;
  height: 100%;
}

.intro-container,
.duty-container {
  margin: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid #eee;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
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