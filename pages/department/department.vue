<template>
	<view class="department-container">
		<!-- 搜索框 -->
		<view class="search-box">
			<up-input placeholder="搜索模块或部门,宁可少字也不可错字哦~" border="surround" v-model="searchKey" clearable></up-input>
			<button class="search-button" @click="searchModules">搜索</button>
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
	import { useDepartStore } from '@/stores/department.js';
	import { request } from '../../common/request';
    import RecursiveModule from '../../components/RecursiveModule/RecursiveModule.vue';

	const token = uni.getStorageSync('authToken');
	const departStore = useDepartStore();
	const modules = ref([]);
	const searchKey = ref('');

	// 搜索功能
	const searchModules = async () => {
		if (!searchKey.value) {
			// 如果搜索框为空，重新加载原始数据
			ViewStation();
			return;
		}

		try {
			const res = await request({
				url: '/station/search',
				method: 'GET',
				data: {
					name: searchKey.value
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					'Authorization': `Bearer ${token}`
				}
			});

			if (res.code === 200) {
				// 处理返回的数据，根据isDepartment字段决定渲染方式
				let formattedData = [];
				
				// 检查返回的数据是数组还是对象
				if (Array.isArray(res.data)) {
					// 如果是数组，直接处理
					formattedData = res.data.map(item => {
						// 根据isDepartment字段决定渲染方式
						if (item.isDepartment === 1) {
							// 如果是部门，直接渲染
							return {
								...item,
								expanded: false,
								submodules: [],
								departments: [],
								isLeaf: true,
								isDepartment: 1
							};
						} else {
							// 如果是模块，渲染并访问unfold接口
							return {
								...item,
								expanded: false,
								submodules: item.submodules || [],
								departments: item.departments || [],
								isLeaf: item.isLeaf || false,
								isDepartment: item.isDepartment || 0
							};
						}
					});
				} else if (typeof res.data === 'object' && res.data !== null) {
					// 如果是对象，将其包装在数组中再处理
					const item = res.data;
					// 根据isDepartment字段决定渲染方式
					if (item.isDepartment === 1) {
						// 如果是部门，直接渲染
						formattedData = [{
							...item,
							expanded: false,
							submodules: [],
							departments: [],
							isLeaf: true,
							isDepartment: 1
						}];
					} else {
						// 如果是模块，渲染并访问unfold接口
						formattedData = [{
							...item,
							expanded: false,
							submodules: item.submodules || [],
							departments: item.departments || [],
							isLeaf: item.isLeaf || false,
							isDepartment: item.isDepartment || 0
						}];
						
						// 当isDepartment为1时，不需要加载子模块数据
						// await unfoldStation(item.id, formattedData[0]);
					}
				}
				modules.value = formattedData;
			} else {
				uni.showToast({
					title: '并没有找到哦~',
					icon: 'none',
					duration: 2000
				});
			}
		} catch (error) {
			console.error('搜索请求异常:', error);
			uni.showToast({
				title: '搜索请求异常',
				icon: 'none',
				duration: 2000
			});
		}
	};

	// 切换模块展开/折叠状态
	const toggleModule = (module) => {
		// 如果是部门，则不处理展开/折叠
		if (module.isDepartment === 1) {
			return;
		}

		module.expanded = !module.expanded;

		// 如果展开模块，确保已加载其子数据
		if (module.expanded && module.submodules && module.submodules.length === 0) {
			unfoldStation(module.id, module);
		}
	};

	async function ViewStation() {
		// 初始加载根目录 id=0
		await unfoldStation(1, null, true);
	}

	// 递归展开子模块
	async function unfoldStation(id, parentModule, isRoot = false) {
		// 如果parentModule是部门，则不加载子模块
		if (parentModule && parentModule.isDepartment === 1) {
			return;
		}

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
						departments: item.isDepartment === 1 ? [] : (item.departments || []), // 如果是部门，则departments为空数组
						isLeaf: false, // 标记是否为最后一级菜单
						isDepartment: item.isDepartment || 0 // 添加isDepartment字段，默认为0
					}));

				if (isRoot) {
					// 根节点数据
					modules.value = formattedData;

					// 为根节点加载子模块
					for (const item of formattedData) {
						// 如果是部门，则不加载子模块
						if (item.isDepartment !== 1) {
							await unfoldStation(item.id, item);
						}
					}
				} else if (parentModule) {
					// 将子模块添加到父模块
					parentModule.submodules = formattedData;
				}
			} else {
				console.warn(`ID为${id}的数据不是期望的数组格式`);
			}
		} else if (res.code === 404) {
			// 不再根据404响应标记为部门，仅保留isDepartment===1的判断
			console.log(`ID为${id}的模块是最后一级菜单`);
			if (parentModule) {
				parentModule.isLeaf = true;
				// 移除parentModule.isDepartment = 1的设置，仅保留isDepartment字段本身的值
			}
		} 

		
	}

	onLoad(() => {
		ViewStation();
		document.querySelector('.uni-page-head-hd').style.display = 'none'
	})
	
	// H5端隐藏返回按钮
	onMounted(() => {
		// #ifdef H5
		const backButton = document.querySelector('.uni-page-head-hd');
		if (backButton) {
			backButton.style.display = 'none';
		}
		// #endif
	})

	async function viewDepartmentDetail(departmentId) {
		let res = await request({
			url: '/department/view',
			method: 'GET',
			data: {
				stationId: parseInt(departmentId),
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`
			}
		});
		if (res.code === 200) {
			console.log('Department detail loaded successfully:', res.data);
			// 保存部门详情数据到store
					departStore.setDepartmentDetail(res.data);
					// 跳转到详情页（无需传递ID，从store获取数据）
					uni.navigateTo({
						url: '/pages/department/detail'
					});
		} else {
			console.error('Failed to load department detail:', res.message);
			uni.showToast({
				title: res.message || '获取部门详情失败',
				icon: 'none',
				duration: 2000
			});
		}
	}

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
		display: flex;
		align-items: center;
	}

	.search-button {
		margin-left: 20rpx;
		background-color: #e63946;
		color: white;
		border: none;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		font-size: 28rpx;
		white-space: nowrap;
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