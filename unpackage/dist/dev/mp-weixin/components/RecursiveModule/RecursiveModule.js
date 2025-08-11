"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_RecursiveModule2 = common_vendor.resolveComponent("RecursiveModule");
  _easycom_RecursiveModule2();
}
const _easycom_RecursiveModule = () => Promise.resolve().then(() => QzovVXNlcnMvMTc2NDE0NzA4MS9EZXNrdG9wL25ldy9SZWNydWl0bWVudFN5c3RlbS1XZWlYaW4vUmVjcnVpdG1lbnRTeXN0ZW0tV2VpWGluL2NvbXBvbmVudHMvUmVjdXJzaXZlTW9kdWxlL1JlY3Vyc2l2ZU1vZHVsZS52dWU);
if (!Math) {
  _easycom_RecursiveModule();
}
const _sfc_main = {
  __name: "RecursiveModule",
  props: {
    modules: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    unfoldStation: {
      type: Function,
      required: true
    },
    viewDepartmentDetail: {
      type: Function,
      required: true
    }
  },
  setup(__props) {
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at components/RecursiveModule/RecursiveModule.vue:39", "渲染组件加载");
    });
    const props = __props;
    const toggleModule = (module) => {
      module.expanded = !module.expanded;
      if (module.expanded && module.submodules && module.submodules.length === 0) {
        props.unfoldStation(module.id, module);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.modules, (module, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(module.name),
            b: !module.isLeaf
          }, !module.isLeaf ? {
            c: common_vendor.t(module.expanded ? "▼" : "►")
          } : {}, {
            d: module.isLeaf ? 1 : "",
            e: common_vendor.o(($event) => module.isLeaf ? __props.viewDepartmentDetail(module.id) : toggleModule(module), module.id),
            f: module.expanded
          }, module.expanded ? common_vendor.e({
            g: module.submodules && module.submodules.length > 0 && __props.level < 10
          }, module.submodules && module.submodules.length > 0 && __props.level < 10 ? {
            h: "3898b9c7-0-" + i0,
            i: common_vendor.p({
              modules: module.submodules,
              level: __props.level + 1,
              unfoldStation: __props.unfoldStation,
              viewDepartmentDetail: __props.viewDepartmentDetail
            })
          } : {}, {
            j: module.departments && module.departments.length > 0
          }, module.departments && module.departments.length > 0 ? {
            k: common_vendor.f(module.departments, (department, k1, i1) => {
              return {
                a: common_vendor.t(department.name),
                b: department.id,
                c: common_vendor.o(($event) => __props.viewDepartmentDetail(department.id), department.id)
              };
            })
          } : {}) : {}, {
            l: module.id
          });
        }),
        b: common_vendor.n("module-item level-" + __props.level)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3898b9c7"]]);
wx.createComponent(Component);
const QzovVXNlcnMvMTc2NDE0NzA4MS9EZXNrdG9wL25ldy9SZWNydWl0bWVudFN5c3RlbS1XZWlYaW4vUmVjcnVpdG1lbnRTeXN0ZW0tV2VpWGluL2NvbXBvbmVudHMvUmVjdXJzaXZlTW9kdWxlL1JlY3Vyc2l2ZU1vZHVsZS52dWU = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/RecursiveModule/RecursiveModule.js.map
