// pages/movies/more-movies/more-movies.js
var util = require('../../../utils/util.js/');
var app = getApp();


Page({
  data: {
    categoryType: "",
    retrieveMoviesUrl: "",
    moviesData: {},
    totalCount: 0,
    refresh: 0
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

  /* 给moviesData增加一个movies的属性，方便在movie-list里直接...展开调取对象的属性 */
  getMoviesData(resData) {

    if (JSON.stringify(resData.subjects) != "{}") {
      let moviesData = this.data.moviesData;
      let formattedData = util.processDoubanData(resData.subjects);
      moviesData.movies = formattedData;
      this.setData({
        moviesData: moviesData
      });
    } else {
      console.log("接口有错 没有返回data")
    }

  },

  /* Page内函数 监听触底刷新 无需window配置开启 但是可以选配onReachBottomDistance*/
  onReachBottom() {
    console.log("触发触底函数");
    let nextUrl = this.data.retrieveMoviesUrl + "?start=0" + "&count=" + this.data.totalCount;
    util.httpRequest(nextUrl, "GET", this.loadMoreMovies);
    wx.showLoading();
  },

  loadMoreMovies: function(resData) {
    let formattedData = util.processDoubanData(resData.subjects);
    let moviesData = this.data.moviesData;
    moviesData.movies = formattedData;

    this.setData({
      moviesData: moviesData,
      totalCount: this.data.refresh == 0 ? this.data.totalCount + 20 : this.data.totalCount
      // refresh的情况 totalcount不增加
    });

    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  /* 
    在 Page 中定义 onPullDownRefresh 处理函数，监听该页面用户下拉刷新事件。 
    需要在 config 的window选项中开启 enablePullDownRefresh
  */
  onPullDownRefresh: function(event) {
    this.setData({
      refresh: 1
    });

    let refreshUrl = this.data.retrieveMoviesUrl + "?start=0" + "&count=20";
    util.httpRequest(refreshUrl, "GET", this.getMoviesData);
    wx.showLoading();
    wx.stopPullDownRefresh(); //怎么感觉不用这个也可以呢 = =
  },

  seeMovieDetail: function(event) {
    let movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: './../movie-detail/movie-detail?movieId=' + movieId,
    })
  }

})