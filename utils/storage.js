export const setStorage = (key, data) => {
  try {
    uni.setStorageSync(key, data)
  } catch (e) {
    console.error('Set Storage Error', e)
  }
}

export const getStorage = (key, defaultValue = null) => {
  try {
    const val = uni.getStorageSync(key)
    return val !== '' ? val : defaultValue
  } catch (e) {
    return defaultValue
  }
}