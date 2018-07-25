// pages/movies/more-movies/more-movies.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryType: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let categoryType = options.categoryType;

    this.setData({
      categoryType: categoryType
    });

    this.getMoviesUrl(categoryType);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.categoryType
    })
  },

  getMoviesUrl: function(categoryType) {
    var retrieveMoviesUrl;

    switch (categoryType) {
      case "正在热映":
        retrieveMoviesUrl = app.globalData.douban_base + 'v2/movie/in_theaters';
        break;
      case "豆瓣Top250":
        retrieveMoviesUrl = app.globalData.douban_base + "v2/movie/top250";
        break;
    }
    this.getMoviesData(retrieveMoviesUrl);
  },

  getMoviesData(retrieveMoviesUrl) {
    wx.request({
      url: retrieveMoviesUrl,
      method: "GET",
      success: function(res) {
        console.log(JSON.stringify(res.data));
      }
    })
  },




  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */

})