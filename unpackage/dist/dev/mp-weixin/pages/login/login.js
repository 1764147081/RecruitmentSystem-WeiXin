"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_index = require("../../stores/index.js");
const common_request = require("../../common/request.js");
if (!Array) {
  const _easycom_Toast2 = common_vendor.resolveComponent("Toast");
  const _easycom_up_input2 = common_vendor.resolveComponent("up-input");
  const _easycom_up_checkbox2 = common_vendor.resolveComponent("up-checkbox");
  const _component_template = common_vendor.resolveComponent("template");
  (_easycom_Toast2 + _easycom_up_input2 + _easycom_up_checkbox2 + _component_template)();
}
const _easycom_Toast = () => "../../components/Toast/Toast.js";
const _easycom_up_input = () => "../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_up_checkbox = () => "../../uni_modules/uview-plus/components/u-checkbox/u-checkbox.js";
if (!Math) {
  (_easycom_Toast + _easycom_up_input + _easycom_up_checkbox)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const store = stores_index.useFirstStore();
    const stuID = common_vendor.ref("");
    const password = common_vendor.ref("");
    const aloneChecked = common_vendor.ref(false);
    const loginType = common_vendor.ref("password");
    const captchaCode = common_vendor.ref("");
    common_vendor.onMounted(() => {
      if (store.isLoggedIn.value) {
        common_vendor.index.__f__("log", "at pages/login/login.vue:66", "用户已登录，跳转到首页");
        common_vendor.index.switchTab({
          url: "/pages/department/department"
        });
      }
    });
    function switchLoginType(type) {
      loginType.value = type;
      captchaCode.value = "";
    }
    async function login() {
      try {
        common_vendor.index.__f__("log", "at pages/login/login.vue:83", "stuID:", stuID.value);
        common_vendor.index.__f__("log", "at pages/login/login.vue:84", "password:", password.value);
        let response;
        if (loginType.value === "unified") {
          common_vendor.index.__f__("log", "at pages/login/login.vue:88", "现在使用统一认证登录");
          response = await common_request.request({
            url: "/user/login/cas",
            method: "POST",
            data: {
              studentNumber: stuID.value,
              password: password.value,
              captcha: captchaCode.value,
              fingerprint: stuID.value
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          });
        } else {
          common_vendor.index.__f__("log", "at pages/login/login.vue:103", "现在使用账号密码登录");
          response = await common_request.request({
            url: "/user/login",
            method: "POST",
            data: {
              studentNumber: stuID.value,
              password: password.value
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          });
        }
        ;
        const token = response.data;
        common_vendor.index.__f__("log", "at pages/login/login.vue:117", token);
        if (aloneChecked.value) {
          common_vendor.wx$1.setStorageSync("authToken", token);
        } else {
          common_vendor.wx$1.setStorageSync("authToken", token);
        }
        store.setLoginData({
          token,
          userInfo: response.data.userInfo
        });
        if (response.code === 400) {
          common_vendor.index.showToast({
            title: "验证码已发,请等待",
            icon: "none",
            position: "top"
          });
        }
        if (response.code === 200) {
          common_vendor.index.redirectTo({
            url: "/pages/department/department"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:152", "登录失败", error);
        common_vendor.index.showToast({
          title: "登录失败，请检查账号密码",
          icon: "none",
          position: "top"
        });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          position: "top"
        }),
        b: common_assets._imports_0,
        c: common_assets._imports_1,
        d: loginType.value === "password" ? 1 : "",
        e: common_vendor.o(($event) => switchLoginType("password")),
        f: loginType.value === "unified" ? 1 : "",
        g: common_vendor.o(($event) => switchLoginType("unified")),
        h: common_vendor.o(($event) => stuID.value = $event),
        i: common_vendor.p({
          placeholder: "请输入学号",
          border: "surround",
          clearable: true,
          modelValue: stuID.value
        }),
        j: common_vendor.o(($event) => password.value = $event),
        k: common_vendor.p({
          placeholder: "请输入密码",
          border: "surround",
          clearable: true,
          password: true,
          modelValue: password.value
        }),
        l: loginType.value === "unified"
      }, loginType.value === "unified" ? {
        m: common_vendor.o(($event) => captchaCode.value = $event),
        n: common_vendor.p({
          placeholder: "验证码输入位置,请先空着",
          border: "surround",
          clearable: true,
          type: "number",
          maxlength: "6",
          modelValue: captchaCode.value
        })
      } : {}, {
        o: common_vendor.o(($event) => aloneChecked.value = $event),
        p: common_vendor.p({
          customStyle: {
            marginBottom: "5px"
          },
          label: "自动登录",
          name: "agree",
          usedAlone: true,
          checked: aloneChecked.value
        }),
        q: common_vendor.t(loginType.value === "password" ? "账号密码登录" : "统一认证登录"),
        r: common_vendor.o(($event) => login()),
        s: common_vendor.o(login)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
