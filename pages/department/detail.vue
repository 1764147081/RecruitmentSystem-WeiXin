<template>
	<view class="detail-container">
		<u-navbar
			title="部门详情" 
			left-icon="arrow-left" 
			auto-back
			bg-color="#F8F8F8"
			title-color="#000000"
			:border="false"
		>
		</u-navbar>


		<!-- 海报区域 -->
		<view class="poster-container">
			<image :src="info && info.image " mode="widthFix"></image>
		</view>

		<!-- 部门介绍 -->
		<view class="intro-container">
			<view class="section-title">部门名称</view>
			<view class="section-content">{{ info && info.name ? info.name : '奇妙的无名氏' }}</view>
		</view>
		<view class="intro-container">
			<view class="section-title">部门介绍</view>
			<view class="section-content">{{ info && info.description ? info.description : '暂无部门介绍' }}</view>
		</view>

		<!-- 部门职责 -->
<!-- 		<view class="duty-container">
			<view class="section-title">部门职责</view>
			<view class="section-content">{{ info && info.duties ? info.duties : '暂无部门职责信息' }}</view>
		</view> -->

		<!-- 问卷填报按钮 -->
		<view class="btn-container">
			<button class="submit-btn" @click="navigateToQuestionnaire">点击报名</button>
			<button v-if="ifAdmin" class="admin-btn" @click="navigateToAdmin">我的管理</button>
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
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		useDepartStore
	} from '@/stores/department.js';
	import {
		request
	} from '../../common/request';
	import {
		useFirstStore
	} from '../../stores/index.js';



	export default {
		setup() {
			const token = uni.getStorageSync('authToken');
			const departStore = useDepartStore();
			const userStore = useFirstStore();
			const loading = ref(false);
			const errorMsg = ref('');
			const departmentInfo = ref({});
			let info = ref({
				id: '',
				stationId: '',
				name: '',
				image: '',
				description: ''
			});
			let username = ref('')
			let ifAdmin = ref(false)
			async function getUserinfo() {
				const res = await request({
					url: "/user/info",
					method: 'GET',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': `Bearer ${token}`
					}
				});
				username.value = res.data.username
			}

			async function getPermission() {
				const res = await request({
					url: `/permission/show/user?username=${username.value}`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': `Bearer ${token}`
					}
				})

				res.data.forEach(val => {
					if (val.stationId === info.value.stationId) ifAdmin.value = true
				})

			}
			// 跳转到问卷页
			async function getQuestionnaire() {
				let res = await request({
					url: `/department/view/questionnaire?departmentId=${info.value.id}`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': `Bearer ${token}`
					}
				})
				return res;
			}
			async function getFinish(questionnaireId) {
				const res = await request({
					url: `/answer/view/user_questionnaire?questionnaireId=${questionnaireId}`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': `Bearer ${token}`
					}
				})
				return res;
			}
			const navigateToQuestionnaire = async () => {
				let res = await getQuestionnaire()
				let ress = await getFinish(res.data.id)
				if (res.code === 200) {
					if (ress.code === 404) {
						if (res.data.status === 0) {
							uni.showToast({
								title: '该部门未发布问卷',
								icon: 'none'
							});
						}
						if (res.code === 200 && res.data.status === 1) {
							// 设置问卷ID
							info.value.questionnaireId = res.data.id;
							uni.navigateTo({
								url: `/pages/department/questionnaire?id=${info.value.questionnaireId}&departmentId=${info.value.id}`
							});
						} else {
							uni.showToast({
								title: '该部门暂无问卷',
								icon: 'none'
							});
						}
					}
				}
				if (ress.code === 200) {
					uni.showToast({
						title: '您已填写该问卷',
						icon: 'none'
					});
				}
				if (res.code === 404) {
					uni.showToast({
						title: '该部门未发布问卷',
						icon: 'none'
					});
				}
			};

			onMounted(async () => {
				await getUserinfo()
				const departmentDetail = departStore.getDepartmentDetail();
				if (departmentDetail && Object.keys(departmentDetail).length > 0) {
					departmentInfo.value = departmentDetail;
					info.value = departmentDetail;
					console.log('从store获取部门详情数据成功:', departmentInfo.value);
				} else {
					console.error('从store获取部门详情数据失败');
				}
				await getPermission()

			});
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

			// 跳转到部门管理页面
			const navigateToAdmin = () => {
				uni.navigateTo({
					url: `/pages/department/admin?departmentId=${departmentInfo.value.id}`
				});
			};

			return {
				departmentInfo,
				navigateToQuestionnaire,
				loading,
				navigateToDepartment,
				navigateToPaper,
				navigateToInfo,
				navigateToAdmin,
				info,
				ifAdmin
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
		/* 移除固定高度，让容器根据图片自适应 */
	}

	.poster-container image {
		width: 100%;
		/* 使用widthFix模式后，height会自动调整 */
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
		width: 80%;
		margin: 20rpx auto;
		background-color: #007aff;
		color: white;
		border-radius: 10rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.admin-btn {
		width: 80%;
		margin: 20rpx auto;
		background-color: #3699ff;
		color: white;
		border-radius: 10rpx;
		height: 80rpx;
		line-height: 80rpx;
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