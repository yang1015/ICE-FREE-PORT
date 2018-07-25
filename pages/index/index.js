//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello there',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        musicCondition: false
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../posts/posts'
        })
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res =>
            {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                app.globalData.userInfo = res.userInfo
            this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
            })
        }
        })
        }
    },
    onUnload: function () {
        console.log("unload");
    },
    onHide: function () {
        console.log("onHide: " + this.data.musicCondition);
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    controlMusic: function () {

        var musicCondition = this.data.musicCondition;
        // console.log("当前状态: " + musicCondition);


        if (!musicCondition) {
            console.log("现在开始播放")
            this.setData({
                musicCondition: true
            });
            wx.playBackgroundAudio({
                dataUrl: 'http://fs.w.kugou.com/201807191940/583498b55226c0f96735956e9609445e/G012/M0A/1E/18/TA0DAFUMNrmAC09fAD5fV8A60wY759.mp3',
                title: '烟霞',
                coverImgUrl: 'http://i.gtimg.cn/music/photo/mid_album_90/0/F/003V7SAg16Ed0F.jpg'
            });

        } else {
            console.log("暂停");
            this.setData({
                musicCondition: false
            });
            wx.pauseBackgroundAudio();

        }
    }
})