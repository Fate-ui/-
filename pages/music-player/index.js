// pages/music-player/index.js
import { audioContext, playerStore } from '../../store/index'

const playModeNames = ['order', 'repeat', 'random']
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
    lyricScrollTop: 0,
    playModeIndex: 0,
    playModeName: 'order',
    isPlaying: false,
    playingName: 'pause'
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
    //audioContext事件监听
    // this.setupAudioContextListener()
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
    this.setData({ isSliderChanging: true, currentTime })
  },

  setupPlayerStoreListener() {
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfos'], ({ currentSong, durationTime, lyricInfos }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({ currentTime, currentLyricIndex, currentLyricText }) => {
      //时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }

      //歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })


    playerStore.onStates(['playModeIndex', 'isPlaying'], ({playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) this.setData({ playModeIndex: playModeIndex, playModeName: playModeNames[playModeIndex] })
      if (isPlaying !== undefined) this.setData({ isPlaying, playingName: isPlaying ? 'pause' : 'resume' })
    })
  },

  handleBackClick() {
    wx.navigateBack()
  },

  handleModeBtnClick() {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    playerStore.setState('playModeIndex', playModeIndex)
  },

  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },

  handlePrevBtnClick() {
    playerStore.dispatch('changeNewMusicAction', false)
  },

  handleNextvBtnClick() {
    playerStore.dispatch('changeNewMusicAction')
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