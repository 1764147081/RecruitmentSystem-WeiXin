"use strict";
const common_vendor = require("../common/vendor.js");
const useFirstStore = common_vendor.defineStore("first", () => {
  const token = common_vendor.ref("");
  const user = common_vendor.ref({
    username: "",
    studentNumber: "",
    password: ""
  });
  const isLoggedIn = common_vendor.ref(false);
  function logout() {
    token.value = "";
    user.value = { username: "", studentNumber: "", password: "" };
    isLoggedIn.value = false;
    common_vendor.wx$1.removeStorageSync("token");
    common_vendor.wx$1.removeStorageSync("authToken");
  }
  function setLoginData(res) {
    var _a, _b;
    token.value = res.token;
    user.value.username = ((_a = res.userInfo) == null ? void 0 : _a.username) || "";
    user.value.studentNumber = ((_b = res.userInfo) == null ? void 0 : _b.studentNumber) || "";
    isLoggedIn.value = true;
    common_vendor.wx$1.setStorageSync("token", res.token);
  }
  function setToken(newToken) {
    token.value = newToken;
    isLoggedIn.value = !!newToken;
    common_vendor.wx$1.setStorageSync("token", newToken);
  }
  return {
    user,
    token,
    isLoggedIn,
    setLoginData,
    setToken,
    logout
  };
});
exports.useFirstStore = useFirstStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/index.js.map
