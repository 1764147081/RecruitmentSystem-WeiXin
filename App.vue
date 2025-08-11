<script>
	import { createApp } from 'vue';
	import { createPinia } from 'pinia';
	import { useFirstStore } from './stores/index.js';
	import { request } from './common/request.js';

	// 创建Pinia实例
	const pinia = createPinia();
	const app = createApp({});
	app.use(pinia);

	export default {
		onLaunch: function() {
			console.log('App Launch');
			this.initLogin();
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			initLogin() {
				const store = useFirstStore();
				
				// 检查本地存储中是否有token
				const token = wx.getStorageSync('authToken') || '';
				
				if (token) {
					console.log('发现保存的token，尝试自动登录');
					// 先设置token
					store.setToken(token);
					
					// 验证token有效性
					request({
						url: '/user/verify-token',
						method: 'POST',
						data: {
							token: token
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'Authorization': `Bearer ${token}`
						}
					}).then(res => {
						if (res.code === 200) {
							// token有效，更新用户信息
							store.setLoginData({
								token: token,
								userInfo: res.userInfo
							});
							
							// 跳转到首页
							uni.switchTab({
								url: '/pages/department/department'
							});
						} else {
							// token无效，清除token
							console.log('token无效，清除登录状态');
							store.logout();
							// 跳转到登录页
							uni.redirectTo({
								url: '/pages/login/login'
							});
						}
					}).catch(error => {
						console.error('验证token失败:', error);
						// 网络错误，仍然跳转到首页，但可能在首页会再次验证
						uni.switchTab({
							url: '/pages/department/department'
						});
					});
				} else {
					// 没有token，跳转到登录页
					uni.redirectTo({
						url: '/pages/login/login'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-plus/index.scss";
</style>
