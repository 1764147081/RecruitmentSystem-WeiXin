"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/index.js");
const common_request = require("../../common/request.js");
const token = common_vendor.wx$1.getStorageSync("authToken");
const _sfc_main = {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  },
  methods: {
    confirmSetPassword() {
      if (!this.newPassword) {
        common_vendor.index.showToast({
          title: "请输入新密码",
          icon: "none"
        });
        return;
      }
      if (this.newPassword.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度不能少于6位",
          icon: "none"
        });
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      this.updatePassword();
    },
    async updatePassword() {
      let response;
      common_vendor.index.__f__("log", "at pages/info/setPassword.vue:73", "现在修改个人密码");
      response = await common_request.request({
        url: "/user/update/password",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token}`
        },
        data: {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }
      });
      if (response.code === 200) {
        common_vendor.index.showToast({
          title: "密码修改成功",
          icon: "success",
          duration: 2e3,
          success: () => {
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 2e3);
          }
        });
      }
      if (response.code === 400) {
        common_vendor.index.showToast({
          title: response.msg,
          icon: "none",
          duration: 2e3
        });
      }
    }
    // 密码验证通过，可以调用API修改密码
    // 这里模拟修改成功
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.oldPassword,
    b: common_vendor.o(($event) => $data.oldPassword = $event.detail.value),
    c: $data.newPassword,
    d: common_vendor.o(($event) => $data.newPassword = $event.detail.value),
    e: $data.confirmPassword,
    f: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    g: common_vendor.o((...args) => $options.confirmSetPassword && $options.confirmSetPassword(...args)),
    h: common_vendor.gei(_ctx, "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-488a772a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/info/setPassword.js.map
