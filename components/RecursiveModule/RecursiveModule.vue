<template>
	<template v-for="module in modules" :key="module.id">
		<view :class="'module-item level-' + level">
			<!-- 对于isDepartment为1的部门，只显示在当前层级 -->
			<view v-if="module.isDepartment === 1" class="module-header leaf-node" @click="viewDepartmentDetail(module.id)">
				<text class="module-name">{{ module.name }}</text>
			</view>
			<view v-else>
				<view class="module-header" @click="toggleModule(module)">
					<text class="module-name">{{ module.name }}</text>
					<text class="arrow-icon">{{ module.expanded ? '▼' : '►' }}</text>
				</view>
				<!-- 对于isDepartment不为1的模块，展开时渲染子模块和部门 -->
				<view v-if="module.expanded" class="submodule-list">
					<!-- 递归渲染更深层级的子模块，最多支持10级 -->
					<RecursiveModule v-if="module.submodules && module.submodules.length > 0 && level < 10"
						:modules="module.submodules" :level="level + 1" :unfoldStation="unfoldStation"
						:viewDepartmentDetail="viewDepartmentDetail" />

					<!-- 渲染部门 -->
					<view v-if="module.departments && module.departments.length > 0" class="department-list">
						<view v-for="department in module.departments" :key="department.id" class="department-item"
							@click="viewDepartmentDetail(department.id)">
							<text>{{ department.name }}</text>
							<text class="arrow-right">→</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</template>
</template>

<script setup>
	import {
		defineProps,
		defineEmits,
		onMounted
	} from 'vue';
	import {
		request
	} from '../../common/request';

	// 定义组件参数
	onMounted(()=>{
		console.log("渲染组件加载")
	})
	const props = defineProps({
		modules: {
			type: Array,
			required: true
		},
		level: {
			type: Number,
			required: true
		},
		unfoldStation: {
			type: Function,
			required: true
		},
		viewDepartmentDetail: {
			type: Function,
			required: true
		}
	});

	// 定义组件方法
	const toggleModule = (module) => {
		module.expanded = !module.expanded;
		// 如果展开模块，确保已加载其子数据
		if (module.expanded && module.submodules && module.submodules.length === 0) {
			props.unfoldStation(module.id, module);
		}
	};
</script>

<style scoped>
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

	.arrow-icon {
	font-size: 24rpx;
	color: #999;
}

.leaf-node {
	background-color: #f0f7ff;
	font-weight: normal;
}

.leaf-node .module-name {
	color: #1890ff;
	font-weight: bold;
}

	.arrow-right {
		font-size: 24rpx;
		color: #999;
		margin-left: auto;
	}

	/* 递归模块层级样式 */
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
</style>