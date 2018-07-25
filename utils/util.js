const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function httpRequest(url, method, callback) {
  wx.request({
      url: url,
      method: method,
      success: function(res) {
        callback(res.data);
      }
  })
}


function processDoubanData (moviesFromDouban) {
  var movies_formated = [];

  for (var i = 0; i < moviesFromDouban.length; i++) {
    let currentMovieFromDouban = moviesFromDouban[i];
    var movieItem = {
      title: currentMovieFromDouban.original_title.length >= 7 ? currentMovieFromDouban.original_title.substring(0, 7) + "..." : currentMovieFromDouban.original_title,
      image: currentMovieFromDouban.images.large,
      stars: {
        starsArr: convertStarsToArray(currentMovieFromDouban.rating.stars),
        starsValue: currentMovieFromDouban.rating.stars / 10,
        average: currentMovieFromDouban.rating.average
      },

      movieId: currentMovieFromDouban.id
    }
    movies_formated[i] = movieItem;
  }

  return movies_formated;

}

function convertStarsToArray(starsFromData) {
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

}
module.exports = {
  formatTime: formatTime,
    httpRequest: httpRequest,
  processDoubanData: processDoubanData
}
