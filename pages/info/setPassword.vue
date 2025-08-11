<template>
	<view class="password-container">
		<view class="page-title">
			<text>设置密码</text>
		</view>

		<view class="form-list">
			<view class="form-item">
				<text class="form-label">原密码</text>
				<input class="form-input" v-model="oldPassword" placeholder="请输入原密码,若没有设置则空置" password="true" />
			</view>
			<view class="form-item">
				<text class="form-label">新密码</text>
				<input class="form-input" v-model="newPassword" placeholder="请输入新密码" password="true" />
			</view>
			<view class="form-item">
				<text class="form-label">确认密码</text>
				<input class="form-input" v-model="confirmPassword" placeholder="请再次输入新密码" password="true" />
			</view>
		</view>

		<view class="confirm-btn" @click="confirmSetPassword">
			<text>确认修改</text>
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
	export default {
		data() {
			return {
				oldPassword: '',
				newPassword: '',
				confirmPassword: ''
			}
		},
		methods: {
			confirmSetPassword() {
				if (!this.newPassword) {
					uni.showToast({
						title: '请输入新密码',
						icon: 'none'
					});
					return;
				}

				if (this.newPassword.length < 6) {
					uni.showToast({
						title: '密码长度不能少于6位',
						icon: 'none'
					});
					return;
				}

				if (this.newPassword !== this.confirmPassword) {
					uni.showToast({
						title: '两次输入的密码不一致',
						icon: 'none'
					});
					return;
				}
				this.updatePassword()
			},
			async updatePassword() {
				let response;
				console.log("现在修改个人密码");
				response = await request({
					url: "/user/update/password",
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': `Bearer ${token}`
					},
					data: {
						oldPassword: this.oldPassword,
						newPassword: this.newPassword
					}
				});
				if (response.code === 200) {
					uni.showToast({
						title: '密码修改成功',
						icon: 'success',
						duration: 2000,
						success: () => {
							setTimeout(() => {
								uni.navigateBack();
							}, 2000);
						}
					});
				};
				if (response.code === 400) {
					uni.showToast({
						title: response.msg,
						icon:'none',
						duration: 2000,

					});
				}
			},
			// 密码验证通过，可以调用API修改密码
			// 这里模拟修改成功

		}
	}
</script>

<style scoped>
	.password-container {
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

	.confirm-btn {
		background-color: #007aff;
		text-align: center;
		padding: 30rpx 0;
		border-radius: 16rpx;
		font-size: 32rpx;
		color: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		margin-top: 40rpx;
	}
</style>