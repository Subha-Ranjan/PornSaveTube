const express = require("express");
const router = express.Router();

const xvideos = require("xvideosx");
const spankbang = require("spankbang");

const { PornHub } = require("pornhub.js");
const pornhub = new PornHub();

var m3u8ToMp4 = require("m3u8-to-mp4");
var converter = new m3u8ToMp4();
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

router.get("/", async (req, res) => {
  let fileUrl =
    "https://ev-h.phncdn.com/hls/videos/202311/07/442578151/240P_1000K_442578151.mp4/master.m3u8?validfrom=1716145276&validto=1716152476&ipa=193.148.16.4&hdl=-1&hash=8abuvXjRaJ7QTOODSl5dc8RpH%2BA%3D";
  await converter.setInputFile(fileUrl).setOutputFile("dummy.mp4").start();

  console.log("File converted");
  res.send("API wrkoing fine");
});

router.post("/", async (req, res) => {
  const url = req.body.link;

  if (url.includes("pornhub")) {
    console.log("Pornhub API calling");
    let files = [];
    pornhub
      .video(url)
      .then((data) => {
        data.mediaDefinitions.map((file) => {
          files.push({
            url: file.videoUrl.replace(/\\/g, ""),
            quality: file.quality+"p",
          });

          // converter
          //   .setInputFile(
          //    videoDetail.videoUrl.replace(/\\/g, "")
          //   )
          //   .setOutputFile(videoDetail.videoUrl.replace(/\\/g, "").split('/')[8])
          //   .start()
          //   .then(() => {
          //     console.log("File converted");
          //   });

          console.log(data)
        });
        videoDetails={ platform:' PornHub',title:data.title, duration:data.duration,image:data.thumb, files: [...files]};
        console.log(videoDetails);

        res.send(videoDetails);
      })
      .catch((err) => console.log("So ther is some error: \n", err));
  } else if (url.includes("xvideos")) {
    console.log("Xvideos API calling");
    const details = await xvideos.videos.details({ url });
    let videoDetails = { platform:' Xvideos',title:details.title, image:details.image, duration:details.duration, files:[{quality: '240p', url:details.files.low}, {quality:'360p', url:details.files.high}]};

    console.log(details);
    res.send(videoDetails);
  } else if (url.includes("spankbang")) {
    console.log("Spankbang API calling");
    const details = await spankbang.videos.details({ url });
    let videoDetails = { platform:' Spankbang',title:details.name, duration:details.duration,image:details.thumbNail, files: [...details.files]};
    // videoDetails=videoDetails.filter(a=> a.quality!=='hls' && a.url !=='')
    console.log(details)
    res.send(videoDetails);
  } else {
    res.send("Invalid Link");
  }
});

module.exports = router;
