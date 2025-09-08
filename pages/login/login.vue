<template>
	<Toast position="top" class="top-toast"></Toast>
	<view class="background">
		<image src="/static/assets/SDU.png" alt="">
		</image>

	</view>
	<view class="logo">
		<image src="/static/assets/logo.png" alt="" mode="widthFix"></image>
	</view>
	<view class="container">
		<view class="login-tabs">
			<view class="tab-btn" :class="{active: loginType === 'password'}" @click="switchLoginType('password')">
				账号密码登录</view>
			<view class="tab-btn" :class="{active: loginType === 'unified'}" @click="switchLoginType('unified')">统一认证登录
			</view>
		</view>
		<view>
			<view class="form-login">
				<form @submit.prevent="login">
					<up-input class="input" placeholder="请输入学号" border="surround" v-model="stuID" clearable></up-input>

					<up-input class="input" placeholder="请输入密码" border="surround" v-model="password" clearable
						password></up-input>
					<view v-if="showCaptcha" class="captcha-container">
						<up-input class="input captcha-input" placeholder="请输入验证码" border="surround"
							v-model="captchaCode" clearable type="number" maxlength="6"></up-input>
					</view>
					<view class="checkbox-and-register">
						<up-checkbox :customStyle="{marginBottom: '5px'}" label="自动登录" name="agree" usedAlone
							v-model:checked="aloneChecked">
						</up-checkbox>
						<view class="register-link" @click="goToUnifiedLogin">注册</view>
					</view>
					<button class="button-form"
						@click="login()">{{ loginType === 'password' ? '账号密码登录' : '统一认证登录' }}</button>
				</form>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onUnmounted
	} from 'vue';
	import {
		useFirstStore
	} from "@/stores/index.js";
	import {
		request
	} from '../../common/request.js';
	const store = useFirstStore();
	const stuID = ref('');
	const password = ref('');
	const aloneChecked = ref(false);
	const loginType = ref('password'); // 默认账号密码登录
	const captchaCode = ref('');
	const showCaptcha = ref(false); // 控制验证码输入框显示



	onMounted(() => {
		if (store.isLoggedIn.value) {
			console.log('用户已登录，跳转到首页');
			uni.switchTab({
				url: '/pages/department/department'
			});
		}
	});

	// 切换登录类型
	function switchLoginType(type) {
		loginType.value = type;
		// 切换登录类型时清空验证码
		captchaCode.value = '';
	}

	// 跳转到统一认证登录
	function goToUnifiedLogin() {
		switchLoginType('unified');
	}

	async function login() {
			// 验证参数值
			console.log('stuID:', stuID.value);
			console.log('password:', password.value);

			// 重置验证码显示状态
			if (loginType.value === 'unified') {
				showCaptcha.value = false;
			}

			let response;
			if (loginType.value === 'unified') {
				console.log("现在使用统一认证登录");
				const requestData = {
					studentNumber: stuID.value,
					password: password.value,
					fingerprint: stuID.value
				};
				// 只有在需要时才发送验证码
				if (captchaCode.value) {
					requestData.captcha = captchaCode.value;
				}
				response = await request({
					url: "/user/login/cas",
					method: 'POST',
					data: requestData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
				})
			} else {
				console.log("现在使用账号密码登录");
				response = await request({
					url: "/user/login",
					method: 'POST',
					data: {
						studentNumber: stuID.value,
						password: password.value
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				})
			};
			

			
			// 处理响应
				if (response.code === 200) {
					const token = response.data;
					console.log('Login successful, token:', token);
					// 根据用户是否选择“记住我”来存储token
					if (aloneChecked.value) {
						// 长期存储
						uni.setStorageSync('authToken', token);
					} else {
						// 会话级存储
						uni.setStorageSync('authToken', token);
					}
					// 更新Pinia中的登录状态
					store.setLoginData({
						token: token,
						userInfo: response.data.userInfo
					});

					// 跳转到首页
					uni.redirectTo({
						url: '/pages/department/department'
					});
				} else if (response.code === 400) {
					// 检查是否需要验证码
					if (response.msg === "需要验证码") {
						showCaptcha.value = true;
						uni.showToast({
							title: '请输入验证码',
							icon: 'none',
							position: 'top'
						});
					} else {
						uni.showToast({
							title: response.msg || '登录失败',
							icon: 'none',
							position: 'top'
						});
					}
				} else {
					// 其他错误情况
					uni.showToast({
						title: response.msg || '登录失败',
						icon: 'none',
						position: 'top'
					});
				}
		
	}
</script>

<style lang="scss">
	.sdu {
		font-size: 12px;
		position: relative;
		right: 0;
	}

	.button-form {
		opacity: 1;
		border-radius: 8.72px;
		background: rgba(165, 0, 1, 1);
		border: 2.62px solid rgba(214, 214, 214, 1);
		margin-top: 20px;
		font-size: 15px;
		color: rgba(252, 252, 252, 1);

	}

	.checkbox {
		padding-top: 20px;
		font-weight: bold;
		font-size: 5px;
	}

	.checkbox-and-register {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding-top: 20px;
	}

	.register-link {
		color: rgba(165, 0, 1, 1);
		font-size: 14px;
		cursor: pointer;
	}

	// .captcha-container {
	// 	display: flex;
	// 	align-items: center;
	// 	margin-top: 20px;
	// }

	.captcha-input {
		flex: 1;
		margin-right: 10px;
	}

	.send-captcha-btn {
		width: 120px;
		height: 40px;
		background-color: #007aff;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.send-captcha-btn:disabled {
		background-color: #cccccc;
		color: #666666;
		cursor: not-allowed;
	}

	.form-login {
		width: 80%;
		margin: auto;
		height: 100%;
	}

	.background image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.background {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.container {
		width: 558rpx;
		margin: auto;
		background: rgba(252, 252, 252, 1);
		min-height: 40vh;
		margin-top: 130rpx;
	}

	.logo image {
		width: 300rpx;
		height: auto;
		display: block;
		margin: auto;
		margin-top: 30px;
	}

	.input {
		margin: auto;
		margin-top: 20px;
	}

	.login-tabs {
		display: flex;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid rgba(214, 214, 214, 1);
	}

	.tab-btn {
		flex: 1;
		text-align: center;
		font-size: 16px;
		cursor: pointer;
	}

	.tab-btn.active {
		color: rgba(165, 0, 1, 1);
		font-weight: bold;
		position: relative;
	}

	.tab-btn.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 20%;
		width: 60%;
		height: 3px;
		background-color: rgba(165, 0, 1, 1);
	}

	.top-toast {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 9999 !important;
	}

	/* 确保uni.showToast也显示在最顶层 */
	.uni-toast--top {
		z-index: 9999 !important;
	}
</style>