import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    time: 25 * 60,
    running: false,
    timer: null
  }),

  actions: {
    start() {
      if (this.running) return

      this.running = true
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time--
        } else {
          this.reset()
        }
      }, 1000)
    },

    pause() {
      this.running = false
      clearInterval(this.timer)
    },

    reset() {
      clearInterval(this.timer)
      this.running = false
      this.time = 25 * 60
    }
  }
})