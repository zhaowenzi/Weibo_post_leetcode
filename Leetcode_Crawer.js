const https = require('https');
const cheerio = require('cheerio');



async function get_leetcode() {
    return new Promise(async (resolve, reject) => {
        let url = 'https://leetcode.com/lalalazzw/';

        try {
            https.get(url, function (res) {

                let chunks = [], size = 0;

                res.on('data', function (chunk) {
                    chunks.push(chunk);
                    size += chunk.length;
                });

                res.on('end', function (param) {
                    // console.log('数据表传输完毕');
                    let data = Buffer.concat(chunks, size);
                    // console.log(data);
                    let html = data.toString();
                    // console.log(html);
                    let $ = cheerio.load(html);

                    let target = $('span.progress-bar-success').eq(3).text()

                    console.log("读取Leetcode成功")

                    console.log(target.trim());

                    resolve(target.trim());

                });
            });
            
        } catch (error) {
            console.log("读取Leetcode失败")
            reject('Error: Get data from Leetcode error!');
        }

    });
}

module.exports = get_leetcode;