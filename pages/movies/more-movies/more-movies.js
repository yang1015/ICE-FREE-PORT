// pages/movies/more-movies/more-movies.js
var util =  require('../../../utils/util.js/');
var app = getApp();


Page({
  data: {
    categoryType: "",
    retrieveMoviesUrl: "",
    moviesData: {},
    totalCount: 20
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

    this.setData({
      retrieveMoviesUrl: retrieveMoviesUrl
    })
    
    util.httpRequest(retrieveMoviesUrl, "GET", this.getMoviesData);
  },

  getMoviesData: function(resData) {

    let formattedData = util.processDoubanData(resData.subjects);
   
    let moviesData = this.data.moviesData;
    moviesData.movies = formattedData;
    this.setData({
      moviesData: moviesData,
      totalCount: this.data.totalCount + 20
    });
  },

  scrollToUpdate: function(){
    console.log("加载更多");

    let nextUrl = this.data.retrieveMoviesUrl + "?start=" + this.data.totalCount + "&count=20"; 
    util.httpRequest(nextUrl, "GET", this.getMoviesData);

  },


})