<template>
	<view class="user-info-container">
		<u-navbar 
			title="用户信息" 
			left-icon="arrow-left" 
			auto-back
			bg-color="#F8F8F8"
			title-color="#000000"
			:border="false"
		>
		</u-navbar>
		<!-- 用户信息头部 -->
		<view class="user-header">
			<view class="avatar-container">
				<image class="avatar" :src="avatar" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<text class="user-name">{{ name || username }}</text>
				<text class="user-desc">{{ profile || '这个人很懒，什么都没有写' }}</text>
			</view>
		</view>

		<!-- 个人信息列表 -->
		<view class="info-list">
			<view class="info-item">
				<text class="info-label">学院</text>
				<text class="info-value">{{ college }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">专业</text>
				<text class="info-value">{{major}}</text>
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
			<view class="info-item">
				<text class="info-label">Tag</text>
				<text class="info-value">{{ tag }}</text>
			</view>
			<view class="tag-buttons">
				<button class="tag-button delete-button" @click="deleteTag">清空Tag</button>
				<button class="tag-button edit-button" @click="editTag">修改Tag</button>
			</view>
		</view>

		<!-- 查看问卷按钮 -->
		<view class="view-questionnaire-btn" @click="viewQuestionnaire(username,questionnaireId)">
			<text class="btn-text">查看所填问卷内容</text>
		</view>

	</view>
</template>

<script>
	import {
		request
	} from '../../common/request';
	import {
		useRoute
	} from 'vue-router'
	import {
		useDepartStore
	} from '../../stores/department';

	export default {
		data() {
			return {
				username: '',
				college: '',
				name: '',
				email: '',
				qq: '',
				major:'',
				avatar: '',
				profile: '',
				questionnaires: [],
				questionnaireId: '',
				departmentDetail: {},
				tag: '',
				tagId: null
			}
		},
		methods: {
			viewQuestionnaire(username, questionnaireId) {
				uni.navigateTo({
					url: `/pages/department/user-questionnaires?username=${username}&questionnaireId=${questionnaireId}`
				});
			},
			async getTag() {
				const token = uni.getStorageSync('authToken');
				try {
					const res = await request({
						url: `/tag/view?username=${this.username}&departId=${this.departmentDetail.id}`,
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'Authorization': `Bearer ${token}`
						}
					})
					if (res.data !== null) {
						this.tag = res.data.value || '';
						this.tagId = res.data.id
					}
					if (res.data = null) {

					}
				} catch (error) {
					console.error('获取标签信息失败:', error);
					this.tag = '';

				}
			},
			/**
			 * 删除用户标签
			 */
			async deleteTag() {
				const token = uni.getStorageSync('authToken');
				try {
					const res = await request({
						url: `/tag/delete?tagId=${this.tagId}`,
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'Authorization': `Bearer ${token}`
						},
						method: 'DELETE'
					});

					if (res.code === 200) {
						this.tag = '';
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
					} else {
						if (this.tag === '') {
							uni.showToast({
								title: '没有发现tag呢~',
								icon: 'none'
							});
						}
					}
				} catch (error) {
					console.error('删除标签失败:', error);
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
				}
			},
			/**
			 * 修改用户标签
			 */
			async editTag() {
				if (this.tag !== '') {
					uni.showToast({
						title: '请先清空tag',
						icon: 'none'
					});
				} else {
					const newTag = prompt('请输入新的标签:', this.tag);
					if (newTag === null) return; // 用户取消操作

					const token = uni.getStorageSync('authToken');
					try {
						const res = await request({
							url: `/tag/create?username=${this.username}&departId=${this.departmentDetail.id}&value=${newTag}`,
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								'Authorization': `Bearer ${token}`
							},
							method: 'POST'
						});

						if (res.code === 200) {
							this.tag = newTag;
							uni.showToast({
								title: '修改成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: '修改失败',
								icon: 'none'
							});
						}
					} catch (error) {
						console.error('修改标签失败:', error);
						uni.showToast({
							title: '修改失败',
							icon: 'none'
						});
					}
				}
			},
			async getUserInfoByUsername(username) {
				// 从本地存储获取token
				const token = uni.getStorageSync('authToken');

				// 发起请求获取用户信息
				let response;
				try {
					response = await request({
						url: `/user/info?username=${username}`,
						method: 'GET',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'Authorization': `Bearer ${token}`
						}
					});

					// 处理响应数据
					if (response && response.data) {
						this.username = response.data.username || '';
						this.college = response.data.college || '';
						this.name = response.data.name || '';
						this.email = response.data.email || '';
						this.qq = response.data.qq || '';
						this.avatar = response.data.avatar || '/static/assets/nav_icon_avatar_nor.png';
						this.profile = response.data.profile || '这个人很懒，什么都没有写';
						this.major = response.data.major
						await this.getTag()
					}
				} catch (error) {
					console.error('获取用户信息失败:', error);
					uni.showToast({
						title: '获取用户信息失败',
						icon: 'none'
					});
				}
			},
		},


		onLoad(options) {
			// 获取传递的用户名参数
			const username = options.username;
			const route = useRoute()
			this.questionnaireId = route.query.questionnaireId
			// 如果有用户名参数，则获取该用户的信息
			if (username) {
				this.getUserInfoByUsername(username);
			}

			// 通过Pinia获取部门信息并输出到控制台
			const departStore = useDepartStore();
			this.departmentDetail = departStore.getDepartmentDetail();

		}
	}
</script>

<style scoped>
	.user-info-container {
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
		margin-bottom: 20rpx;
	}

	.avatar {
		width: 100%;
		height: 100%;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-name {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.user-desc {
		font-size: 28rpx;
		color: #666;
	}

	.info-list {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
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
	}

	.view-questionnaire-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(90deg, #007AFF, #00D4FF);
		border-radius: 50rpx;
		margin: 40rpx 20rpx;
		padding: 20rpx 0;
		box-shadow: 0 4rpx 10rpx rgba(0, 122, 255, 0.3);
		transition: all 0.3s ease;
	}

	.tag-buttons {
		display: flex;
		justify-content: space-around;
		margin: 20rpx 0;
	}

	.tag-button {
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		border: none;
		color: white;
		font-size: 28rpx;
		cursor: pointer;
	}

	.delete-button {
		background-color: #ff4d4f;
	}

	.edit-button {
		background-color: #1890ff;
	}

	.view-questionnaire-btn:hover {
		transform: translateY(-4rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.4);
	}

	.btn-text {
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
	}

	.questionnaire-list {
		margin-top: 20rpx;
	}

	.questionnaire-item {
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.questionnaire-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.questionnaire-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.questionnaire-date {
		font-size: 24rpx;
		color: #999;
	}

	.questionnaire-content {
		margin-top: 10rpx;
	}

	.questionnaire-description {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}

	.answers-list {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #eee;
	}

	.answer-item {
		margin-bottom: 20rpx;
	}

	.answer-item:last-child {
		margin-bottom: 0;
	}

	.question {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.answer {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}

	.empty-state {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60vh;
	}

	.empty-text {
		font-size: 32rpx;
		color: #999;
	}
</style>