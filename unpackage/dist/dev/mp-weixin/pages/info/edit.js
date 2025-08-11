"use strict";
const common_vendor = require("../../common/vendor.js");
const common_request = require("../../common/request.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        name: "",
        profile: "",
        depart: "",
        major: "",
        email: "",
        qq: "",
        avatar: ""
      },
      previewImage: ""
      // 用于头像预览
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    toSetPassword() {
      common_vendor.index.navigateTo({
        url: "/pages/info/setPassword"
      });
    },
    async saveAndReturn() {
      const token = common_vendor.wx$1.getStorageSync("authToken");
      const response = await common_request.request({
        url: "/user/update/info",
        method: "PUT",
        header: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify({
          name: this.userInfo.name,
          profile: this.userInfo.profile,
          depart: this.userInfo.depart,
          major: this.userInfo.major,
          email: this.userInfo.email,
          qq: this.userInfo.qq
        })
      });
      if (response.code === 200) {
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success",
          duration: 2e3,
          success: () => {
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 2e3);
          }
        });
      } else {
        common_vendor.index.showToast({
          title: response.data.message || "保存失败",
          icon: "none",
          duration: 2e3
        });
      }
    },
    async getUserInfo() {
      const token = common_vendor.wx$1.getStorageSync("authToken");
      const response = await common_request.request({
        url: "/user/info",
        method: "GET",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.data) {
        this.userInfo = {
          name: response.data.name || "",
          profile: response.data.profile || "",
          depart: response.data.depart || "",
          major: response.data.major || "",
          email: response.data.email || "",
          qq: response.data.qq || "",
          avatar: response.data.avatar || ""
        };
      }
    },
    closePreview() {
      this.previewImage = "";
    },
    uploadAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const file = res.tempFiles[0];
          const MAX_SIZE = 10 * 1024 * 1024;
          if (file.size > MAX_SIZE) {
            common_vendor.index.showToast({
              title: "文件大小不能超过10MB",
              icon: "none",
              duration: 2e3
            });
            return;
          }
          const tempFilePath = res.tempFilePaths[0];
          this.previewImage = tempFilePath;
          this.uploadFile(tempFilePath);
        }
      });
    },
    async uploadFile(filePath) {
      try {
        const token = common_vendor.wx$1.getStorageSync("authToken");
        common_vendor.index.showLoading({
          title: "上传中..."
        });
        const response = await new Promise((resolve, reject) => {
          common_vendor.index.uploadFile({
            url: common_request.baseUrl + "/user/upload/avatar",
            filePath,
            name: "file",
            header: {
              "Authorization": `Bearer ${token}`,
              "content-type": "multipart/form-data"
            },
            success: (uploadRes) => {
              try {
                const data = JSON.parse(uploadRes.data);
                resolve(data);
              } catch (e) {
                reject(new Error("上传失败，响应格式不正确"));
              }
            },
            fail: (err) => {
              reject(err);
            },
            complete: () => {
              common_vendor.index.hideLoading();
            }
          });
        });
        if (response.code === 200) {
          this.userInfo.avatar = response.data.avatarUrl;
          common_vendor.index.showToast({
            title: "上传成功",
            icon: "success",
            duration: 2e3
          });
        } else {
          common_vendor.index.showToast({
            title: response.message || "上传失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/info/edit.vue:228", "上传头像失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "上传失败，请重试",
          icon: "none",
          duration: 2e3
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.previewImage || $data.userInfo.avatar || "/static/assets/logo.png",
    b: common_vendor.o((...args) => $options.uploadAvatar && $options.uploadAvatar(...args)),
    c: $data.userInfo.name,
    d: common_vendor.o(($event) => $data.userInfo.name = $event.detail.value),
    e: $data.userInfo.profile,
    f: common_vendor.o(($event) => $data.userInfo.profile = $event.detail.value),
    g: $data.userInfo.depart,
    h: common_vendor.o(($event) => $data.userInfo.depart = $event.detail.value),
    i: $data.userInfo.major,
    j: common_vendor.o(($event) => $data.userInfo.major = $event.detail.value),
    k: $data.userInfo.email,
    l: common_vendor.o(($event) => $data.userInfo.email = $event.detail.value),
    m: $data.userInfo.qq,
    n: common_vendor.o(($event) => $data.userInfo.qq = $event.detail.value),
    o: common_vendor.o((...args) => $options.toSetPassword && $options.toSetPassword(...args)),
    p: common_vendor.o((...args) => $options.saveAndReturn && $options.saveAndReturn(...args)),
    q: common_vendor.gei(_ctx, "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c130aaa9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/info/edit.js.map
