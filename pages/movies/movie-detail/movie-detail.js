var util = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        // movieId: ''
        movieDetail: {}
    },

    onLoad: function (options) {
      
        let movieDetailUrl = app.globalData.douban_base + 'v2/movie/subject/' + options.movieId
        util.httpRequest(movieDetailUrl, 'GET', this.getMovieDetailData);


    },
    getMovieDetailData(resData) {
        

        resData.stars = {
            starsArr: util.convertStarsToArray(resData.rating.stars),
            starsValue: resData.rating.average
        }
        this.setData({
            movieDetail: resData
        });
    },
  previewFullPoster(event){
    let imageUrl = event.currentTarget.dataset.imageurl;
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: [imageUrl] // 需要预览的图片http链接列表 可以预览很多图片，这个必须有 哪怕只有一张 也要放在数组里
    })
  }
})