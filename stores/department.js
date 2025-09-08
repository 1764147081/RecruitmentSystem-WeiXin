import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDepartStore = defineStore('depart',() => {
	const departmentDetail = ref({});

	// 设置部门详情数据
	function setDepartmentDetail(data) {
		departmentDetail.value = data || {};
		console.log('部门详情数据已保存到store:', departmentDetail.value);
	}

	// 获取部门详情数据
	function getDepartmentDetail() {
		return departmentDetail.value;
	}

	// 清空部门详情数据
	function clearDepartmentDetail() {
		departmentDetail.value = {};
		console.log('部门详情数据已清空');
	}

	return {
		departmentDetail,
		setDepartmentDetail,
		getDepartmentDetail,
		clearDepartmentDetail
	};
})