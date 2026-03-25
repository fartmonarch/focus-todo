<template>
    <view class="timer-container">
        <view class="clock-box card">
            <view class="dial" id="dial-face" @touchstart="onTouchStart" @touchmove.stop.prevent="onTouchMove">
                <view v-for="n in 12" :key="n" class="scale" :style="{ transform: `rotate(${n * 30}deg)` }"></view>

                <view v-if="!timerStore.running" class="knob-wrapper"
                    :style="{ transform: `rotate(${timerStore.angle}deg)` }">
                    <view class="knob-handle"></view>
                </view>

                <view v-if="timerStore.running" class="hands-layer">
                    <view class="hand minute-hand" :style="{ transform: `rotate(${timerStore.angle}deg)` }"></view>
                    <view class="hand second-hand" :style="{ transform: `rotate(${timerStore.secondAngle}deg)` }">
                    </view>
                    <view class="center-cap"></view>
                </view>

                <view class="inner-time">{{ formatTime }}</view>
            </view>
        </view>

        <view class="control-panel">
            <button class="btn-main" :class="timerStore.running ? 'pause' : 'start'" @click="handleToggle">
                {{ timerStore.running ? '暂停' : '开始' }}
            </button>

            <view class="btn-reset-wrap" @click="handleReset">
                <text class="btn-reset-text">重置</text>
            </view>
        </view>
    </view>
</template>

<script setup>
    import {
        computed,
        onMounted,
        getCurrentInstance
    } from 'vue'
    import {
        useTimerStore
    } from '@/stores/timer'

    const timerStore = useTimerStore()
    const instance = getCurrentInstance()

    let audioCtx = null
    let clockCenter = {
        x: 0,
        y: 0
    }

    const formatTime = computed(() => {
        const m = Math.floor(timerStore.time / 60).toString().padStart(2, '0')
        const s = (timerStore.time % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    })

    onMounted(() => {
        audioCtx = uni.createInnerAudioContext()
        audioCtx.src = '/static/tick.mp3'

        setTimeout(() => {
            const query = uni.createSelectorQuery().in(instance)
            query.select('#dial-face').boundingClientRect(res => {
                if (res) {
                    clockCenter.x = res.left + res.width / 2
                    clockCenter.y = res.top + res.height / 2
                }
            }).exec()
        }, 500)
    })

    const playTick = () => {
        if (!audioCtx) return
        audioCtx.stop()
        audioCtx.play()
    }

    const handleToggle = () => {
        uni.setKeepScreenOn({
            keepScreenOn: true
        });
        if (timerStore.running) {
            timerStore.stopTimer()
        } else {
            // 启动时不传入回调函数 -> 倒计时过程将保持安静
            timerStore.start()
            uni.vibrateShort().catch(() => {})
        }
    }

    // 核心修改 2：强化重启逻辑
    const handleReset = () => {
        console.log('Reset triggered')
        timerStore.reset()
        uni.vibrateShort().catch(() => {})
    }

    const onTouchMove = (e) => {
        if (timerStore.running) return
        const touch = e.touches[0]
        const dx = touch.clientX - clockCenter.x
        const dy = touch.clientY - clockCenter.y

        let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
        if (angle < 0) angle += 360

        const steppedAngle = Math.round(angle / 6) * 6
        if (steppedAngle !== timerStore.angle) {
            timerStore.setTimeByAngle(steppedAngle)
            playTick() // 保留手动调节时的物理滴答声
        }
    }
</script>

<style lang="scss" scoped>
    .timer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40rpx;
    }

    .clock-box {
        width: 550rpx;
        height: 550rpx;
        background: #1a1a1a;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.4), inset 0 0 40rpx rgba(255, 255, 255, 0.05);
        border: 12rpx solid #2a2a2a;
    }

    .dial {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .scale {
        position: absolute;
        width: 4rpx;
        height: 16rpx;
        background: #444;
        top: 20rpx;
        left: 50%;
        margin-left: -2rpx;
        transform-origin: 2rpx 255rpx;
    }

    .knob-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;

        .knob-handle {
            width: 44rpx;
            height: 44rpx;
            background: #007aff;
            border-radius: 50%;
            border: 6rpx solid #fff;
            position: absolute;
            top: 10rpx;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0 0 20rpx rgba(0, 122, 255, 0.6);
        }
    }

    .inner-time {
        font-size: 80rpx;
        color: #eee;
        font-family: "Courier New", monospace;
        font-weight: bold;
        z-index: 1;
    }

    .hands-layer {
        position: absolute;
        width: 100%;
        height: 100%;

        .hand {
            position: absolute;
            left: 50%;
            bottom: 50%;
            transform-origin: bottom center;
            border-radius: 4rpx;
        }

        .minute-hand {
            width: 8rpx;
            height: 180rpx;
            background: #fff;
            z-index: 2;
        }

        .second-hand {
            width: 4rpx;
            height: 220rpx;
            background: #ff3b30;
            z-index: 3;
        }

        .center-cap {
            width: 20rpx;
            height: 20rpx;
            background: #ff3b30;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 4;
        }
    }

    .control-panel {
        margin-top: 80rpx;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .btn-main {
        width: 320rpx;
        height: 110rpx;
        line-height: 110rpx;
        border-radius: 55rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        transition: all 0.2s;

        &.start {
            background: #007aff;
            box-shadow: 0 10rpx 30rpx rgba(0, 122, 255, 0.4);
        }

        &.pause {
            background: #ff9500;
            box-shadow: 0 10rpx 30rpx rgba(255, 149, 0, 0.4);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .btn-reset {
        margin-top: 40rpx;
        background: transparent;
        color: #666;
        font-size: 28rpx;
        text-decoration: underline;
        border: none;
    }

    .control-panel {
        margin-top: 80rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
    }

    .btn-main {
        width: 340rpx;
        height: 110rpx;
        line-height: 110rpx;
        border-radius: 55rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        border: none;

        &.start {
            background: #007aff;
            box-shadow: 0 10rpx 30rpx rgba(0, 122, 255, 0.4);
        }

        &.pause {
            background: #ff9500;
            box-shadow: 0 10rpx 30rpx rgba(255, 149, 0, 0.4);
        }

        &:active {
            transform: scale(0.96);
            opacity: 0.9;
        }
    }

    .btn-reset-wrap {
        padding: 20rpx 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        &:active {
            opacity: 0.5;
        }
    }

    .btn-reset-text {
        color: #888;
        font-size: 28rpx;
        letter-spacing: 4rpx;
        text-decoration: none;
        border-bottom: 2rpx solid #444;
        /* 增加下划线暗示可点击 */
    }
</style>