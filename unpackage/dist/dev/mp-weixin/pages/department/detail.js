"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_index = require("../../stores/index.js");
const _sfc_main = {
  setup() {
    stores_index.useFirstStore();
    const departmentInfo = common_vendor.ref({});
    const questionnaireId = common_vendor.ref("");
    const departmentId = common_vendor.ref("");
    const getDepartmentId = () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      departmentId.value = currentPage.options.id || "";
    };
    const loading = common_vendor.ref(false);
    common_vendor.ref("");
    const navigateToQuestionnaire = () => {
      if (questionnaireId.value) {
        common_vendor.index.navigateTo({
          url: `/pages/paper/paper?id=${questionnaireId.value}`
        });
      } else {
        common_vendor.index.showToast({
          title: "该部门暂无问卷",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      getDepartmentId();
      departmentInfo.value = {
        name: "产品部门",
        description: "产品部门负责公司所有产品的规划、设计和管理工作，确保产品满足用户需求并实现商业目标。",
        duties: "1. 负责产品的需求分析和规划\n2. 制定产品 roadmap\n3. 与设计、开发团队协作，推动产品落地\n4. 收集用户反馈，持续优化产品体验",
        posterUrl: "/static/assets/detail.png"
      };
      questionnaireId.value = "mock_questionnaire_123";
      common_vendor.index.__f__("log", "at pages/department/detail.vue:86", "使用模拟问卷ID:", questionnaireId.value);
    });
    const navigateToDepartment = () => {
      common_vendor.index.navigateTo({
        url: "/pages/department/department"
      });
    };
    const navigateToPaper = () => {
      common_vendor.index.navigateTo({
        url: "/pages/paper/paper"
      });
    };
    const navigateToInfo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/info/info"
      });
    };
    return {
      departmentInfo,
      navigateToQuestionnaire,
      loading,
      navigateToDepartment,
      navigateToPaper,
      navigateToInfo
    };
    const getCurrentPages = () => {
      return common_vendor.index.getCurrentPages();
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.departmentInfo.posterUrl || "/static/assets/detail.png",
    b: common_vendor.t($setup.departmentInfo.description || "暂无部门介绍"),
    c: common_vendor.t($setup.departmentInfo.duties || "暂无部门职责信息"),
    d: common_vendor.o((...args) => $setup.navigateToQuestionnaire && $setup.navigateToQuestionnaire(...args)),
    e: common_vendor.o((...args) => $setup.navigateToDepartment && $setup.navigateToDepartment(...args)),
    f: common_vendor.o((...args) => $setup.navigateToPaper && $setup.navigateToPaper(...args)),
    g: common_vendor.o((...args) => $setup.navigateToInfo && $setup.navigateToInfo(...args)),
    h: common_vendor.gei(_ctx, "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/department/detail.js.map
