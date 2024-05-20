const axios = require('axios');
const cheerio = require('cheerio');

async function getVideoUrl(phUrl) {
    try {
        const response = await axios.get(phUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        let videoUrl = null;
        $('script').each((i, script) => {
            const scriptContent = $(script).html();
            if (scriptContent && scriptContent.includes('video_url')) {
                const regex = /"video_url":"(.*?)"/;
                const match = regex.exec(scriptContent);
                if (match && match[1]) {
                    videoUrl = match[1].replace(/\\/g, '');
                }
                return false; // Break out of the loop
            }
        });

        return videoUrl;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const phUrl = "https://www.pornhub.com/view_video.php?viewkey=ph5f4d3c2b1a1b2";
getVideoUrl(phUrl).then(videoUrl => console.log(videoUrl));