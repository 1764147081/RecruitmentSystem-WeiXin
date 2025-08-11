"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  setup() {
    const form = common_vendor.ref({
      name: "",
      studentId: "",
      phone: "",
      reason: ""
    });
    const departmentName = common_vendor.ref("产品部门");
    const submitForm = () => {
      if (!form.value.name || !form.value.studentId || !form.value.phone || !form.value.reason) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "报名成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    };
    const getDepartmentInfo = () => {
      departmentName.value = "产品部门";
    };
    common_vendor.onMounted(() => {
      getDepartmentInfo();
    });
    const navigateToDepartment = () => {
      common_vendor.index.navigateTo({
        url: "/pages/department/department"
      });
    };
    const navigateToPaper = () => {
    };
    const navigateToInfo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/info/info"
      });
    };
    return {
      form,
      departmentName,
      submitForm,
      navigateToDepartment,
      navigateToPaper,
      navigateToInfo
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.form.name,
    b: common_vendor.o(($event) => $setup.form.name = $event.detail.value),
    c: $setup.form.studentId,
    d: common_vendor.o(($event) => $setup.form.studentId = $event.detail.value),
    e: $setup.form.phone,
    f: common_vendor.o(($event) => $setup.form.phone = $event.detail.value),
    g: common_vendor.t($setup.departmentName),
    h: $setup.form.reason,
    i: common_vendor.o(($event) => $setup.form.reason = $event.detail.value),
    j: common_vendor.o((...args) => $setup.submitForm && $setup.submitForm(...args)),
    k: common_vendor.o((...args) => $setup.navigateToDepartment && $setup.navigateToDepartment(...args)),
    l: common_vendor.o((...args) => $setup.navigateToPaper && $setup.navigateToPaper(...args)),
    m: common_vendor.o((...args) => $setup.navigateToInfo && $setup.navigateToInfo(...args)),
    n: common_vendor.gei(_ctx, "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/paper/paper.js.map
