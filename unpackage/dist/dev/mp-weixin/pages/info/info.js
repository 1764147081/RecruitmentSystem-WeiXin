"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_index = require("../../stores/index.js");
const common_request = require("../../common/request.js");
const token = common_vendor.wx$1.getStorageSync("authToken");
const store = stores_index.useFirstStore();
const _sfc_main = {
  data() {
    return {
      username: "",
      depart: "",
      name: "",
      email: "",
      qq: "",
      avatar: "",
      profile: ""
    };
  },
  methods: {
    toEditInfo() {
      common_vendor.index.navigateTo({
        url: "/pages/info/edit"
      });
    },
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            store.logout();
            common_vendor.index.redirectTo({
              url: "/pages/login/login"
            });
          }
        }
      });
    },
    // 跳转到部门列表
    navigateToDepartment() {
      common_vendor.index.navigateTo({
        url: "/pages/department/department"
      });
    },
    // 跳转到已填报页面
    navigateToPaper() {
      common_vendor.index.navigateTo({
        url: "/pages/paper/paper"
      });
    },
    // 跳转到个人中心
    navigateToInfo() {
    },
    async getUserInfo() {
      let response;
      common_vendor.index.__f__("log", "at pages/info/info.vue:125", "现在获取个人信息");
      common_vendor.index.__f__("log", "at pages/info/info.vue:126", token);
      response = await common_request.request({
        url: "/user/info",
        method: "GET",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response && response.data) {
        this.username = response.data.username || "";
        this.depart = response.data.depart || "";
        this.name = response.data.name || "";
        this.email = response.data.email || "";
        this.qq = response.data.qq || "";
        this.avatar = response.data.avatar || "/static/assets/nav_icon_avatar_nor.png";
        this.profile = response.data.profile || "这个人很懒，什么都没有写";
      }
    }
  },
  onLoad() {
    this.getUserInfo();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.avatar,
    b: common_vendor.t($data.name),
    c: common_vendor.t($data.profile),
    d: common_vendor.o((...args) => $options.toEditInfo && $options.toEditInfo(...args)),
    e: common_vendor.t($data.depart),
    f: common_vendor.t($data.email),
    g: common_vendor.t($data.username),
    h: common_vendor.t($data.qq),
    i: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    j: common_vendor.o((...args) => $options.navigateToDepartment && $options.navigateToDepartment(...args)),
    k: common_vendor.o((...args) => $options.navigateToPaper && $options.navigateToPaper(...args)),
    l: common_vendor.o((...args) => $options.navigateToInfo && $options.navigateToInfo(...args)),
    m: common_vendor.gei(_ctx, "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f52d2d81"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/info/info.js.map
