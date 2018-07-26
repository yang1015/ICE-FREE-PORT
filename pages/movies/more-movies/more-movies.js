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
    onLoad: function (options) {

        let categoryType = options.categoryType;

        this.setData({
            categoryType: categoryType
        });

        this.getMoviesUrl(categoryType);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.data.categoryType
        })
    },

    getMoviesUrl: function (categoryType) {
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

    getMoviesData: function (resData) {
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

    scrollToUpdate: function () {


        let nextUrl = this.data.retrieveMoviesUrl + "?start=0" + "&count=" + this.data.totalCount;
        util.httpRequest(nextUrl, "GET", this.getMoviesData);
        wx.showLoading();

    },

    onPullDownRefresh: function (event) {

        this.setData({
            refresh: 1
        })
        let refreshUrl = this.data.retrieveMoviesUrl + "?start=0" + "&count=20";
        util.httpRequest(refreshUrl, "GET", this.getMoviesData);
        wx.showLoading();
    }


})