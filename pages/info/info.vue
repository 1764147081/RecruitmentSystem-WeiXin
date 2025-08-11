<template>
	<view class="info-container">
		<!-- 用户信息头部 -->
		<view class="user-header">
			<view class="avatar-container">
				<image class="avatar" :src="avatar" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<text class="user-name">{{ name }}</text>
				<text class="user-desc">{{ profile }}</text>
			</view>
		</view>

		<!-- 编辑按钮 -->
		<view class="edit-btn" @click="toEditInfo">
			<text>编辑个人信息</text>
		</view>

		<!-- 个人信息列表 -->
		<view class="info-list">
			<view class="info-item">
				<text class="info-label">学院</text>
				<text class="info-value">{{ depart }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">专业</text>
				<text class="info-value">软件工程</text>
			</view>
			<view class="info-item">
				<text class="info-label">邮箱</text>
				<text class="info-value">{{ email }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">学号</text>
				<text class="info-value">{{ username }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">QQ</text>
				<text class="info-value">{{ qq }}</text>
			</view>
		</view>

		<!-- 退出登录按钮 -->
		<view class="logout-btn" @click="logout">
			<text>退出登录</text>
		</view>

		<!-- 底部导航 -->
		<view class="tab-bar">
			<view class="tab-item" @click="navigateToDepartment">部门展览</view>
			<view class="tab-item" @click="navigateToPaper">已填报</view>
			<view class="tab-item active" @click="navigateToInfo">个人中心</view>
		</view>
	</view>
</template>

<script>
	import {
		useFirstStore
	} from '@/stores/index.js';
	import {
		request
	} from '../../common/request';
	
	const token = wx.getStorageSync('authToken');
	// 初始化store
	const store = useFirstStore();
	export default {
		data() {
			return {
				username: '',
				depart: '',
				name: '',
				email: '',
				qq: '',
				avatar: '',
				profile: ''
			}
		},
		methods: {
			toEditInfo() {
				// 跳转到编辑信息页面
				uni.navigateTo({
					url: '/pages/info/edit'
				});
			},
			logout() {
				// 退出登录逻辑
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							// 调用store的logout方法清除所有登录状态
							store.logout();
							// 跳转到登录页
							uni.redirectTo({
								url: '/pages/login/login'
							});
						}
					}
				});
			},

			// 跳转到部门列表
			navigateToDepartment() {
				uni.navigateTo({
					url: '/pages/department/department'
				});
			},

			// 跳转到已填报页面
			navigateToPaper() {
				uni.navigateTo({
					url: '/pages/paper/paper'
				});
			},

			// 跳转到个人中心
			navigateToInfo() {
				// 当前页面，不需要跳转
			},
			async getUserInfo() {
				let response;
				console.log("现在获取个人信息");
				console.log(token);
				response = await request({
					url: "/user/info",
					method: 'GET',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': `Bearer ${token}`
					}
				});
				// 处理响应数据
				if (response && response.data) {
					this.username = response.data.username || '';
					this.depart = response.data.depart || '';
					this.name = response.data.name || '';
					this.email = response.data.email || '';
					this.qq = response.data.qq || '';
					this.avatar = response.data.avatar || '/static/assets/nav_icon_avatar_nor.png';
					this.profile = response.data.profile || '这个人很懒，什么都没有写';
				}
			}
		},
		onLoad() {
			this.getUserInfo();
		}
	}
</script>

<style scoped>
	.info-container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.user-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx 0;
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.avatar-container {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 4rpx solid #eee;
		margin-bottom: 20rpx;
	}

	.avatar {
		width: 100%;
		height: 100%;
	}

	.user-info {
		text-align: center;
	}

	.user-name {
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
	}

	.user-desc {
		font-size: 28rpx;
		color: #999;
	}

	.info-list {
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.info-item:last-child {
		border-bottom: none;
	}

	.info-label {
		font-size: 30rpx;
		color: #333;
	}

	.info-value {
		font-size: 30rpx;
		color: #666;
		text-align: right;
	}

	.edit-btn {
		background-color: #007aff;
		text-align: center;
		padding: 25rpx 0;
		border-radius: 16rpx;
		font-size: 32rpx;
		color: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
	}

	.logout-btn {
		background-color: #fff;
		text-align: center;
		padding: 25rpx 0;
		border-radius: 16rpx;
		font-size: 32rpx;
		color: #e64340;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 120rpx;
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