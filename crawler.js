const https = require('https')
const cheerio = require('cheerio');
const fs = require('fs');

const targetUrl = 'https://www.lanrentuku.com'

https.get(targetUrl, function (res) {
  // 分段返回的 自己拼接
  let html = '';
  // 有数据产生的时候 拼接
  res.on('data', function (chunk) {
    html += chunk;
  })
  // 拼接完成
  res.on('end', function () {
    const $ = cheerio.load(html);
    let allFilms = [];
    $('.in-nes dd').each(function () {
      // const title = $('.title', this).text();
      // const star = $('.rating_num', this).text();
      const pic = $('img', this).attr('src');
      console.log(pic)
      allFilms.push({
        // title,
        // star,
        pic
      })
      // 存json文件
      fs.writeFile('./data.json', JSON.stringify(allFilms), function (err) {
        if (!err) {
          console.log('文件写入完毕');
        }
      })
    })
    downloadImage(allFilms);
  })
})

function downloadImage(allFilms) {
  for (let i = 0; i < allFilms.length; i++) {
    const picUrl = allFilms[i].pic;
    // 请求 -> 拿到内容
    // fs.writeFile('./xx.png','内容')
    https.get(picUrl, function (res) {
      res.setEncoding('binary');
      let str = '';
      res.on('data', function (chunk) {
        str += chunk;
      })
      res.on('end', function () {
        fs.writeFile(`./images/crawler${i}.png`, str, 'binary', function (err) {
          if (!err) {
            console.log(`第${i}张图片下载成功`);
          }
        })
      })
    })
  }
}