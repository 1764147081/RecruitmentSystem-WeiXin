<template>
	<view class="toast">
		<up-toast ref="uToastRef" >
		</up-toast>			
	</view>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue';  
	  
	// 创建响应式数据  
	const show = ref(false);  

	const list = ref(  
		{
			type: 'success',
			message: "如未设置密码请先通过统一认证登录",
			iconUrl: 'https://uview-plus.jiangruyi.com/resources/toast/success.png',
			position: "top"
		});  
	  
	// 计算属性  
 
	  
	// 方法
	const uToastRef = ref(null);
	onMounted(() => {
	  showToast(list.value); // 注意：这里需要访问响应式数据
	});
	function showToast(params) {  
	  uToastRef.value.show({  
	    ...params,  
	  }); 
	} ; 
</script>

<style lang="scss">
.toast{
	position: fixed;
	top: 0;
}
</style>