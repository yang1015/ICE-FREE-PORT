var util = require("./../../utils/util.js");

var app = getApp();

Page({
  data: {
    moviesInTheaters: {},
    moviesTop250: {},
    showContentContainer: true,
    showSearchPanel: false,
    searchContent: '',
    searchResult: {}
  },

  onLoad: function(event) {
    let moviesInTheatersUrl = app.globalData.douban_base + 'v2/movie/in_theaters' + "?start=0&count=4";


    let moviesInUSUrl = app.globalData.douban_base + "v2/movie/top250" + "?start=0&count=4";
    this.getMoviesInTheaters(moviesInTheatersUrl, "moviesInTheaters", "正在热映");
    this.getMoviesInUS(moviesInUSUrl, "moviesTop250", "豆瓣Top250");
  },

  getMoviesInTheaters: function(moviesInTheatersUrl, moviesType, categoryTitle) {
    let this_ = this;
    wx.request({
      url: moviesInTheatersUrl,
      header: {
        "Content-Type": "json"
      },
      method: "GET",
      success: function(res) {
        this_.processDoubanData(res.data.subjects, moviesType, categoryTitle);
      }
    })
  },
  getMoviesInUS: function(moviesInUSUrl, moviesType, categoryTitle) {
    let this_ = this;
    wx.request({
      url: moviesInUSUrl,
      header: {
        "Content-Type": "json"
      },
      method: "GET",
      success: function(res) {
        this_.processDoubanData(res.data.subjects, moviesType, categoryTitle);
      }
    })
  },
  
  processDoubanData: function(moviesFromDouban, moviesType, categoryTitle) {
    var movies_formated = [];

    for (var i = 0; i < 4; i++) {
      let currentMovieFromDouban = moviesFromDouban[i];
      var movieItem = {
        title: currentMovieFromDouban.title.length >= 7 ? currentMovieFromDouban.title.substring(0, 7) + "..." : currentMovieFromDouban.title,
        image: currentMovieFromDouban.images.large,
        stars: {
          starsArr: util.convertStarsToArray(currentMovieFromDouban.rating.stars),
          starsValue: currentMovieFromDouban.rating.stars / 10,
          average: currentMovieFromDouban.rating.average
        },

        movieId: currentMovieFromDouban.id
      }
      movies_formated[i] = movieItem;
    }


    // var readyData = {};
    // readyData[moviesType] = {
    //   movies: movies_formated
    // }
    // this.setData(readyData);

    if (moviesType == "moviesInTheaters") {
      let moviesInTheaters = this.data.moviesInTheaters;
      moviesInTheaters.movies = movies_formated;
      moviesInTheaters.categoryTitle = categoryTitle;
      this.setData({
        moviesInTheaters: moviesInTheaters
      });

    } else {
      let moviesTop250 = this.data.moviesTop250;
      moviesTop250.movies = movies_formated;
      moviesTop250.categoryTitle = categoryTitle;
      this.setData({
        moviesTop250: moviesTop250
      });
    }
  },

  seeMoreMovies: function(event) {
    let categoryTitle = event.target.dataset.categorytitle;
    wx.navigateTo({
      url: './more-movies/more-movies?categoryType=' + categoryTitle
    });
  },

  /* 同步获取并设置搜索框输入内容 */
  onInputChange: function(event) {
    console.log("执行了change")
    let finalContentEntered = event.detail.value;
    this.setData({
      searchContent: finalContentEntered
    });
  },

  onInputFocus: function(event) {
    console.log("执行了focus")
    // focus时，显示search panel，反之 显示contentContainer
    this.setData({
      showContentContainer: false,
      showSearchPanel: true
    });
  },

  /* 失去焦点时： 如果搜索框有内容就搜索；没有内容就还是显示原数据 */
  onInputBlur: function(event) {
    console.log("执行了blur")
     /* 判断是否有内容，不要用' '/ ''，直接用长度判断 */
     
    if (this.data.searchContent.length == 0) {
      // 没有内容 => 显示原数据 隐藏搜索panel
      this.setData({
        showContentContainer: true,
        showSearchPanel: false
      });
    } else {
      this.setData({
        showContentContainer: false,
        showSearchPanel: true
      });
      this.goSearch();
    }
  },

  onInputConfirm: function(event) {
    console.log("confirm触发: " + this.data.searchContent)
      if (this.data.searchContent.length == 0) {
        wx.showToast({
          title: '请输入搜素内容',
          icon: 'none',
          duration: 2000
        });
      } else {
        this.goSearch();
      } 
  },

  goSearch: function(event) {
    console.log("执行了go search")
    let searchUrl = app.globalData.douban_base + 'v2/movie/search?tag=' + this.data.searchContent;
    util.httpRequest(searchUrl, "GET", this.getMoviesData);
  },

  getMoviesData: function(resData) {
    let formattedData = util.processDoubanData(resData.subjects);
    let searchResult = this.data.searchResult;
    searchResult.movies = formattedData; /* 添加一个movies属性 是为了在使用template的时候可以直接展开 */

    this.setData({
      searchResult: searchResult
    });
  },

  clearSearchPanel: function() {
    this.setData({
      showContentContainer: true,
      showSearchPanel: false,
      searchContent: ' ',
      searchResult: {}
    });
  },

  seeMovieDetail: function(event) {
    let movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: './movie-detail/movie-detail?movieId=' + movieId,
    })
  },

  onShareAppMessage() {
    return {
      title: 'testing小程序',
      path: '/pages/movies/movies',
      success: function(res){
        console.log("succeed");
      },
      fail: function (res){
        console.log("failed")
      }
    }
  }


});