// pages/home-video/index.js
import { getTopMV } from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getTopMVData(0)
  },
  
  async getTopMVData(offset = 0) {
    if (!this.data.hasMore && offset !== 0) return 
    wx.showNavigationBarLoading()
    const res = await getTopMV(offset)
    let newData = this.data.topMVs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    this.setData({ topMVs: newData })
    this.setData({ hasMore: res.hasMore })
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      setTimeout(() => {
      wx.stopPullDownRefresh()
      }, 300)
    }
  },

  //点击事件
  handleVideoItemClick(event) {
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id
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
  onPullDownRefresh: async function () {
   this.getTopMVData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    this.getTopMVData(this.data.topMVs.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})