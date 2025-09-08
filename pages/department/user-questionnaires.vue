<template>
	<view class="user-questionnaires-container">
		<u-navbar 
			title="问卷" 
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

		<!-- 创建评论按钮 -->
		<view class="create-comment-button">
			<button class="comment-button" @click="showCommentModal = true">创建评论</button>
		</view>

		<!-- 评论列表 -->
		<view class="comment-list-header">
			<text class="comment-list-title">评论列表</text>
		</view>
		<!-- 这里是放置所有评论的地方 -->
		<view class="comment-list" v-if="comment && comment.length > 0">
			<view class="comment-item" v-for="(item, index) in comment" :key="index">
				<view class="comment-content-wrapper">
					<text class="comment-content">{{ item.content }}</text>
					<text class="comment-visibility"
						:class="{ 'visible': item.viewable === 1, 'hidden': item.viewable === 0 }">
						{{ item.viewable === 1 ? '可见' : '不可见' }}
					</text>
				</view>
				<view class="comment-actions">
					<button class="update-comment-button" @click="openUpdateModal(item)">更新</button>
					<button class="delete-comment-button" @click='deleteComment(item)'>删除</button>
				</view>
			</view>
		</view>

		<!-- 评论弹窗 -->
		<u-popup mode="center" :round="10" :closeable="true" v-model:show="showCommentModal"
			@close="showCommentModal = false" :customStyle="{top: '-20%'}">
			<view class="comment-modal">
				<view class="modal-header">
					<text class="modal-title">创建评论</text>
				</view>
				<view class="modal-content">
					<u-form :model="commentForm" ref="commentFormRef">
						<u-form-item label="评论内容" prop="content">
							<u-input v-model="commentForm.content" type="textarea" placeholder="请输入评论内容" />
						</u-form-item>
						<u-form-item label="可见性" prop="viewable">
							<u-radio-group v-model="commentForm.viewable">
								<u-radio :name="1">可见</u-radio>可见
								<u-radio :name="0">不可见</u-radio>不可见
							</u-radio-group>
							<text class="visibility-note">选择评论是否对用户可见</text>
						</u-form-item>
					</u-form>
				</view>
				<view class="modal-footer">
					<button class="modal-button cancel" @click="showCommentModal = false">取消</button>
					<button class="modal-button confirm" @click="submitComment">确定</button>
				</view>
			</view>
		</u-popup>

		<!-- 更新评论弹窗 -->
		<u-popup mode="center" :round="10" :closeable="true" v-model:show="showUpdateModal"
			@close="showUpdateModal = false" :customStyle="{top: '-20%'}">
			<view class="comment-modal">
				<view class="modal-header">
					<text class="modal-title">更新评论</text>
				</view>
				<view class="modal-content">
					<u-form :model="updateCommentForm" ref="updateCommentFormRef">
						<u-form-item label="评论内容" prop="content">
							<u-input v-model="updateCommentForm.content" type="textarea" placeholder="请输入评论内容" />
						</u-form-item>
						<u-form-item label="可见性" prop="viewable">
							<u-radio-group v-model="updateCommentForm.viewable">
								<u-radio :name="1">可见</u-radio>可见
								<u-radio :name="0">不可见</u-radio>不可见
							</u-radio-group>
							<text class="visibility-note">选择评论是否对用户可见</text>
						</u-form-item>
					</u-form>
				</view>
				<view class="modal-footer">
					<button class="modal-button cancel" @click="showUpdateModal = false">取消</button>
					<button class="modal-button confirm" @click="updateComment">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		onMounted
	} from 'vue';
	import {
		useRoute
	} from 'vue-router'
	import {
		request
	} from '../../common/request';
	import {
		ref,
		reactive
	} from 'vue'
	import {
		useDepartStore
	} from '@/stores/department.js';

	const route = useRoute()
	const questionnaireId = route.query.questionnaireId
	const username = route.query.username
	const token = uni.getStorageSync('authToken');
	const finishId = ref(null)
	const departStore = useDepartStore();
	const departmentDetail = departStore.getDepartmentDetail();
	const departmentId = departmentDetail.id
	const questionnaireData = reactive({
		title: '',
		description: ''
	})
	const answers = ref([])
	const questions = ref([])
	let a = ref([])
	const end = ref([])
	const commentForm = reactive({
		content: '',
		viewable: 1 // 默认可见
	})
	const commentFormRef = ref(null)
	const comment = ref([])
	const showCommentModal = ref(false)

	// 更新评论相关
	const updateCommentForm = reactive({
		id: null,
		content: '',
		viewable: 1
	})
	const showUpdateModal = ref(false)


	// 获取填空题答案
	function getFillAnswer(questionIndex) {
		const question = end.value[questionIndex];
		// 处理答案不存在或为空的情况
		if (!question || question.type !== 3 || !question.answerContent) return '';
		return question.answerContent;
	}

	async function deleteComment(item) {
		const res = await request({
			url: `/comment/delete?id=${item.id}`,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`
			},
			method: "POST"
		})
		if (res.code === 200) {
			uni.showToast({
				title: '评论删除成功',
				icon: 'success'
			})
			// 重新获取评论列表以更新页面显示
			await getCommentByFinishId()
		} else {
			uni.showToast({
				title: '评论删除失败',
				icon: 'none'
			})
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
		if (Array.isArray(res.data)) {
			comment.value = res.data
		} else if (res.data !== null && res.data !== undefined) {
			// 如果res.data不是数组但有值，将其转换为数组
			comment.value = [res.data]
		} else {
			// 如果没有数据，设置为空数组
			comment.value = []
		}

	}
	// 提交评论
	async function submitComment() {
			const res = await request({
				url: `/comment/create`,
				header: {
					'content-type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				method: 'POST',
				data: {
					"content": commentForm.content,
					"finishId": finishId.value,
					"viewable": commentForm.viewable
				}
			})

			if (res.code === 200) {
				uni.showToast({
					title: '评论创建成功',
					icon: 'success'
				})
				showCommentModal.value = false
				// 重置表单
				commentForm.content = ''
				commentForm.viewable = 1
				// 重新获取评论列表以更新页面显示
				await getCommentByFinishId()
				// 确保弹窗关闭
				setTimeout(() => {
					showCommentModal.value = false
				}, 100)
			} else if (res.code === 409) {
				uni.showToast({
					title: '您已对该问卷发表评论',
					icon: 'none'
				})
			} else {
				uni.showToast({
					title: '评论创建失败',
					icon: 'none'
				})
			}
		 
	}
	// 打开更新评论弹窗
	function openUpdateModal(item) {
		updateCommentForm.id = item.id
		updateCommentForm.content = item.content
		updateCommentForm.viewable = item.viewable
		showUpdateModal.value = true
	}

	// 更新评论
	async function updateComment() {
		try {
			const res = await request({
				url: '/comment/update',
				header: {
					'content-type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				method: 'POST',
				data: {
					"id": updateCommentForm.id,
					"content": updateCommentForm.content,
					"finishId": finishId.value,
					"viewable": updateCommentForm.viewable
				}
			})

			if (res.code === 200) {
				uni.showToast({
					title: '评论更新成功',
					icon: 'success'
				})
				showUpdateModal.value = false
				// 重新获取评论列表
				await getCommentByFinishId()
			} else {
				uni.showToast({
					title: '评论更新失败',
					icon: 'none'
				})
			}
		} catch (error) {
			console.error('更新评论失败:', error)
			uni.showToast({
				title: '评论更新失败',
				icon: 'none'
			})
		}
	}
	async function getFinishId() {
		try {
			const res = await request({
				url: `/answer/view/user_questionnaire?username=${username}&questionnaireId=${questionnaireId}`,
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
			if (res.data.code === 401 && res.data.msg === '无权限') {
				uni.showToast({
					title: '此用户与您同为管理,无法查看其问卷',
					icon: 'none',
					duration: 2000
				});
			}

		} catch (error) {
			answers.value = [];
		}
		return false; // 表示getAnswer失败
	}

	async function getQuestion() {
		try {
			const res = await request({
				url: `/department/view/questions?departmentId=${departmentId}`,
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					'Authorization': `Bearer ${token}`
				},
			})
			questions.value = res.data.questions
			QA();

		} catch (error) {
			console.error('获取问卷信息失败:', error)
		}
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

	.create-comment-button {
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}

	.comment-button {
		background-color: #007AFF;
		color: white;
		border: none;
		border-radius: 50rpx;
		padding: 10rpx 80rpx;
		font-size: 32rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 122, 255, 0.3);
		transition: all 0.3s ease;
		min-width: 200rpx;
	}

	.comment-button:hover {
		background-color: #0056cc;
		transform: translateY(-2rpx);
		box-shadow: 0 6rpx 15rpx rgba(0, 122, 255, 0.4);
	}

	.update-comment-button {
		background-color: #4CAF50;
		color: white;
		border: none;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		font-size: 24rpx;
		min-width: 100rpx;
		margin-bottom: 10rpx;
	}

	.delete-comment-button {
		background-color: #F44336;
		color: white;
		border: none;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		font-size: 24rpx;
		min-width: 100rpx;
	}

	.comment-list-header {
		margin-top: 40rpx;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.comment-list-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		border-bottom: 2rpx solid #007AFF;
		padding-bottom: 10rpx;
		display: inline-block;
	}

	.comment-list {
		margin-top: 40rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.comment-item {
		padding: 20rpx;
		border-bottom: 2rpx solid #eee;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.comment-item:last-child {
		border-bottom: none;
	}

	.comment-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-left: 20rpx;
	}

	.comment-content {
		font-size: 28rpx;
		color: #333;
	}

	.comment-content-wrapper {
		display: flex;
		flex-direction: column;
	}

	.comment-visibility {
		font-size: 24rpx;
		margin-top: 10rpx;
		display: inline-block;
		padding: 5rpx 15rpx;
		border-radius: 8rpx;
	}

	.comment-visibility.visible {
		background-color: #e8f5e9;
		color: #4caf50;
		border: 1rpx solid #4caf50;
	}

	.comment-visibility.hidden {
		background-color: #ffebee;
		color: #f44336;
		border: 1rpx solid #f44336;
		float: right;
	}

	.comment-modal {
		width: 600rpx;
		padding: 40rpx;
		background-color: #fff;
	}

	.comment-modal .visibility-note {
		font-size: 12px;
		color: #999;
		margin-top: 5px;
		display: block;
	}

	/* 可见性选项样式优化 */
	.comment-modal .u-radio-group {
		flex-direction: row !important;
	}

	.comment-modal .u-radio {
		margin-right: 20rpx;
	}

	.comment-modal .u-radio:nth-child(1) .u-radio__text {
		color: #4CAF50;
		font-weight: bold;
	}

	.comment-modal .u-radio:nth-child(2) .u-radio__text {
		color: #F44336;
		font-weight: bold;
	}

	.modal-header {
		text-align: center;
		margin-bottom: 30rpx;
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.modal-content {
		margin-bottom: 30rpx;
	}

	.modal-footer {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.modal-button {
		flex: 1;
		border: none;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 32rpx;
	}

	.cancel {
		background-color: #f0f0f0;
		color: #666;
		margin-right: 20rpx;
	}

	.confirm {
		background-color: #007AFF;
		color: white;
		margin-left: 20rpx;
	}
</style>