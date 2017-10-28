var request = require('request');
var fs = require('fs');

var url = "http://usa.iptv.stream.jw.org/api/v1/category?locale=en";
var host = "http://usa.iptv.stream.jw.org";
var VIDEO_PATH = "videos";

function main() {
   request.get(url, (err, resp, body) => {
      if (!body) {
         console.log("No data found");
         return false;
      }
      var channels = JSON.parse(body);
      var latest = [];
      channels.forEach(ch => {
         if (ch.key === "video") {
            ch.categories.forEach(cat => {
               if (cat.key === "latest") {
                  cat.media.forEach(media => {
                     getAndSaveMorningWorship(media);
                  });
               }
            });
         }
      });
   });
}

function getAndSaveMorningWorship(media) {
   if (media.title.indexOf("Morning Worship") > -1) {
      console.log("Found video: " + media.title);
      var mediaUrl = `${host}${media.source}`;
      var file = media.source.replace("/iptv/media/video/", "");
      request.get(mediaUrl)
         .on('response', () => console.log(`Downloading video: ${file}`))
         .pipe(fs.createWriteStream(`${VIDEO_PATH}/${file}`));
   }
}

main();