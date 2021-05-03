# Quill 本体 / 插件修改

## quill-image-extend-module

inedx.js

pasteHandle 方法
将源码修改成以下

```js
pasteHandle(e) {
        // e.preventDefault();
        QuillWatch.emit(this.quill.id, 0)
        let clipboardData = e.clipboardData
        let i = 0
        let items, item, types

        if (clipboardData) {
            items = clipboardData.items;

            if (!items) {
                return;
            }
            item = items[0];
            types = clipboardData.types || [];

            for (; i < types.length; i++) {
                if (types[i] === 'Files') {
                    item = items[i];
                    break;
                }
            }
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
                e.preventDefault();
                this.file = item.getAsFile()
                let self = this
                // 如果图片限制大小
                if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
                    if (self.config.sizeError) {
                        self.config.sizeError()
                    }
                    return
                }
                if (this.config.action) {
                    this.uploadImg();
                } else {
                    this.toBase64();
                }
            }
        }
    }
```

preventDefault 放在

```js
if (item && item.kind === 'file' && item.type.match(/^image\//i))
```

下面，就可以不影响直接文字的直接复制

取消 this.uploadImage 和 this.toBase64 的注释，就可以正常使用了

QuillWatch

emit 下

this.active = this.watcher[activeId]后添加

```js
setTimeout(() => {
  this.active.cursorIndex = this.active.quill.getSelection()
    ? this.active.quill.getSelection().index
    : this.active.quill.getLength();
}, 0); //获取当前光标位置
```

即可解决图片拖放错位问题

批量购课需要分别处理清洗数据

题库录入框更新：可以直接复制外网图片进行 base64 转码保存，生成图片避免了跨域调用外部图片的问题

优化项联调完成提测

批量内部购课完成提测

使用 mixins 和 filters 进行代码优化

mixins 在可读性上可能较差但混入页面可以获得良好开发效果

## 劫持 quill-extend-module 上传

vue + quill + element 劫持 quill 上传事件，自行手动上传 https://learnku.com/articles/39584

https://juejin.im/post/6844903907433381895

```javascript
// 在使用的页面中初始化按钮样式
	initButton: function () {
	    // 样式随便改
		const sourceEditorButton = document.querySelector('.ql-sourceEditor');
		sourceEditorButton.style.cssText = 'font-size:18px';

        // 加了elementui的icon
		sourceEditorButton.classList.add('el-icon-edit-outline');
		// 鼠标放上去显示的提示文字
		sourceEditorButton.title = '源码编辑';
	}
```

https://github.com/GavinZhuLei/vue-form-making

https://github.com/GavinZhuLei/vue-form-making/blob/master/README.zh-CN.md

## 无格式复制（不完美，会有坑

```js
/**
 *@description 观察者模式 全局监听富文本编辑器
 */
export const QuillWatch = {
  watcher: {}, // 登记编辑器信息
  active: null, // 当前触发的编辑器
  on: function (imageExtendId, ImageExtend) {
    // 登记注册使用了ImageEXtend的编辑器
    if (!this.watcher[imageExtendId]) {
      this.watcher[imageExtendId] = ImageExtend;
    }
  },
  emit: function (activeId, type = 1) {
    // 事件发射触发
    this.active = this.watcher[activeId];
    setTimeout(() => {
      this.active.cursorIndex = this.active.quill.getSelection()
        ? this.active.quill.getSelection().index
        : this.active.quill.getLength();
    }, 0); //获取当前光标位置
    if (type === 1) {
      imgHandler();
    }
  },
};

/**
 * @description 图片功能拓展： 增加上传 拖动 复制
 */
export class ImageExtend {
  /**
   * @param quill {Quill}富文本实例
   * @param config {Object} options
   * config  keys: action, headers, editForm start end error  size response
   */
  constructor(quill, config = {}) {
    this.id = Math.random();
    this.quill = quill;
    this.quill.id = this.id;
    this.config = config;
    this.file = ""; // 要上传的图片
    this.imgURL = ""; // 图片地址
    quill.root.addEventListener("paste", this.pasteHandle.bind(this), false);
    quill.root.addEventListener("drop", this.dropHandle.bind(this), false);
    quill.root.addEventListener(
      "dropover",
      function (e) {
        e.preventDefault();
      },
      false
    );
    this.cursorIndex = 0;
    QuillWatch.on(this.id, this);
  }

  /**
   * @description 粘贴
   * @param e
   */
  pasteHandle(e) {
    QuillWatch.emit(this.quill.id, 0);
    let clipboardData = e.clipboardData;
    let i = 0;
    let items, item, types, plain;

    if (clipboardData) {
      items = clipboardData.items;

      if (!items) {
        return;
      }

      types = clipboardData.types || [];

      for (; i < types.length; i++) {
        if (types[i] === "Files") {
          item = items[i];
          // break;
        } else if (types[i] === "text/html") {
          plain = items[i];
        }
      }

      if (item) {
        if (item && item.kind === "file" && item.type.match(/^image\//i)) {
          e.preventDefault();
          this.file = item.getAsFile();

          if (this.config.action) {
            this.uploadImg();
          } else {
            this.toBase64();
          }
        }
      } else if (plain) {
        e.preventDefault();
        plain.getAsString((res) => {
          const plainText = res.replace(/<[^>]+>/gi, "").trim();
          const self = QuillWatch.active;

          const originIndex = self.quill.getText().length;

          self.quill.insertText(originIndex, plainText);

          const newIndex = self.quill.getText().length;

          self.quill.setSelection(newIndex);
        });
      }
    }
  }

  /**
   * 拖拽
   * @param e
   */
  dropHandle(e) {
    QuillWatch.emit(this.quill.id, 0);
    const self = this;
    e.preventDefault();
    // 如果图片限制大小
    if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
      if (self.config.sizeError) {
        self.config.sizeError();
      }
      return;
    }
    self.file = e.dataTransfer.files[0]; // 获取到第一个上传的文件对象
    if (this.config.action) {
      self.uploadImg();
    } else {
      self.toBase64();
    }
  }

  /**
   * @description 将图片转为base4
   */
  toBase64() {
    const self = this;
    const reader = new FileReader();
    reader.onload = (e) => {
      // 返回base64
      self.imgURL = e.target.result;
      self.insertImg();
    };
    reader.readAsDataURL(self.file);
  }

  /**
   * @description 上传图片到服务器
   */
  uploadImg() {
    const self = this;
    let quillLoading = self.quillLoading;
    let config = self.config;
    // 构造表单
    let formData = new FormData();
    formData.append(config.name, self.file);
    // 自定义修改表单
    if (config.editForm) {
      config.editForm(formData);
    }
    // 创建ajax请求
    let xhr = new XMLHttpRequest();
    xhr.open("post", config.action, true);
    // 如果有设置请求头
    if (config.headers) {
      config.headers(xhr);
    }
    if (config.change) {
      config.change(xhr, formData);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          //success
          let res = JSON.parse(xhr.responseText);
          self.imgURL = config.response(res);
          QuillWatch.active.uploadSuccess();
          self.insertImg();
          if (self.config.success) {
            self.config.success();
          }
        } else {
          //error
          if (self.config.error) {
            self.config.error();
          }
          QuillWatch.active.uploadError();
        }
      }
    };
    // 开始上传数据
    xhr.upload.onloadstart = function (e) {
      QuillWatch.active.uploading();
      // let length = (self.quill.getSelection() || {}).index || self.quill.getLength()
      // self.quill.insertText(length, '[uploading...]', { 'color': 'red'}, true)
      if (config.start) {
        config.start();
      }
    };
    // 上传过程
    xhr.upload.onprogress = function (e) {
      let complete = (((e.loaded / e.total) * 100) | 0) + "%";
      QuillWatch.active.progress(complete);
    };
    // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
    xhr.upload.onerror = function (e) {
      QuillWatch.active.uploadError();
      if (config.error) {
        config.error();
      }
    };
    // 上传数据完成（成功或者失败）时会触发
    xhr.upload.onloadend = function (e) {
      if (config.end) {
        config.end();
      }
    };
    xhr.send(formData);
  }

  /**
   * @description 往富文本编辑器插入图片
   */
  insertImg() {
    const self = QuillWatch.active;
    self.quill.insertEmbed(QuillWatch.active.cursorIndex, "image", self.imgURL);
    self.quill.update();
    self.quill.setSelection(self.cursorIndex + 1);
  }

  /**
   * @description 显示上传的进度
   */
  progress(pro) {
    pro = "[" + "uploading" + pro + "]";
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      pro
    );
  }

  /**
   * 开始上传
   */
  uploading() {
    let length =
      (QuillWatch.active.quill.getSelection() || {}).index ||
      QuillWatch.active.quill.getLength();
    QuillWatch.active.cursorIndex = length;
    QuillWatch.active.quill.insertText(
      QuillWatch.active.cursorIndex,
      "[uploading...]",
      { color: "red" },
      true
    );
  }

  /**
   * 上传失败
   */
  uploadError() {
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      "[upload error]"
    );
  }

  uploadSuccess() {
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      ""
    );
  }
}

/**
 * @description 点击图片上传
 */
export function imgHandler() {
  let fileInput = document.querySelector(".quill-image-input");
  if (fileInput === null) {
    fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.classList.add("quill-image-input");
    fileInput.style.display = "none";
    // 监听选择文件
    fileInput.addEventListener("change", function () {
      let self = QuillWatch.active;
      self.file = fileInput.files[0];
      fileInput.value = "";
      // 如果图片限制大小
      if (
        self.config.size &&
        self.file.size >= self.config.size * 1024 * 1024
      ) {
        if (self.config.sizeError) {
          self.config.sizeError();
        }
        return;
      }
      if (self.config.action) {
        self.uploadImg();
      } else {
        self.toBase64();
      }
    });
    document.body.appendChild(fileInput);
  }
  fileInput.click();
}

/**
 *@description 全部工具栏
 */
export const container = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
  ["link", "image", "video"],
];
```

## 使用

# 使用 quill 做富文本编辑器

```cmd
npm i vue-quill-editor katex dom-to-image
```

```js
// components
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import katex from "katex";
import "katex/dist/katex.min.css";

export default {
  data() {
    return {
      context: "",
      editorOption: {
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "underline",
              "strike",
              "underline",
              "blockquote",
              "code-block",
            ],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [
              { size: ["small", false, "large", "huge"] },
              { header: [1, 2, 3, 4, 5, 6, false] },
            ],
            [{ color: [] }, { background: [] }, { align: [] }],
            ["formula"],
            ["clean"],
          ],
        },
      },
    };
  },
  components: {
    quillEditor,
  },
};
```

```html
<quill-editor v-model="context" ref="quillEditor" :options="editorOption" />
```

## dom2image 配合 latex 会有渲染失败的问题

原因: latex 渲染的 mi 标签没有 style 这个东西

具体问题看 [issue](https://github.com/tsayen/dom-to-image/pull/184/commits/00128ec30f82d358efb951e397040765147f2b97)

解决方法：改源码

```js
//   /node_modles/dom-to-image/src/dom-to-image.js
// 231行
function cloneStyle() {
    + if (clone.style === undefined) {
    +     return false;
    + }
    copyStyle(window.getComputedStyle(original), clone.style);
    // ...
}

// 752行
function inlineBackground(node) {
    + if (node.style === undefined) {
    +     return Promise.resolve(node);
    + }
    // ...
}
```
