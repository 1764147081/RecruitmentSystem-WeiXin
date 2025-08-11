"use strict";
const common_vendor = require("./vendor.js");
const baseUrl = "https://i.sdu.edu.cn/XSZX/NXXT/api";
function request(params = {}) {
  let {
    url,
    method,
    data = {},
    dataType,
    header
  } = params;
  url = baseUrl + url;
  return new Promise((resolve, reject) => {
    header = header || {
      "content-type": "application/x-www-form-urlencoded"
    };
    common_vendor.index.request({
      url,
      data,
      method,
      header,
      dataType,
      success: (res) => {
        common_vendor.index.__f__("log", "at common/request.js:28", res.data);
        if (res.statusCode === 200) {
          resolve(res.data || {});
        } else {
          resolve({
            code: res.statusCode,
            message: "Request failed with status code " + res.statusCode,
            data: res.data
          });
        }
      },
      fail: (error) => {
        common_vendor.index.__f__("error", "at common/request.js:41", "Request failed:", error);
        resolve({
          code: -1,
          message: "Network error: " + (error.message || "Unknown error"),
          data: null
        });
      }
    });
  });
}
exports.baseUrl = baseUrl;
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/request.js.map
