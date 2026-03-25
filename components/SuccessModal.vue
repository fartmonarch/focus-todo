<template>
    <view v-if="visible" class="modal-mask">
        <view class="modal-content card" :class="{ 'show': animate }">
            <view class="icon-box">
                <view class="check-mark">✓</view>
            </view>
            <text class="title">专注达成！</text>
            <text class="msg">你已经完成了一个番茄钟，喝口水休息一下吧。</text>
            <button class="confirm-btn" @click="handleClose">收到</button>
        </view>
    </view>
</template>

<script setup>
    import {
        ref,
        watch
    } from 'vue'

    const props = defineProps({
        show: Boolean
    })
    const emit = defineEmits(['close'])
    const visible = ref(false)
    const animate = ref(false)

    watch(() => props.show, (newVal) => {
        if (newVal) {
            visible.value = true
            setTimeout(() => {
                animate.value = true
            }, 50)
        } else {
            animate.value = false
            setTimeout(() => {
                visible.value = false
            }, 300)
        }
    })

    const handleClose = () => {
        emit('close')
    }
</script>

<style lang="scss" scoped>
    .modal-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
    }

    .modal-content {
        width: 560rpx;
        padding: 60rpx;
        background: #fff;
        border-radius: 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: scale(0.8);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

        &.show {
            transform: scale(1);
            opacity: 1;
        }
    }

    .icon-box {
        width: 120rpx;
        height: 120rpx;
        background: #e8f5e9;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 40rpx;

        .check-mark {
            color: #4caf50;
            font-size: 60rpx;
            font-weight: bold;
        }
    }

    .title {
        font-size: 44rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
    }

    .msg {
        font-size: 30rpx;
        color: #666;
        text-align: center;
        margin-bottom: 60rpx;
        line-height: 1.6;
    }

    .confirm-btn {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        background: #007aff;
        color: #fff;
        border-radius: 50rpx;
        font-weight: bold;
        border: none;
        box-shadow: 0 10rpx 20rpx rgba(0, 122, 255, 0.2);
    }
</style>