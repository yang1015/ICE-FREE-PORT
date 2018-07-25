//logs.js
// const util = require('../../utils/util.js')
var app = getApp();
var global_musicControl = app.globalData.global_musicControl

Page({
    data: {
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        autoplay: true,
        musicControl: global_musicControl
    },
    onLoad: function () {
        let this_ = this;
      if (global_musicControl) {
          this_.setData({
              musicControl: true
          });
      }

        this.setMusicMonitor();
    },
    setMusicMonitor: function(){
        let this_ = this;
        wx.onBackgroundAudioPlay(function(){
            console.log("触发 仍在播放")
            this_.setData({
                musicControl: true
            })
        });
        global_musicControl = true;

        wx.onBackgroundAudioPause(function() {
            console.log("触发 已经停止")
            this_.setData({
                musicControl: false
            })
        });
        global_musicControl = false;
    },
    onMusicTap: function() {

        var musicControl = this.data.musicControl;
        if (!musicControl) {
          global_musicControl = true;
          this.setData({
            musicControl: true
          });
            wx.playBackgroundAudio({
                dataUrl: 'http://m10.music.126.net/20180719114335/6d5e4b7bfab113bd2a966d5021c7d591/ymusic/0291/8459/991f/3f72ad6646ff36803996bba499bb33e9.mp3',
                title: 'K.',
                coverImgUrl: 'http://i.gtimg.cn/music/photo/mid_album_90/0/F/003V7SAg16Ed0F.jpg'
            });
        } else {
          this.setData({
            musicControl: false
          });
        global_musicControl = false;
            wx.pauseBackgroundAudio();
        }

    }
});
