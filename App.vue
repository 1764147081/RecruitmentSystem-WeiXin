<script>
	import {
		createApp
	} from 'vue';
	import {
		createPinia
	} from 'pinia';
	import {
		useFirstStore
	} from './stores/index.js';
	import {
		request
	} from './common/request.js';

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
				const token = uni.getStorageSync('authToken') || '';
				console.log('当前token:', token);

				if (token) {
					console.log('发现保存的token，尝试自动登录');
					(async () => {

						let response = await request({
							url: "/user/info",
							method: 'GET',
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								'Authorization': `Bearer ${token}`
							},
						});
						console.log('验证token响应码:', response.code);
						if (response.code === 200) {
							// token有效，保存用户信息到store
							console.log('token验证成功，保存用户信息');
							store.setLoginData({
								token: token,
								userInfo: response.data || {}
							});
							// 跳转到首页
							uni.redirectTo({
								url: '/pages/department/department'
							});
						} else {
							// token无效，清除登录状态
							console.log('token无效，清除登录状态');
							store.logout();
							// 跳转到登录页
							uni.redirectTo({
								url: '/pages/login/login'
							});
						}
					})();
				}
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-plus/index.scss";
</style>