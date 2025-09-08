
export const baseUrl = "https://i.sdu.edu.cn/XSZX/NXXT/api";

export function request(params = {}){
	let {
		url,
		method,
		data = {},
		dataType,
		header,
	} = params;

	url = baseUrl + url;

	return new Promise((resolve, reject) => {
		// 设置默认请求头
		header = header || {
			'content-type': 'application/x-www-form-urlencoded'
		};

		uni.request({
			url,
			data,
			method,
			header,
			dataType,
			success: (res) => {
				console.log(res.data);
				if (res.statusCode === 200) {
					resolve(res.data || {});
				} else {
					resolve({
						code: res.statusCode,
						message: 'Request failed with status code ' + res.statusCode,
						data: res.data
					});
				}
			},
			fail: (error) => {
				console.error('Request failed:', error);
				resolve({
					code: -1,
					message: 'Network error: ' + (error.message || 'Unknown error'),
					data: null
				});
			}
		})
	})
}
