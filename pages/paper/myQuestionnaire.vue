<template>
	<view class="user-questionnaires-container">
		<u-navbar 
			title="我的问卷" 
			left-icon="arrow-left" 
			auto-back
			bg-color="#F8F8F8"
			title-color="#000000"
			:border="false"
		>
		</u-navbar>

		<view class="questionnaire-list" v-if="questionnaireData">
			<view class="questionnaire-item">
				<view class="questionnaire-header">
					<text class="questionnaire-title">{{ questionnaireData.title }}</text>
				</view>

				<view class="questionnaire-content">
					<text class="questionnaire-description">{{ questionnaireData.description }}</text>

					<!-- 题目列表 -->
					<view class="questions-list">
						<view v-for="(question, qIndex) in end" :key="qIndex" class="question-item">
							<view class="question-header">
								<text class="question-number">{{ qIndex + 1 }}.</text>
								<text class="question-text">{{ question.content }}</text>
								<text class="question-type" v-if="question.type === 1">[单选题]</text>
								<text class="question-type" v-else-if="question.type === 2">[多选题]</text>
								<text class="question-type" v-else-if="question.type === 3">[填空题]</text>
							</view>

							<!-- 单选题答案 -->
							<view class="options" v-if="question.type === 1">
								<view v-for="(option, oIndex) in question.option" :key="oIndex" class="option-item">
									<view class="option-label">{{ String.fromCharCode(65 + oIndex) }}</view>
									<view class="option-text">{{ option.optionContent }}</view>
									<view class="checkmark">✓</view>
								</view>
							</view>

							<!-- 多选题答案 -->
							<view class="options" v-else-if="question.type === 2">
								<view v-for="(option, oIndex) in question.option" :key="oIndex" class="option-item">
									<view class="option-label">{{ String.fromCharCode(65 + oIndex) }}</view>
									<view class="option-text">{{ option.optionContent }}</view>
									<view class="checkmark">✓</view>
								</view>
							</view>

							<!-- 填空题答案 -->
							<view class="textarea-container" v-else-if="question.type === 3">
								<view class="user-answer">
									<text>{{ question.answerContent }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="empty-state" v-else>
			<text class="empty-text">暂无问卷数据</text>
		</view>

		<!-- 评论列表 -->
		<view class="comment-list" v-if="comment && comment.length > 0">
			<view class="comment-list-header">
				<text class="comment-list-title">评论</text>
			</view>
			<view class="comment-item" v-for="(item, index) in comment" :key="index">
				<text class="comment-content">{{ item.content }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		onMounted
	} from 'vue';
	import {
		request
	} from '../../common/request';
	import {
		ref,
		reactive
	} from 'vue'
	const item = uni.getStorageSync('QuestionnaireInfo')
	const token = uni.getStorageSync('authToken');
	const finishId = ref(null)

	const questionnaireData = reactive({
		title: '',
		description: ''
	})
	const answers = ref([])
	const questions = ref([])
	let a = ref([])
	const end = ref([])
	const comment = ref([])

	// 获取填空题答案
	function getFillAnswer(questionIndex) {
		const question = end.value[questionIndex];
		// 处理答案不存在或为空的情况
		if (!question || question.type !== 3 || !question.answerContent) return '';
		return question.answerContent;
	}

	async function getFinishId() {
		try {
			const res = await request({
				url: `/answer/view/user_questionnaire?questionnaireId=${item.questionnaireId}`,
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					'Authorization': `Bearer ${token}`
				},
			})
			finishId.value = res.data.id
			await getAnswer()


		} catch (error) {
			console.error('获取问卷完成ID失败:', error)
		}
	}

	async function getAnswer() {
		try {
			const res = await request({
				url: `/answer/view/answers?finishId=${finishId.value}`,
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					'Authorization': `Bearer ${token}`
				},
			})
			if (res.code === 200) {
				answers.value = res.data
				await getQuestion()
				return true; // 表示getAnswer成功
			}
		} catch (error) {
			answers.value = [];
		}
		return false; // 表示getAnswer失败
	}

	async function getQuestion() {
		try {
			const res = await request({
				url: `/department/view/questions?departmentId=${item.departmentId}`,
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					'Authorization': `Bearer ${token}`
				},
			})
			console.log('Question data:', res.data.questions);
			questions.value = res.data.questions
			QA();

		} catch (error) {
			console.error('获取问卷信息失败:', error)
		}
	}
	async function getCommentByFinishId() {
		const res = await request({
			url: `/comment/view/finish?finishId=${finishId.value}`,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`
			},
		})
		// 使用Array.isArray检查res.data是否为数组，并检查其长度
		comment.value = res.data.filter(val =>val.viewable===1)
	}

	function QA() {
		end.value = questions.value.map(question => {
			// 找到当前问题的答案
			const answer = answers.value.filter(ans => ans.questionId === question.id);

			if (answer.length > 0) {
				if (answer[0].type === 3) {
					question.answerContent = answer[0].answerContent;
				}

				if (answer[0].type === 2 || answer[0].type === 1) {
					const selectedId = answer.map(a => a.optionId);
					question.option = question.option.filter(opt =>
						selectedId.includes(opt.optionId)
					);
				}
			} else {
				// 如果没有答案，确保填空题有默认空内容，选择题选项不被过滤
				if (question.type === 3) {
					question.answerContent = '';
				}
			}

			return question;
		});
	}
	onBeforeMount(async () => {
		await getFinishId()
		await getCommentByFinishId()
		console.log(comment.value);
	})
</script>

<style scoped>
	.user-questionnaires-container {
		padding: 20rpx;
		background-color: #f5f7fa;
		min-height: 100vh;
	}

	.header {
		height: 120rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.questionnaire-list {
		margin-top: 20rpx;
	}

	.questionnaire-item {
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.questionnaire-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.questionnaire-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.questionnaire-date {
		font-size: 24rpx;
		color: #999;
	}

	.questionnaire-content {
		margin-top: 10rpx;
	}

	.questionnaire-description {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}

	.questions-list {
		margin-top: 30rpx;
	}

	.question-item {
		margin-bottom: 40rpx;
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.question-item:last-child {
		border-bottom: none;
		margin-bottom: 0;
	}

	.question-header {
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
	}

	.question-number {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-right: 10rpx;
	}

	.question-text {
		font-size: 32rpx;
		color: #333;
		flex: 1;
	}

	.question-type {
		font-size: 24rpx;
		color: #666;
		margin-left: 20rpx;
	}

	.options {
		margin-top: 20rpx;
	}

	.option-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		margin-bottom: 15rpx;
		background-color: #f8f9fa;
		border-radius: 10rpx;
		border: 2rpx solid #e9ecef;
	}

	.option-item.selected {
		background-color: #e3f2fd;
		border-color: #2196f3;
	}

	.option-label {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: #2196f3;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		font-weight: bold;
	}

	.option-text {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	.checkmark {
		color: #2196f3;
		font-weight: bold;
		font-size: 32rpx;
		margin-left: 20rpx;
	}

	.textarea-container {
		margin-top: 20rpx;
	}

	.user-answer {
		min-height: 100rpx;
		padding: 20rpx;
		background-color: #f8f9fa;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #333;
	}

	.empty-state {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60vh;
	}

	.empty-text {
		font-size: 32rpx;
		color: #999;
	}

	/* 评论列表样式 */
	.comment-list {
		margin-top: 30rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
		padding: 30rpx;
	}

	.comment-list-header {
		margin-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
		padding-bottom: 20rpx;
	}

	.comment-list-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.comment-item {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.comment-item:last-child {
		border-bottom: none;
	}

	.comment-content {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
</style>