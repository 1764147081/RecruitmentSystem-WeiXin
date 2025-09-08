<template>
	<view class="questionnaire-container">
		<u-navbar 
			title="部门报名问卷" 
			left-icon="arrow-left" 
			auto-back
			bg-color="#F8F8F8"
			title-color="#000000"
			:border="false"
		>
		</u-navbar>
		<view class="header">
			<text class="title">{{ currentQuestion.title }}</text>
			<view class="progress-container">
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }">
					</view>
				</view>
				<text class="progress-text">{{ currentIndex + 1 }}/{{ questions.length }}</text>
			</view>
		</view>

		<view class="question-content">
			<text class="question-text">{{ currentQuestion.question }}</text>
			<text class="question-type" v-if="currentQuestion.type === 1">[单选题]</text>
			<text class="question-type" v-else-if="currentQuestion.type === 2">[多选题]</text>

			<!-- 单选题 -->
			<view class="options" v-if="currentQuestion.type === 1">
				<view v-for="(option, index) in currentQuestion.options" :key="index" class="option-item"
					:class="{ 'selected': selectedOption === index }" @click="selectOption(index)">
					<view class="option-label">{{ String.fromCharCode(65 + index) }}</view>
					<view class="option-text">{{ option.optionContent }}</view>
				</view>
			</view>

			<!-- 多选题 -->
			<view class="options" v-else-if="currentQuestion.type === 2">
				<view v-for="(option, index) in currentQuestion.options" :key="index" class="option-item"
					:class="{ 'selected': selectedOptions.includes(index) }" @click="toggleOption(index)">
					<view class="option-label">{{ String.fromCharCode(65 + index) }}</view>
					<view class="option-text">{{ option.optionContent }}</view>
				</view>
			</view>

			<!-- 填空题 -->
			<view class="textarea-container" v-else-if="currentQuestion.type === 3">
				<textarea v-model="fillValue" class="textarea" placeholder="请输入您的答案" />
			</view>
		</view>

		<view class="button-group">
			<button class="btn prev-btn" :disabled="currentIndex === 0" @click="prevQuestion">上一题</button>
			<button class="btn next-btn"
				@click="nextQuestion">{{ currentIndex === questions.length - 1 ? '提交' : '下一题' }}</button>
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
		request
	} from '@/common/request';
	import {
		useFirstStore
	} from '@/stores/index';
	import { useRoute } from 'vue-router'
import { route } from '../../uni_modules/uview-plus';

	// 全局变量存储问卷ID
	let globalQuestionnaireId = null;

	export default {
		// 在uni-app中，通过onLoad钩子获取路由参数
		onLoad(options) {
			if (options && options.id) {
				// 将问卷ID存储到全局变量中，以便在setup中访问
				globalQuestionnaireId = options.id;
				console.log('Questionnaire ID from onLoad:', globalQuestionnaireId);
			}
		},
		setup() {
			// 使用store获取用户信息
			const store = useFirstStore();
			const username = ref(store.user.username);
			const route = useRoute()
			// 使用响应式变量存储问卷ID
			const questionnaireId = ref(null);
			const departmentId = route.query.departmentId

			// 题目数据
			const questions = ref([]);
			const finishId = ref(null)

			// 当前题目索引
			const currentIndex = ref(0);
			// 当前选中的选项（单选）
			const selectedOption = ref(null);
			// 当前选中的选项（多选）
			const selectedOptions = ref([]);
			// 填空题答案
			const fillValue = ref('');
			// 当前题目
			const currentQuestion = ref({});
			// 存储所有题目的答案
			const answers = ref({});

			// 获取题目数据
			const getQuestions = async () => {
				if (!questionnaireId.value) {
					console.error('问卷ID未设置');
					return;
				}

				try {
					const res = await request({
						url: `/department/view/questions?departmentId=${departmentId}`,
						method: 'GET',
						header: {
							'content-type': 'application/json',
							'Authorization': `Bearer ${uni.getStorageSync('authToken')}`
						}
					});

					if (res.code === 200) {
						// 根据新的数据结构处理返回的题目数据
						questions.value = (res.data.questions || []).map(question => ({
							...question,
							// 将content字段映射为question字段，以适配模板
							question: question.content,
							// 选项字段适配，确保选项内容显示为optionContent
							options: (question.option || []).map((option, index) => ({
								...option,
								optionContent: option.optionContent || option,
								id: option.id !== undefined ? option.id :
									index // 如果option中没有id字段，则使用索引作为id
							}))
						}));
						currentIndex.value = 0;
						currentQuestion.value = questions.value[currentIndex.value];
						console.log('获取题目数据成功:', res.data);

					}
					if (!res.data.question || res.data.question.length === 0) {
						uni.showToast({
							title: '管理员并未上传题目',
							icon: 'none'
						});
					}
					if (res.code === 404) {
						uni.showToast({
							title: res.msg|| '该部门无问题',
							icon: 'none'
						});
					} else {
						console.error('获取题目数据失败:', res.message);
						uni.showToast({
							title: res.msg || '获取题目数据失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('获取题目数据异常:', error);
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				}
			};

			onMounted(async () => {
				// 优先使用onLoad钩子中获取的问卷ID
				if (globalQuestionnaireId) {
					questionnaireId.value = globalQuestionnaireId;
					console.log('Questionnaire ID from onLoad:', questionnaireId.value);
				} else {
					// 从页面实例获取路由参数（备用方案）
					const pages = getCurrentPages();
					const currentPage = pages[pages.length - 1];
					const options = currentPage.options;
					if (options && options.id) {
						questionnaireId.value = options.id;
						console.log('Questionnaire ID from options:', questionnaireId.value);
					}
				}
				// 获取题目数据
				getQuestions();

			});

			// 选择选项（单选）
			const selectOption = (index) => {
				selectedOption.value = index;
				// 保存当前题目的答案
				answers.value[currentIndex.value] = {
					type: 1,
					selectedOption: index
				};
			};

			async function createFinish() {
				const res = await request({
					url: '/answer/create/finish',
					header: {
						'content-type': 'application/json',
						'Authorization': `Bearer ${uni.getStorageSync('authToken')}`
					},
					method: 'POST',
					data: {
						"questionnaireId": questionnaireId.value
					},
				})
				return res;
			};
			async function updateFinish() {
				const res = await request({
					url: '/answer/update/finish',
					header: {
						'content-type': 'application/json',
						'Authorization': `Bearer ${uni.getStorageSync('authToken')}`
					},
					method: 'POST',
					data: {
						"id": finishId.value,
						"questionnaireId": questionnaireId.value
					},
				})
				return res;
			};
			// 创建答案
			async function createAnswer(answerList) {
				console.log(answerList)
				const resp = await request({
					url: `/answer/save?finishId=${finishId.value}`,
					header: {
						'content-type': 'application/json',
						'Authorization': `Bearer ${uni.getStorageSync('authToken')}`
					},
					method: 'POST',
					data: {
						"questionnaireId": questionnaireId.value,
						"answerList": answerList
					},
				})
				return resp;
			};
			// 获取完成ID

			async function getFinishId() {
				try {
					const respo = await request({
						url: '/answer/view/user_questionnaire',
						header: {
							'content-type': 'application/json',
							'Authorization': `Bearer ${uni.getStorageSync('authToken')}`
						},
						data: {
							"questionnaireId": parseInt(questionnaireId.value),
							'username': username.value
						}
					});

					if (respo.code === 200 && respo.data) {
						return respo.data.id;
					} else {
						console.error('获取finishId失败:', respo.message);
						return null;
					}
				} catch (error) {
					console.error('获取finishId异常:', error);
					return null;
				}
			}



			// 切换选项（多选）
			const toggleOption = (index) => {
				const selectedIndex = selectedOptions.value.indexOf(index);
				if (selectedIndex === -1) {
					// 选中选项
					selectedOptions.value.push(index);
				} else {
					// 取消选中选项
					selectedOptions.value.splice(selectedIndex, 1);
				}

				// 保存当前题目的答案
				answers.value[currentIndex.value] = {
					type: 2,
					selectedOptions: [...selectedOptions.value]
				};
			};

			// 上一题
			const prevQuestion = () => {
				if (currentIndex.value > 0) {
					// 保存当前题目的答案
					saveCurrentAnswer();

					currentIndex.value--;
					currentQuestion.value = questions.value[currentIndex.value];
					// 恢复当前题目的选择状态
					restoreCurrentAnswer();
				}
			};

			// 下一题或提交
			const nextQuestion = () => {
				// 验证是否已选择选项
				if (currentQuestion.value.type === 1 && selectedOption.value === null) {
					uni.showToast({
						title: '请选择一个选项',
						icon: 'none'
					});
					return;
				}

				if (currentQuestion.value.type === 2 && selectedOptions.value.length === 0) {
					uni.showToast({
						title: '请至少选择一个选项',
						icon: 'none'
					});
					return;
				}

				if (currentQuestion.value.type === 3 && (!fillValue.value || !fillValue.value.trim())) {
					uni.showToast({
						title: '请输入答案',
						icon: 'none'
					});
					return;
				}

				// 保存当前题目的答案
				saveCurrentAnswer();

				if (currentIndex.value < questions.value.length - 1) {
					currentIndex.value++;
					currentQuestion.value = questions.value[currentIndex.value];
					// 恢复当前题目的选择状态
					restoreCurrentAnswer();
				} else {
					// 提交问卷
					submitQuestionnaire();
				}
			};

			// 保存当前题目的答案
			const saveCurrentAnswer = () => {
				const index = currentIndex.value;
				const question = questions.value[index];

				if (question.type === 1) { // 单选题
					answers.value[index] = {
						type: 1,
						selectedOption: selectedOption.value
					};

				} else if (question.type === 2) { // 多选题
					answers.value[index] = {
						type: 2,
						selectedOptions: [...selectedOptions.value]
					};
				} else if (question.type === 3) { // 填空题
					answers.value[index] = {
						type: 3,
						fillValue: fillValue.value
					};
				}
			};

			// 恢复当前题目的选择状态
			const restoreCurrentAnswer = () => {
				const index = currentIndex.value;
				const answer = answers.value[index];

				// 重置当前题目的选择状态
				selectedOption.value = null;
				selectedOptions.value = [];
				fillValue.value = '';

				if (answer) {
					if (answer.type === 1 && answer.selectedOption !== undefined) { // 单选题
						selectedOption.value = answer.selectedOption;
					} else if (answer.type === 2 && Array.isArray(answer.selectedOptions)) { // 多选题
						selectedOptions.value = [...answer.selectedOptions];
					} else if (answer.type === 3 && answer.fillValue !== undefined) { // 填空题
						fillValue.value = answer.fillValue;
					}
				}
			};

			// 提交问卷
			const submitQuestionnaire = async () => {

				const res = await createFinish();
				finishId.value = await getFinishId()

				if (res.code === 4090) {
					uni.showToast({
						title: '您已填写该问卷',
						icon: 'success'

					});
				}

				// 构建答案列表
				if (res.code === 200) {
					const answerList = [];
					// 遍历所有题目，收集答案
					for (let i = 0; i < questions.value.length; i++) {
						const question = questions.value[i];
						const savedAnswer = answers.value[i];

						if (question.type === 1) { // 单选题
							const answer = {
								questionId: question.id,
								questionnaireId: questionnaireId.value,
								finishId: finishId.value,
								type: question.type
							};

							if (savedAnswer && savedAnswer.selectedOption !== undefined &&
								question.options[savedAnswer.selectedOption]) {
								answer.optionId = question.options[savedAnswer.selectedOption].optionId;
								answerList.push(answer);
							}
						} else if (question.type === 2) { // 多选题
							// 多选题需要分多次提交，每次提交一个optionId
							if (savedAnswer && Array.isArray(savedAnswer.selectedOptions)) {
								for (const index of savedAnswer.selectedOptions) {
									if (question.options[index]) {
										const answer = {
											questionId: question.id,
											questionnaireId: questionnaireId.value,
											finishId: finishId.value,
											type: question.type,
											optionId: question.options[index].optionId
										};
										answerList.push(answer);
									}
								}
							}
						} else if (question.type === 3) { // 填空题
							const answer = {
								questionId: question.id,
								questionnaireId: questionnaireId.value,
								finishId: finishId.value,
								type: question.type
							};

							if (savedAnswer && savedAnswer.fillValue !== undefined) {
								answer.answerContent = savedAnswer.fillValue;
								answerList.push(answer);
							}
						}
					}

					// 上传答案
					const answerRes = await createAnswer(answerList);
					if (answerRes.code !== 200) {
						console.error('上传答案失败:', answerRes.message);
						uni.showToast({
							title: '答案上传失败',
							icon: 'none'
						});
						return;
					}

					// 提交成功
					uni.showToast({
						title: '问卷提交成功',
						icon: 'success'
					});
				}

				// 1.5秒后跳转到部门列表
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/paper/paper'
					});
				}, 1500);
			};

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

			// 在返回语句之前，currentIndex和currentQuestion需要正确初始化
			currentIndex.value = 0;
			if (questions.value.length > 0) {
				currentQuestion.value = questions.value[currentIndex.value];
			}

			return {
				questions,
				currentIndex,
				selectedOption,
				selectedOptions,
				fillValue,
				currentQuestion,
				questionnaireId,
				username,
				answers,
				getQuestions,
				selectOption,
				toggleOption,
				saveCurrentAnswer,
				restoreCurrentAnswer,
				prevQuestion,
				nextQuestion,
				navigateToDepartment,
				navigateToPaper,
				navigateToInfo
			};
		}
	};
</script>

<style lang="scss">
	.questionnaire-container {
		padding: 20rpx;
		padding-bottom: 100rpx;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		min-height: 100vh;
	}

	.header {
		height: 120rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.progress-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.progress-bar {
		width: 70%;
		height: 12rpx;
		background-color: #e0e0e0;
		border-radius: 6rpx;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #007aff, #00d4ff);
		border-radius: 6rpx;
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 24rpx;
		color: #666;
		width: 25%;
		text-align: right;
	}

	.question-content {
		margin-top: 150rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.question-text {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 30rpx;
		display: block;
		font-weight: 500;
		line-height: 1.5;
	}

	.question-type {
		font-size: 28rpx;
		color: #007aff;
		margin-bottom: 20rpx;
		display: block;
		font-weight: bold;
	}

	.options {
		margin-top: 20rpx;
	}

	.option-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.05);
	}

	.option-item.selected {
		border-color: #007aff;
		background-color: rgba(0, 122, 255, 0.1);
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 10rpx rgba(0, 122, 255, 0.15);
	}

	.option-label {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-color: #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.option-item.selected .option-label {
		background: linear-gradient(135deg, #007aff, #00d4ff);
		color: #fff;
	}

	.option-text {
		font-size: 28rpx;
		color: #333;
		flex: 1;
	}

	.textarea-container {
		margin-top: 20rpx;
	}

	.textarea {
		width: 100%;
		height: 200rpx;
		padding: 20rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: #333;
		background-color: #fff;
		box-sizing: border-box;
		box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.05);
	}

	.textarea:focus {
		border-color: #007aff;
		outline: none;
	}

	.button-group {
		margin-top: 60rpx;
		padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
	}

	.btn {
		width: 45%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		border-radius: 45rpx;
		font-size: 32rpx;
		font-weight: 500;
		border: none;
		transition: all 0.3s ease;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.prev-btn {
		background-color: #f5f5f5;
		color: #666;
	}

	.prev-btn:active {
		background-color: #e0e0e0;
		transform: translateY(2rpx);
	}

	.prev-btn:disabled {
		background-color: #f5f5f5;
		color: #999;
		opacity: 0.6;
	}

	.next-btn {
		background: linear-gradient(135deg, #007aff, #00d4ff);
		color: #fff;
	}

	.next-btn:active {
		background: linear-gradient(135deg, #0066cc, #00b3e6);
		transform: translateY(2rpx);
	}

	.next-btn:disabled {
		background: #999;
		opacity: 0.6;
	}

	/* 底部导航样式 */
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
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.tab-item {
		font-size: 28rpx;
		color: #999;
		text-align: center;
		padding: 10rpx 0;
		flex: 1;
		transition: all 0.3s ease;
	}

	.tab-item.active {
		color: #007aff;
		font-weight: bold;
		transform: scale(1.1);
	}
</style>