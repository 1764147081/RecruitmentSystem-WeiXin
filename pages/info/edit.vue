<template>
	<view class="edit-container">
		<view class="page-title">
			<text>编辑个人信息</text>
		</view>

		<view class="avatar-container">
			<image class="avatar" :src="previewImage || userInfo.avatar || '/static/assets/logo.png'" mode="aspectFill"></image>
			<view class="upload-btn" @click="uploadAvatar">
				<text>上传头像</text>
			</view>
		</view>


		<view class="form-list">
			<view class="form-item">
				<text class="form-label">姓名</text>
				<input class="form-input form-input-readonly" v-model="userInfo.name" placeholder="请输入姓名" readonly />
			</view>
			<view class="form-item">
				<text class="form-label">个人描述</text>
				<input class="form-input" v-model="userInfo.profile" placeholder="请输入个人描述" />
			</view>
			<view class="form-item">
				<text class="form-label">学院</text>
				<input class="form-input form-input-readonly" v-model="userInfo.depart" placeholder="请输入学院" readonly />
			</view>
			<view class="form-item">
				<text class="form-label">专业</text>
				<input class="form-input" v-model="userInfo.major" placeholder="请输入专业" />
			</view>
			<view class="form-item">
				<text class="form-label">邮箱</text>
				<input class="form-input" v-model="userInfo.email" placeholder="请输入邮箱" type="email" />
			</view>
			<view class="form-item">
				<text class="form-label">QQ</text>
				<input class="form-input" v-model="userInfo.qq" placeholder="请输入QQ" />
			</view>
		</view>

		<view class="password-btn" @click="toSetPassword">
			<text>设置密码</text>
		</view>

		<view class="save-btn" @click="saveAndReturn">
			<text>保存并返回</text>
		</view>
	</view>
</template>

<script>
	import {
		request
	} from '../../common/request';
	import { baseUrl } from '../../common/request';

	export default {
		data() {
			return {
				userInfo: {
					name: '',
					profile: '',
					depart: '',
					major: '',
					email: '',
					qq: '',
					avatar: ''
				},
				previewImage: '' // 用于头像预览
			}
		},
		onLoad() {
			// 加载用户信息
			this.getUserInfo();
		},
		methods: {
			toSetPassword() {
				// 跳转到设置密码页面
				uni.navigateTo({
					url: '/pages/info/setPassword'
				});
			},
			async saveAndReturn() {
				// 保存用户信息
				const token = wx.getStorageSync('authToken');
				const response = await request({
					url: '/user/update/info',
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: JSON.stringify({
						name: this.userInfo.name,
						profile: this.userInfo.profile,
						depart: this.userInfo.depart,
						major: this.userInfo.major,
						email: this.userInfo.email,
						qq: this.userInfo.qq
					})
				});

				if (response.code === 200) {
					uni.showToast({
						title: '保存成功',
						icon: 'success',
						duration: 2000,
						success: () => {
							setTimeout(() => {
								uni.navigateBack();
							}, 2000);
						}
					});
				} else {
					uni.showToast({
						title: response.data.message || '保存失败',
						icon: 'none',
						duration: 2000
					});
				}
			},

			async getUserInfo() {
				const token = wx.getStorageSync('authToken');
				const response = await request({
					url: '/user/info',
					method: 'GET',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': `Bearer ${token}`
					}
				});
				if (response.data) {
					this.userInfo = {
						name: response.data.name || '',
						profile: response.data.profile || '',
						depart: response.data.depart || '',
						major: response.data.major || '',
						email: response.data.email || '',
						qq: response.data.qq || '',
						avatar: response.data.avatar || ''
					};
				}
			},


			closePreview() {
				this.previewImage = '';
			},
			uploadAvatar() {
				// 选择图片
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// 检查文件大小是否超过10MB
						const file = res.tempFiles[0];
						const MAX_SIZE = 10 * 1024 * 1024; // 10MB

						if (file.size > MAX_SIZE) {
							uni.showToast({
								title: '文件大小不能超过10MB',
								icon: 'none',
								duration: 2000
							});
							return;
						}

						const tempFilePath = res.tempFilePaths[0];
					// 设置预览图片路径
					this.previewImage = tempFilePath;
					// 上传图片
					this.uploadFile(tempFilePath);
					}
				});
			},
			async uploadFile(filePath) {
				try {
					const token = wx.getStorageSync('authToken');
					uni.showLoading({
						title: '上传中...'
					});

					const response = await new Promise((resolve, reject) => {
						uni.uploadFile({
								url: baseUrl + '/user/upload/avatar',
								filePath: filePath,
								name: 'file',
								header: {
									'Authorization': `Bearer ${token}`,
									'content-type': 'multipart/form-data'
								},
							success: (uploadRes) => {
								try {
									const data = JSON.parse(uploadRes.data);
									resolve(data);
								} catch (e) {
									reject(new Error('上传失败，响应格式不正确'));
								}
							},
							fail: (err) => {
								reject(err);
							},
							complete: () => {
								uni.hideLoading();
							}
						});
					});

					if (response.code === 200) {
						// 更新头像
						this.userInfo.avatar = response.data.avatarUrl;
						uni.showToast({
							title: '上传成功',
							icon: 'success',
							duration: 2000
						});
					} else {
						uni.showToast({
							title: response.message || '上传失败',
							icon: 'none',
							duration: 2000
						});
					}
				} catch (error) {
					console.error('上传头像失败:', error);
					uni.hideLoading();
					uni.showToast({
						title: '上传失败，请重试',
						icon: 'none',
						duration: 2000
					});
				}

			},

		}
	}
</script>

<style scoped>
	.edit-container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.page-title {
		text-align: center;
		font-size: 36rpx;
		font-weight: bold;
		padding: 30rpx 0;
		background-color: #fff;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.avatar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		padding: 30rpx 0;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.avatar {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
		border: 2rpx solid #eee;
	}

	.upload-btn {
		background-color: #007aff;
		padding: 15rpx 40rpx;
		border-radius: 50rpx;
		font-size: 28rpx;
		color: #fff;
	}

	.form-list {
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.form-item {
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.form-item:last-child {
		border-bottom: none;
	}

	.form-label {
		font-size: 30rpx;
		color: #333;
		width: 180rpx;
	}

	.form-input {
			flex: 1;
			font-size: 30rpx;
			color: #666;
		}

		.form-input-readonly {
			flex: 1;
			font-size: 30rpx;
			color: #999;
			background-color: #f5f5f5;
			cursor: not-allowed;
		}

	.password-btn {
		background-color: #007aff;
		text-align: center;
		padding: 30rpx 0;
		border-radius: 16rpx;
		font-size: 32rpx;
		color: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		margin-top: 20rpx;
	}

	.save-btn {
		background-color: #e64340;
		text-align: center;
		padding: 30rpx 0;
		border-radius: 16rpx;
		font-size: 32rpx;
		color: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		margin-top: 20rpx;
	}
	
</style>