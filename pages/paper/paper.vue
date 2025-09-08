<template>
	<view class="paper-container">
		<u-navbar title="已填报" left-icon="arrow-left" bg-color="#F8F8F8" title-color="#000000" :border="false">
		</u-navbar>
		<view class="questionnaires-list">
			<view v-if="questionnaires.length === 0" class="empty-tip">
				<text>暂无已填问卷</text>
			</view>
			<view v-for="item in questionnaires" :key="item.id" class="questionnaire-item">
				<view class="item-header">
					<text class="item-title">{{ item.title }}</text>
					<view class="item-actions">
						<button class="view-btn" @click="viewQuestionnaire(item)">查看</button>
						<button class="delete-btn" @click="deleteQuestionnaire(item.id)">取消报名</button>
					</view>
				</view>
			</view>
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
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		request
	} from '../../common/request';

	export default {
		setup() {
			const finish = ref([]);
			const questionnaires = ref([]);

			async function getFinish() {
				const res = await request({
					url: `/answer/view/user`,
					header: {
						'content-type': 'application/json',
						'Authorization': `Bearer ${uni.getStorageSync('authToken')}`
					},
				})
				finish.value = [...res.data]
				await getQuestionnaire()
			}

			async function getQuestionName(questionnaireId) {
				const res = await request({
					url: `/questionnaire/view?questionnaireId=${questionnaireId}`,
					header: {
						'content-type': 'application/json',
						'Authorization': `Bearer ${uni.getStorageSync('authToken')}`
					},
				})
				return res.data;
			}

			const viewQuestionnaire = (item) => {
				uni.setStorageSync('QuestionnaireInfo', item)
				uni.navigateTo({
					url: `/pages/paper/myQuestionnaire`
				});
			}

			async function getQuestionnaire() {
				// 使用 Promise.all 等待所有异步操作完成
				const promises = finish.value.map(async (val) => {
					let a = await getQuestionName(val.questionnaireId);
					return {
						...a,
						...val
					};
				});

				// 等待所有Promise完成
				questionnaires.value = await Promise.all(promises);
			};


			onMounted(async () => {
				document.querySelector('.uni-page-head-hd').style.display = 'none'
				await getFinish()

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

			// 删除问卷功能
			const deleteQuestionnaire = (id) => {
				// 过滤掉要删除的问卷
				questionnaires.value = questionnaires.value.filter(item => item.id !== id);

				// 这里可以添加调用API删除问卷的逻辑
				// 例如:
				request({
					url: `/answer/delete?finishId=${id}`,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'Authorization': `Bearer ${uni.getStorageSync('authToken')}`
					},
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '删除成功'
						});
					}
				}).catch(err => {
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
				});
			};

			return {
				questionnaires,
				// departmentName,
				// submitForm,
				navigateToDepartment,
				navigateToPaper,
				navigateToInfo,
				deleteQuestionnaire,
				viewQuestionnaire
			};
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

	.questionnaires-list {
		margin-top: 120rpx;
		padding: 20rpx;
	}

	.empty-tip {
		text-align: center;
		padding: 60rpx 0;
		color: #999;
		font-size: 28rpx;
	}

	.questionnaire-item {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.item-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10rpx;
	}

	.item-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.item-time {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 16rpx;
	}

	.view-btn {
		background-color: #1890ff;
		color: white;
		border: none;
		padding: 10rpx 20rpx;
		width: 75px;
		border-radius: 8rpx;
		font-size: 24rpx;
		cursor: pointer;
	}

	.delete-btn {
		background-color: #e63946;
		color: white;
		border: none;
		padding: 10rpx 20rpx;
		width: 75px;
		border-radius: 8rpx;
		font-size: 24rpx;
		cursor: pointer;
	}

	.item-status {
		display: flex;
		justify-content: flex-end;
	}

	.status-text {
		font-size: 24rpx;
		color: #007aff;
		padding: 4rpx 16rpx;
		border: 1rpx solid #007aff;
		border-radius: 16rpx;
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