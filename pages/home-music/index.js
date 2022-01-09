// pages/home-music/index.js
import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
import { rankingStore, rankingMap } from '../../store/ranking-store'

const throttleQueryRect = throttle(queryRect)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 100,
    recommendSongs: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    rankings: { 0: {}, 2: {}, 3: {} }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
    rankingStore.dispatch('getRankingDataAction')
    rankingStore.onState('hotRanking', res => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })
    rankingStore.onState('newRanking', this.getRankingHandler(0))
    rankingStore.onState('originRanking', this.getRankingHandler(2))
    rankingStore.onState('upRanking', this.getRankingHandler(3))
  },

  handleSwiperImageLoaded() {
    throttleQueryRect('.swiper-image').then(res => {
      const rect = res[0]
      this.setData({ swiperHeight: rect.height })
    })
  },

  getPageData() {
    getBanners().then(res => {
      this.setData({ banners: res.banners })
    })
    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })
    getSongMenu('华语').then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },

  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index'
    })
  },

  getRankingHandler(idx) {
    return (res) => {
      if (!Object.keys(res).length) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = { name, coverImgUrl, songList, playCount }
      const newrankings = {...this.data.rankings, [idx]: rankingObj}
      this.setData({ rankings: newrankings })
    }
  },

  getNewRankingHandler(res) {
    if (!Object.keys(res).length) return
    const name = res.name
    const coverImgUrl = res.coverImgUrl
    const songList = res.tracks.slice(0, 3)
    const rankingObj = { name, coverImgUrl, songList }
    const originRankings = [...this.data.rankings]
    originRankings.push(rankingObj)
    this.setData({ rankings: originRankings })
  },

  handleMoreClick() {
    this.navigateToDetailSongsPage('hotRanking')
  },

  handleRankingItemClick(event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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