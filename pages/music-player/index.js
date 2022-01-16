// pages/music-player/index.js
import { audioContext, playerStore } from '../../store/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    currentPage: 0,
    contentHeight: 0,
    lyricInfos: [],
    currentLyricText: '',
    currentLyricIndex: 0,
    isMusicLyric: true,
    durationTime: 0,
    currentTime: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })
    // 2.根据id获取歌曲信息
    this.setupPlayerStoreListener()
    //动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    const deviceRadio = globalData.deviceRadio
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })
    //创建播放器
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true
    this.setupAudioContextListener()
  },
  

  //事件监听
  setupAudioContextListener() {
    audioContext.onCanplay(() => {
      // audioContext.play()
    })
    audioContext.onTimeUpdate(() => {
      if (this.data.isSliderChanging) return
      const currentTime = audioContext.currentTime * 1000
      const sliderValue = currentTime / this.data.durationTime * 100
      this.setData({ sliderValue, currentTime })
      let i
      for (i = 0; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i]
        if (currentTime < lyricInfo.time) {
          break
        }
      }
      const currentLyricIndex = i - 1
      if (!this.data.lyricInfos.length) return
      if (this.data.currentLyricIndex == currentLyricIndex) return
      const currentLyricText = this.data.lyricInfos[currentLyricIndex].text
      const lyricScrollTop = currentLyricIndex * 35
      this.setData({ currentLyricText, currentLyricIndex, lyricScrollTop  })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  handleSwiperChange(event) {
    const currentPage = event.detail.current
    this.setData({ currentPage })
  },

  handleSliderChange(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    audioContext.pause()
    audioContext.seek(currentTime / 1000)
    this.setData({ sliderValue: value, isSliderChanging: false })
  },

  handleSliderChanging(event) {
    const value = event.detail.value
    const currentTime = audioContext.currentTime * 1000
    this.setData({ isSliderChanging: true, currentTime, sliderValue: value })
  },

  setupPlayerStoreListener() {
    playerStore.onStates(['currentSong', 'duration', 'lyricInfos'], ({ currentSong, duration, lyricInfos }) => {
      if (currentSong) this.setData({ currentSong })
      if (duration) this.setData({ duration })
      if (lyricInfos) this.setData({ lyricInfos })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})