var util = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        // movieId: ''
        movieDetail: {}
    },

    onLoad: function (options) {
        console.log("电影详情页面: " + options.movieId)
        // this.setData({
        //   movieId: options.movieId
        // });
        let movieDetailUrl = app.globalData.douban_base + 'v2/movie/subject/' + options.movieId
        util.httpRequest(movieDetailUrl, 'GET', this.getMovieDetailData);


    },
    getMovieDetailData(resData) {
        console.log("当前电影的数据为: " + JSON.stringify(resData));
        this.setData({
            movieDetail: resData
        });
    },

    onReady: function () {

    }


})