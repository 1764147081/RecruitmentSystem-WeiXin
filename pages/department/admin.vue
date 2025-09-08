<template>
	<view class="admin-container">
		<u-navbar 
			title="部门管理" 
			left-icon="arrow-left" 
			auto-back
			bg-color="#F8F8F8"
			title-color="#000000"
			:border="false"
		>
		</u-navbar>

		<!-- 管理功能区域 -->
		<view class="management-section">
			<view class="section-title">该部门报名成员</view>
			<view class="function-list">
				<view class="user-item" v-for="(user, index) in newFinish" :key="index" @click="navigateToUserInfo(user.username,user.questionnaireId)">
					<image class="avatar" :src="user.avatar || '/static/assets/nav_icon_avatar_nor.png'" mode="aspectFill"></image>
					<view class="user-info">
						<text class="name">{{ user.name }}</text>
						<text class="username">{{ user.username }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import {
		request
	} from '../../common/request';
	import {
		useRoute
	} from 'vue-router'


	const route = useRoute()
	const token = uni.getStorageSync('authToken');
	let finish = ref([])
	let newFinish = ref([])


	onMounted(async () => {
		await getFinish()
	})
	async function getFinish() {
		const res = await request({
			url: `/answer/view/department?departmentId=${route.query.departmentId}`,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`
			}
		})
		finish.value = [...res.data]
		newFinish.value = await Promise.all(finish.value.map(async (val) => {
			let a = await getUserInfo(val.username)
			return {
				...a,
				...val
			}
		}))
	}
	async function getUserInfo(username) {
		const res = await request({
			url: `/user/info?username=${username}`,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`
			}
		})
		return res.data
	}
	
	// 跳转到用户信息页面
	function navigateToUserInfo(username,questionnaireId) {
		uni.navigateTo({
			url: `/pages/department/user-info?username=${username}&questionnaireId=${questionnaireId}`
		});
	}
</script>

<style lang="scss">
	.admin-container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.management-section {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.function-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.function-item {
		padding: 20rpx;
		background-color: #e6f7ff;
		border: 1rpx solid #91d5ff;
		border-radius: 10rpx;
		text-align: center;
		font-size: 28rpx;
	}
	
	.user-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
	}
	
	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
	}
	
	.name {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.username {
		font-size: 28rpx;
		color: #666;
	}
</style>