var util = require ("./../../utils/util.js");

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
  getMoviesInUS: function (moviesInUSUrl, moviesType, categoryTitle) {
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
  processDoubanData: function (moviesFromDouban, moviesType, categoryTitle) {
    var movies_formated = [];

    for (var i = 0; i < 4; i++) {
      let currentMovieFromDouban = moviesFromDouban[i];
      var movieItem = {
        title: currentMovieFromDouban.title.length >= 7 ? currentMovieFromDouban.title.substring(0, 7) + "..." : currentMovieFromDouban.title,
        image: currentMovieFromDouban.images.large,
        stars: {
          starsArr: this.convertStarsToArray(currentMovieFromDouban.rating.stars),
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

  convertStarsToArray: function(starsFromData) {
    let stars = parseInt(starsFromData / 10);

    let starArr = [];
    switch (stars) {
      case 1:
        starArr = [1, 0, 0, 0, 0];
        break;
      case 2:
        starArr = [1, 1, 0, 0, 0];
        break;
      case 3:
        starArr = [1, 1, 1, 0, 0];
        break;
      case 4:
        starArr = [1, 1, 1, 1, 0];
        break;
      case 5:
        starArr = [1, 1, 1, 1, 1];
        break;
      default:
        starArr = [0, 0, 0, 0, 0];
        break;
    }

    
    return starArr;

  },
  seeMoreMovies: function (event){
    
    let categoryTitle = event.target.dataset.categorytitle;
    wx.navigateTo({
      url: './more-movies/more-movies?categoryType=' + categoryTitle
    });
  },
  onInputChange: function(event){
    let finalContentEntered = event.detail.value;
    this.setData({
      searchContent: finalContentEntered
    });
    console.log("input changed: " + finalContentEntered)
  },
  onInputFocus: function(event) {
    // focus时，显示search panel，反之 显示contentContainer
    this.setData({
      showContentContainer: false,
      showSearchPanel: true
    });
  
  },
  onInputBlur: function(event) {
    console.log("blur: " + event.detail.value);

    if (event.detail.value != '') {
      this.setData({
        showContentContainer: false,
        showSearchPanel: true,
        searchContent: event.detail.value
      });
    } else {
      this.setData({
        showContentContainer: true,
        showSearchPanel: false
      });
    }
    
  },
  onInputConfirm: function(event) {
    
  },
  goSearch: function(event){
    
    let searchUrl = app.globalData.douban_base + 'v2/movie/search?tag=' + this.data.searchContent;
    util.httpRequest(searchUrl, "GET", this.getMoviesData);
  },

  getMoviesData: function (resData) {
    let formattedData = util.processDoubanData(resData.subjects);
    let searchResult = this.data.searchResult;
    searchResult.movies = formattedData;

    console.log("get")
    this.setData({
      searchResult: searchResult
    });
  },

  clearSearchPanel: function(){
    this.setData({
      showContentContainer: true,
      showSearchPanel: false,
      searchContent: ' ',
      searchResult: {}
    });
  },

  seeMovieDetail: function(event){
    let movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: './movie-detail/movie-detail?movieId=' + movieId,
    })
  }
  

});