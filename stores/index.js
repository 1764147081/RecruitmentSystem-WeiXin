import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFirstStore = defineStore('first', () => {
	const token = ref("");
	const user = ref({
		username: "",
		studentNumber: "",
		password: "",
	});
	const isLoggedIn = ref(false);

	function logout() {
		token.value = '';
		user.value = { username: '', studentNumber: '', password: '' };
		isLoggedIn.value = false;
		uni.removeStorageSync('token');
		uni.removeStorageSync('authToken');
	};

	function setLoginData(res) {
		token.value = res.token;
		user.value.username = res.userInfo?.username || '';
		user.value.studentNumber = res.userInfo?.studentNumber || '';
		isLoggedIn.value = true;
		// 持久化到本地存储
		uni.setStorageSync('token', res.token);
	};

	function setToken(newToken) {
		token.value = newToken;
		isLoggedIn.value = !!newToken;
		// 持久化到本地存储
		uni.setStorageSync('token', newToken);
	};
	function getUsername() {
		return user.value.username;
	}
	return {
		user,
		token,
		isLoggedIn,
		setLoginData,
		setToken,
		logout,
		getUsername
	};

})
