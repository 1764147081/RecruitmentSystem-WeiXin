"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_up_toast2 = common_vendor.resolveComponent("up-toast");
  _easycom_up_toast2();
}
const _easycom_up_toast = () => "../../uni_modules/uview-plus/components/u-toast/u-toast.js";
if (!Math) {
  _easycom_up_toast();
}
const _sfc_main = {
  __name: "Toast",
  setup(__props) {
    common_vendor.ref(false);
    const list = common_vendor.ref(
      {
        type: "success",
        message: "如未设置密码请先通过统一认证登录",
        iconUrl: "https://uview-plus.jiangruyi.com/resources/toast/success.png",
        position: "top"
      }
    );
    const uToastRef = common_vendor.ref(null);
    common_vendor.onMounted(() => {
      showToast(list.value);
    });
    function showToast(params) {
      uToastRef.value.show({
        ...params
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr(uToastRef, "49e68ce6-0", {
          "k": "uToastRef"
        }),
        b: common_vendor.gei(_ctx, "")
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/Toast/Toast.js.map
