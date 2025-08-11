"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_index = require("../../stores/index.js");
const common_request = require("../../common/request.js");
if (!Array) {
  const _easycom_up_input2 = common_vendor.resolveComponent("up-input");
  _easycom_up_input2();
}
const _easycom_up_input = () => "../../uni_modules/uview-plus/components/u-input/u-input.js";
if (!Math) {
  (_easycom_up_input + RecursiveModule)();
}
const RecursiveModule = () => "../../components/RecursiveModule/RecursiveModule.js";
const _sfc_main = {
  __name: "department",
  setup(__props) {
    const token = common_vendor.wx$1.getStorageSync("authToken");
    stores_index.useFirstStore();
    const modules = common_vendor.ref([]);
    const searchKey = common_vendor.ref("");
    const originalModules = common_vendor.ref([]);
    common_vendor.watch(searchKey, (newValue) => {
      if (!newValue) {
        modules.value = [...originalModules.value];
        return;
      }
      const filteredModules = originalModules.value.map((module) => {
        const filteredSubmodules = module.submodules.filter((submodule) => {
          const filteredDepartments = submodule.departments.filter(
            (department) => department.name.toLowerCase().includes(newValue.toLowerCase())
          );
          return filteredDepartments.length > 0;
        });
        return {
          ...module,
          submodules: filteredSubmodules
        };
      }).filter((module) => module.submodules.length > 0);
      modules.value = filteredModules;
    });
    async function ViewStation() {
      await unfoldStation(0, null, true);
    }
    async function unfoldStation(id, parentModule, isRoot = false) {
      let res = await common_request.request({
        url: "/station/unfold",
        method: "GET",
        data: {
          id: parseInt(id)
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.code === 200) {
        common_vendor.index.__f__("log", "at pages/department/department.vue:95", `成功获取ID为${id}的子模块:`, res.data);
        if (res.data && Array.isArray(res.data)) {
          const formattedData = res.data.map((item) => ({
            ...item,
            expanded: false,
            // 默认折叠
            submodules: [],
            departments: item.departments || [],
            isLeaf: false
            // 标记是否为最后一级菜单
          }));
          if (isRoot) {
            modules.value = formattedData;
            originalModules.value = [...formattedData];
            for (const item of formattedData) {
              await unfoldStation(item.id, item);
            }
          } else if (parentModule) {
            parentModule.submodules = formattedData;
          }
        } else {
          common_vendor.index.__f__("warn", "at pages/department/department.vue:121", `ID为${id}的数据不是期望的数组格式`);
        }
      } else if (res.code === 404) {
        common_vendor.index.__f__("log", "at pages/department/department.vue:125", `ID为${id}的模块是最后一级菜单`);
        if (parentModule) {
          parentModule.isLeaf = true;
        }
      }
    }
    common_vendor.onLoad(() => {
      ViewStation();
    });
    const navigateToDepartment = () => {
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
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => searchKey.value = $event),
        b: common_vendor.p({
          placeholder: "搜索模块或部门",
          border: "surround",
          clearable: true,
          modelValue: searchKey.value
        }),
        c: common_vendor.p({
          modules: modules.value,
          level: 1,
          unfoldStation,
          viewDepartmentDetail: _ctx.viewDepartmentDetail
        }),
        d: common_vendor.o(navigateToDepartment),
        e: common_vendor.o(navigateToPaper),
        f: common_vendor.o(navigateToInfo),
        g: common_vendor.gei(_ctx, "")
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/department/department.js.map
