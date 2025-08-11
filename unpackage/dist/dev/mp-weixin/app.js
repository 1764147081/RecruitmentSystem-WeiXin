"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_index = require("./stores/index.js");
const common_request = require("./common/request.js");
const uni_modules_uviewPlus_index = require("./uni_modules/uview-plus/index.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/department/department.js";
  "./pages/department/detail.js";
  "./pages/paper/paper.js";
  "./pages/info/info.js";
  "./pages/info/edit.js";
  "./pages/info/setPassword.js";
}
const pinia = common_vendor.createPinia();
const app = common_vendor.createApp({});
app.use(pinia);
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:14", "App Launch");
    this.initLogin();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:18", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:21", "App Hide");
  },
  methods: {
    initLogin() {
      const store = stores_index.useFirstStore();
      const token = common_vendor.wx$1.getStorageSync("authToken") || "";
      if (token) {
        common_vendor.index.__f__("log", "at App.vue:31", "发现保存的token，尝试自动登录");
        store.setToken(token);
        common_request.request({
          url: "/user/verify-token",
          method: "POST",
          data: {
            token
          },
          header: {
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`
          }
        }).then((res) => {
          if (res.code === 200) {
            store.setLoginData({
              token,
              userInfo: res.userInfo
            });
            common_vendor.index.switchTab({
              url: "/pages/department/department"
            });
          } else {
            common_vendor.index.__f__("log", "at App.vue:60", "token无效，清除登录状态");
            store.logout();
            common_vendor.index.redirectTo({
              url: "/pages/login/login"
            });
          }
        }).catch((error) => {
          common_vendor.index.__f__("error", "at App.vue:68", "验证token失败:", error);
          common_vendor.index.switchTab({
            url: "/pages/department/department"
          });
        });
      } else {
        common_vendor.index.redirectTo({
          url: "/pages/login/login"
        });
      }
    }
  }
};
function createApp() {
  const app2 = common_vendor.createSSRApp(_sfc_main);
  const pinia2 = common_vendor.createPinia();
  app2.use(pinia2);
  app2.use(uni_modules_uviewPlus_index.uviewPlus);
  return {
    app: app2,
    pinia: pinia2
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
