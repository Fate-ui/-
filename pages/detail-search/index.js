// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../service/api_search'
import debounce from '../../utils/debounce'
import { stringToNodes } from '../../utils/string-to-nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeyWords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },
  getPageData() {
    getSearchHot().then(res => {
      this.setData({ hotKeyWords: res.result.hots })
    })
  },

  handleSearchChange(event) {
    const searchValue = event.detail
    this.setData({ searchValue })
    if (!searchValue.length) {
      this.setData({ suggestSongs: [] })
      this.setData({ resultSongs: [] })
      debounceGetSearchSuggest.cancel()
      return
    }
    debounceGetSearchSuggest(searchValue).then(res => {
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      if (!suggestSongs) return

      //转nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  handleSearchAction() {
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },
  handleSuggestItemClick(event) {
    const index = event.currentTarget.dataset.index
    const keyword = this.data.suggestSongs[index].keyword
    this.setData({ searchValue: keyword })
    this.handleSearchAction()
  },
  handleTagItemClick(event) {
    const keyword = event.currentTarget.dataset.keyword
    this.setData({ searchValue: keyword })
    this.handleSearchAction()
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