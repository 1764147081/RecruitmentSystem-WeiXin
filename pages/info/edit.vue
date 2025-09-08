<template>
	<view class="edit-container">
		<u-navbar 
			title="编辑个人信息" 
			left-icon="arrow-left" 
			auto-back
			bg-color="#F8F8F8"
			title-color="#000000"
			:border="false"
		>
		</u-navbar>

		<view class="avatar-container">
			<image class="avatar" :src="previewImage || userInfo.avatar || '/static/assets/logo.png'" mode="aspectFill">
			</image>
			<view class="upload-btn" @click="uploadAvatar">
				<text>上传头像</text>
			</view>
		</view>


		<view class="form-list">
			<view class="form-item">
				<text class="form-label">个人描述</text>
				<input class="form-input" v-model="userInfo.profile" placeholder="请输入个人描述" />
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
		Logger
	} from 'sass';
	import {
		request
	} from '../../common/request';
	import {
		baseUrl
	} from '../../common/request';

	export default {
		data() {
			return {
				userInfo: {
					profile: '',
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
				const token = uni.getStorageSync('authToken');
				const response = await request({
					url: '/user/update/info',
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: JSON.stringify({
						profile: this.userInfo.profile,
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
								uni.reLaunch({
									url: '/pages/info/info'
								});
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
				const token = uni.getStorageSync('authToken');
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
						profile: response.data.profile || '',
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
						// 检查用户是否选择了图片
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) {
							console.log('用户未选择图片');
							return;
						}
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
					},
					fail: (err) => {
						console.error('选择图片失败:', err);
						uni.showToast({
							title: '选择图片失败',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			uploadFile(filePath) {
				const token = uni.getStorageSync('authToken');
				if (!token) {
					uni.showToast({
						title: '未找到认证令牌',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				uni.showLoading({
					title: '上传中...'
				});

				// 使用uni.uploadFile上传文件
				const uploadRes = uni.uploadFile({
						url: baseUrl + '/user/upload/avatar',
						filePath: filePath,
						name: 'file',
						header: {
							'Authorization': `Bearer ${token}`
						},
					})
					.then((uploadRes) => {
						uni.hideLoading();
						console.log(uploadRes)
						if (uploadRes.statusCode === 200) {
							console.log('上传头像返回的res:', uploadRes);
							try {
								const response = JSON.parse(uploadRes.data);
								if (response.code === 200 ) {
									// 更新头像
									this.userInfo.avatar = response.data;
									uni.showToast({
										title: '上传成功',
										icon: 'success',
										duration: 2000
									});
								} else {
									const errorMsg = response.message || response.data || '上传失败';
									console.error('上传失败:', errorMsg);
									uni.showToast({
										title: errorMsg,
										icon: 'none',
										duration: 2000
									});
								}
							} catch (error) {
								console.error('解析响应失败:', error);
								uni.showToast({
									title: '上传失败',
									icon: 'none',
									duration: 2000
								});
							}
						}
					})
			}
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