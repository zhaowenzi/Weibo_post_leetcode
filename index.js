let schedule = require('node-schedule');
let fs = require('fs');
let weiboPost = require('./weibopost');
let login = require('./login');
let uploadImg = require('./upload');
let getLeetcode = require('./Leetcode_Crawer');
const https = require('https');
const cheerio = require('cheerio');
let j = '';
const config = {
	username: '17620991376', //微博账号名
	password: 'Zhaozhiwen030609', //微博密码
}

loginTo();

function loginTo() {
	login(config.username, config.password).then(async () => {
		let rule = null;
		rule = new schedule.RecurrenceRule();
		rule.minute = [01, 11, 21, 31, 41, 51];
		try {
			let cookie = await getCookie();
			getContent(cookie);
		} catch (error) {
			console.log(error);
		}

		j = schedule.scheduleJob({hour: 0, minute: 0, second: 0}, async () => { //定时任务
			try {
				let cookie = await getCookie();
				getContent(cookie);
			} catch (error) {
				console.log(error);
			}

		});
	})
}

function getCookie() {//获取本地cookie

	console.log('getCookie');
	return new Promise((resolve, reject) => {
		fs.readFile('cookie.txt', 'utf8', (err, data) => {
			if (err) {
				reject('获取本地cookie.txt失败' + err);
			} else {
				let cookie = JSON.parse(data);
				let str = '';
				cookie.forEach((res) => {
					str = str + res.name + "=" + res.value + '; ';
				})
				resolve(str);
			}
		});

	});
}

function get_content() {
	let url = 'https://leetcode.com/lalalazzw/';
	let promise = new Promise(function (resolve, reject) {
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

				console.log(target.trim())

				content = target.trim();
				content += "\n\n自动发送脚本";
				resolve(content)
			});


		})
	})
	return promise;
}

function getContent(cookie) {

	console.log("getContent");
	console.log("pending...");

	
	let content = "获取Leetcode数据失败";

	console.log("pending...");

	(async function () {  
		console.log("get_leetcode");
		content = await get_content();
		console.log(content);
		console.log("123...");
		try {
			await weiboPost(content, '', cookie);
		} catch (error) {
			console.log('fail', error);
			j && j.cancel();
			loginTo(); //发送微博失败后重新登录
		}
	})()


	// let imgUrl = [];
	// let promiseArray = [];
	// imgUrl.forEach((item) => {
	// 	promiseArray.push(uploadImg(item, cookie));
	// });
	// Promise.all(promiseArray).then(async (data) => {
	// 	let arrPic = data.join('|');
	// 	try {
	// 		// await weiboPost(content, arrPic, cookie);

	// 	} catch (error) {
	// 		console.log('suc', error);
	// 		j && j.cancel();
	// 		loginTo(); //发送微博失败后重新登录
	// 	}

	// }).catch(async (e) => {
	// 	//这里获取图片pid失败了也发微博，发送无图片的微博
	// 	try {
	// 		// await weiboPost(content, '', cookie);
	// 	} catch (error) {
	// 		console.log('fail', error);
	// 		j && j.cancel();
	// 		loginTo(); //发送微博失败后重新登录
	// 	}
	// });

}