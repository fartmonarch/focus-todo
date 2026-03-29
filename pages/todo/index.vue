<template>
    <view class="container">
        <view class="input-section card">
            <input v-model="newTodoText" class="todo-input" placeholder="请输入待办" @confirm="handleAddTodo" />
            <button class="add-btn" @click="handleAddTodo">添加</button>
        </view>

        <view class="list-section">
            <TodoItem v-for="item in todoStore.list" :key="item.id" :item="item" @toggle="todoStore.toggle"
                @delete="todoStore.deleteTodo" />
        </view>
        <view v-if="showNotice" class="notice-mask" @touchmove.stop.prevent>
            <view class="notice-card" :class="{ 'fade-in': showNotice }">
                <view class="notice-header">
                    <text class="notice-title">项目全端上线通知</text>
                </view>

                <scroll-view scroll-y="true" class="notice-body">
                    <view class="notice-item">
                        <view class="tag-row">
                            <text class="platform-tag web">Web端</text>
                        </view>
                        <text class="platform-desc">关闭弹窗后即可自由调节比例体验。</text>
                    </view>

                    <view class="notice-item">
                        <view class="tag-row">
                            <text class="platform-tag android">Android</text>
                        </view>
                        <text class="platform-desc">原生 APK 稳定版已开放：</text>
                        <view class="apk-link" @click="openApk">点击下载 focu-todo.apk</view>
                    </view>

                    <view class="notice-item">
                        <view class="tag-row">
                            <text class="platform-tag wechat">微信小程序</text>
                        </view>
                        <text class="platform-desc">版本正在火热审核中...</text>
                    </view>
                </scroll-view>

                <button class="close-notice-btn" @click="showNotice = false">我知道了</button>
            </view>
        </view>
    </view>
</template>

<script setup>
    // 兜底：避免某些构建产物引用 process 导致 H5 报错
    window.process = window.process || {
        env: {}
    };
    import {
        ref,
        onMounted
    } from 'vue'
    import {
        useTodoStore
    } from '@/stores/todo'
    import TodoItem from '@/components/TodoItem.vue'

    const todoStore = useTodoStore()
    const newTodoText = ref('')
    const showNotice = ref(false)

    onMounted(() => {
        // 页面加载后延迟 500ms 弹出，更有仪式感
        setTimeout(() => {
            showNotice.value = true
        }, 500)
    })
    const handleAddTodo = () => {
        todoStore.add(newTodoText.value)
        newTodoText.value = ''
    }

    const openApk = () => {
        // H5
        // #ifdef H5
        window.location.href = 'https://mp-2d012ba8-8636-4fed-8395-31639f4b437a.cdn.bspapp.com/focu-todo.apk'
        // #endif

        // App
        // #ifdef APP-PLUS
        plus.runtime.openURL('https://mp-2d012ba8-8636-4fed-8395-31639f4b437a.cdn.bspapp.com/focu-todo.apk')
        // #endif
    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 30rpx;
    }

    .input-section {
        display: flex;
        align-items: center;
        padding: 20rpx 30rpx;

        .todo-input {
            flex: 1;
            height: 70rpx;
            font-size: 32rpx;
        }

        .add-btn {
            margin-left: 20rpx;
            width: 140rpx;
            height: 70rpx;
            line-height: 70rpx;
            font-size: 28rpx;
            background: #007aff;
            color: #fff;
            border-radius: 12rpx;

            &::after {
                border: none;
            }
        }
    }

    /* 全屏遮罩：负责半透明背景和居中 */
    .notice-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7); // 稍微透一点底部的表盘
        backdrop-filter: blur(5px); // 增加毛玻璃质感
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    /* 悬浮卡片：适中大小 */
    .notice-card {
        width: 80%; // 移动端宽度
        max-width: 600rpx; // 限制最大宽度，防止在大屏下太宽
        background: #1e1e1e;
        border-radius: 32rpx;
        border: 1rpx solid #333;
        padding: 40rpx;
        box-shadow: 0 30rpx 60rpx rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        animation: modalShow 0.3s ease-out; // 增加一个小小的入场动画
    }

    @keyframes modalShow {
        from {
            opacity: 0;
            transform: translateY(20rpx) scale(0.9);
        }

        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .notice-header {
        margin-bottom: 30rpx;
        text-align: center;
    }

    .notice-title {
        color: #fff;
        font-size: 34rpx;
        font-weight: 600;
        letter-spacing: 2rpx;
    }

    .notice-body {
        max-height: 60vh; // 防止内容过多撑爆页面
    }

    .notice-item {
        background: #262626;
        padding: 24rpx;
        border-radius: 16rpx;
        margin-bottom: 24rpx;
    }

    .tag-row {
        margin-bottom: 12rpx;
    }

    .platform-tag {
        font-size: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 6rpx;

        &.web {
            background: #3b82f6;
            color: #fff;
        }

        &.android {
            background: #10b981;
            color: #fff;
        }

        &.wechat {
            background: #07c160;
            color: #fff;
        }
    }

    .platform-desc {
        color: #999;
        font-size: 26rpx;
        line-height: 1.4;
    }

    .apk-link {
        color: #3b82f6;
        font-size: 24rpx;
        display: block;
        margin-top: 16rpx;
        word-break: break-all;
        text-decoration: none;
        border: 1rpx solid #3b82f6;
        padding: 10rpx;
        text-align: center;
        border-radius: 8rpx;
    }

    .close-notice-btn {
        margin-top: 10rpx;
        background: #fff;
        color: #000;
        font-size: 28rpx;
        font-weight: bold;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        border: none;

        &:active {
            opacity: 0.8;
        }
    }
</style>