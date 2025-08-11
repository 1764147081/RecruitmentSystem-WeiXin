<template>
	<view class="department-container">
		<!-- 搜索框 -->
		<view class="search-box">
			<up-input placeholder="搜索模块或部门" border="surround" v-model="searchKey" clearable></up-input>
		</view>

		<!-- 导航栏 -->
		<view class="nav-container">
			<!-- 递归渲染模块 -->
			<RecursiveModule :modules="modules" :level="1" :unfoldStation="unfoldStation" :viewDepartmentDetail="viewDepartmentDetail" />
		</view>

		<!-- 底部导航 -->
		<view class="tab-bar">
			<view class="tab-item active" @click="navigateToDepartment">部门展览</view>
			<view class="tab-item" @click="navigateToPaper">已填报</view>
			<view class="tab-item" @click="navigateToInfo">个人中心</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, watch } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { useFirstStore } from '@/stores/index.js';
	import { request } from '../../common/request';
    import RecursiveModule from '../../components/RecursiveModule/RecursiveModule.vue';

	const token = wx.getStorageSync('authToken');
	const store = useFirstStore();
	const modules = ref([]);
	const searchKey = ref('');
	const originalModules = ref([]); // 存储原始数据

	// 监听搜索关键词变化
	watch(searchKey, (newValue) => {
		if (!newValue) {
			// 如果搜索框为空，恢复原始数据
			modules.value = [...originalModules.value];
			return;
		}

		// 根据搜索关键词过滤数据
		const filteredModules = originalModules.value.map(module => {
			// 过滤模块下的子模块
			const filteredSubmodules = module.submodules.filter(submodule => {
				// 过滤子模块下的部门
				const filteredDepartments = submodule.departments.filter(department =>
					department.name.toLowerCase().includes(newValue.toLowerCase())
				);

				return filteredDepartments.length > 0;
			});

			return {
				...module,
				submodules: filteredSubmodules
			};
		}).filter(module => module.submodules.length > 0);

		modules.value = filteredModules;
	});

	// 切换模块展开/折叠状态
	const toggleModule = (module) => {
		module.expanded = !module.expanded;

		// 如果展开模块，确保已加载其子数据
		if (module.expanded && module.submodules && module.submodules.length === 0) {
			unfoldStation(module.id, module);
		}
	};

	async function ViewStation() {
		// 初始加载根目录 id=0
		await unfoldStation(0, null, true);
	}

	// 递归展开子模块
	async function unfoldStation(id, parentModule, isRoot = false) {
		let res = await request({
			url: '/station/unfold',
			method: 'GET',
			data: {
				id: parseInt(id),
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`
			}
		});

		if (res.code === 200) {
			console.log(`成功获取ID为${id}的子模块:`, res.data);

			// 确保数据结构正确
			if (res.data && Array.isArray(res.data)) {
				const formattedData = res.data.map(item => ({
						...item,
						expanded: false, // 默认折叠
						submodules: [],
						departments: item.departments || [],
						isLeaf: false // 标记是否为最后一级菜单
					}));

				if (isRoot) {
					// 根节点数据
					modules.value = formattedData;
					originalModules.value = [...formattedData];

					// 为根节点加载子模块
					for (const item of formattedData) {
						await unfoldStation(item.id, item);
					}
				} else if (parentModule) {
					// 将子模块添加到父模块
					parentModule.submodules = formattedData;
				}
			} else {
				console.warn(`ID为${id}的数据不是期望的数组格式`);
			}
		} else if (res.code === 404) {
			// 标记为最后一级菜单
			console.log(`ID为${id}的模块是最后一级菜单`);
			if (parentModule) {
				parentModule.isLeaf = true;
			}
		} 

		
	}

	onLoad(() => {
		ViewStation();
	})

	// 查看部门详情
	// async function viewDepartmentDetail(departmentId) {
	// 	let res = await request({
	// 		url: '/station/view',
	// 		method: 'GET',
	// 		data: {
	// 			id: parseInt(departmentId),
	// 		},
	// 		header: {
	// 			'content-type': 'application/x-www-form-urlencoded',
	// 			'Authorization': `Bearer ${token}`
	// 		}
	// 	});
	// 	if (res.code === 200) {
	// 		console.log('Department detail loaded successfully:', res.data);
	// 		// 跳转到详情页并传递数据
	// 		uni.navigateTo({
	// 			url: `/pages/department/detail?id=${departmentId}`
	// 		});
	// 	} else {
	// 		console.error('Failed to load department detail:', res.message);
	// 		uni.showToast({
	// 			title: res.message || '获取部门详情失败',
	// 			icon: 'none',
	// 			duration: 2000
	// 		});
	// 	}
	// }

	// 跳转到部门列表
	const navigateToDepartment = () => {
		// 当前页面，不需要跳转
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
</script>

<style lang="scss">
	.department-container {
		padding: 20rpx;
		padding-bottom: 120rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
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

	.search-box {
		margin-bottom: 20rpx;
	}

	.nav-container {
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.module-item {
		border-bottom: 1rpx solid #eee;
	}

	.module-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.submodule-list {
		padding-left: 40rpx;
		background-color: #f9f9f9;
	}

	.submodule-item {
		border-bottom: 1rpx solid #eee;
	}

	.submodule-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 25rpx 20rpx;
		font-size: 30rpx;
		color: #666;
	}

	.department-list {
		padding-left: 40rpx;
		background-color: #f0f0f0;
	}

	.department-item {
	padding: 20rpx;
	font-size: 28rpx;
	color: #666;
	border-bottom: 1rpx solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

/* 递归模块样式 */
.level-1 .module-header {
	padding-left: 20rpx;
}
.level-2 .module-header {
	padding-left: 60rpx;
}
.level-3 .module-header {
	padding-left: 100rpx;
}
.level-4 .module-header {
	padding-left: 140rpx;
}
.level-5 .module-header {
	padding-left: 180rpx;
}

/* 增加更多层级的样式，如果需要 */
.level-6 .module-header {
	padding-left: 220rpx;
}
.level-7 .module-header {
	padding-left: 260rpx;
}
.level-8 .module-header {
	padding-left: 300rpx;
}
.level-9 .module-header {
	padding-left: 340rpx;
}
.level-10 .module-header {
	padding-left: 380rpx;
}

/* 子模块列表样式 */
.submodule-list {
	background-color: #f9f9f9;
}

/* 部门列表样式 */
.department-list {
	padding-left: 40rpx;
	background-color: #f0f0f0;
}

/* 箭头图标样式 */
.arrow-icon {
	font-size: 24rpx;
	color: #999;
}

/* 右箭头样式 */
.arrow-right {
	font-size: 24rpx;
	color: #999;
	margin-left: auto;
}

	.arrow-right {
		font-size: 24rpx;
		color: #999;
	}

	.arrow-icon {
		font-size: 24rpx;
		color: #999;
	}
</style>