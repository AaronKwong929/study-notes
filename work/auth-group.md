# 将平级的数据返回成具有层级结构的列表

后端返回的数据：一个 JSON 数组，由以下内容组成

```js
{
    eventCode: `feedback`,
    eventDesc: `反馈管理`
}
```

需要将上面的内容进行清洗修改以适配 el-cascader

最多会有三级权限

---

假设获取到的树如下所示

```js
const tree = [
  {
    value: `courseParent`,
    label: `课程管理父级`,
    children: [
      {
        value: `course`,
        label: `课程管理`,
      },
      {
        value: `courseInfo`,
        label: `课程内容`,
        children: [
          {
            value: `subNodeInfo`,
            label: `小节内容`,
          },
        ],
      },
      {
        value: `courseDistribute`,
        label: `分班`,
      },
    ],
  },
  {
    value: `goods`,
    label: `商品管理`,
  },
  {
    value: `others`,
    label: `其他管理`,
    children: [
      {
        value: `teacher`,
        label: `教师管理`,
      },
    ],
  },
  {
    value: `auth`,
    label: `系统安全`,
  },
];
```

假设数据库返回以下内容

```js
// 数据库返回
const source = [
  { eventCode: "courseParent", eventDesc: "课程管理父级" },
  { eventCode: "course", eventDesc: "课程管理" },
  { eventCode: "courseInfo", eventDesc: "课程内容" },
  { eventCode: "subNodeInfo", eventDesc: "小节内容" },
  { eventCode: "courseDistribute", eventDesc: "分班" },
  { eventCode: "goods", eventDesc: "商品管理" },
  { eventCode: "others", eventDesc: "其他管理" },
  { eventCode: "teacher", eventDesc: "教师管理" },
  { eventCode: "auth", eventDesc: "系统安全" },
];
```

那么目标列表是以下内容

```js
[
  ["courseParent", "course"],
  ["courseParent", "courseInfo", "subNodeInfo"],
  ["courseParent", "courseDistribute"],
  ["goods"],
  ["others", "teacher"],
  ["auth"],
];
```

---

---

## 解法

1. 先将获取到的数组进行扁平化操作并取出其中的 eventCode 部分

   ```js
   let pure = [],
     target = [];

   source.forEach((item) => {
     pure.push(item.eventCode);
   });
   ```

2. 先处理一棵树，对一个目标进行处理

   ```js
   let outputArray = [];
   let findFlag = false;
   const getPath = (item, target) => {
     outputArray.push(item.value);
     if (item.value === target) {
       // 找到节点后设置标识
       findFlag = true;
       return;
     }
     if (item.hasOwnProperty("children") && item.children.length > 0) {
       // 有子节点且子节点个数 > 0
       for (let i = 0; i < item.children.length; i++) {
         getPath(item.children[i], target);
         if (findFlag) {
           // 如果有标识则不进行多余操作，直接返回
           return;
         }
       }
       // 子节点遍历后没有找到便弹出其父节点
       outputArray.pop();
     } else if (
       !item.hasOwnProperty("children") ||
       item.children.length === 0
     ) {
       // 遍历到最下层后弹出子节点
       outputArray.pop();
     }
   };

   getPath(tree[0], "teacher");

   console.log(outputArray); // expect output: ['courseParent', 'course']
   ```

   这样就可以完成对一颗树的一个目标的搜索，接下来将它整合到 vue 里并且做成多棵树多个目标的获取

---

---

## 多树多目标，vue

```js
export default {
    data() {
        return {
		   /* **** 角色权限列表 **** */
            rawAuthList: [],
            // 获取完数据，扁平化的列表，取eventCode
            purePlainList: [],
            editRoleAuthsForm: {
                roleAuths: []
            }

        }
    },
    methods: {
        /* 获取用户权限列表 */
        getRoleAuth(roleId) {
            /* 切换角色的时候先清除掉下面几个东西，防止角色权限出错 */
            this.$set(this.editRoleAuthsForm, `roleAuths`, []);
            this.$set(this, `rawAuthList`, []);
            this.$set(this, `purePlainList`, []);
            this.fullscreenLoading = true;
            this.$axios2
                .getFetch(
                    this.$api.getRoleAuth,
                    {
                        roleId
                    },
                    `auth`
                )
                .then(res => {
                    /* 先将数据取出，对应步骤1 */
                    res.data.forEach(item => {
                        this.purePlainList.push(item.eventCode);
                    });
                    /* 多个目标 */
                    this.purePlainList.forEach(target => {
                        /* 多棵树 */
                        this.getPaths(this.options, target);
                    });

                    /* 清洗数据，将空路径全部清除，获取目标数组 */
                    const targetList = this.rawAuthList.filter(item => {
                        return item.length > 0;
                    });

                    /* 目标数组赋值给变量 */
                    this.editRoleAuthsForm.roleAuths = this.$set(
                        this.editRoleAuthsForm,
                        `roleAuths`,
                        targetList
                    );
                })
                .finally(() => {
                    this.fullscreenLoading = false;
                });
        },

        /* 单个树单个目标 */
        getTreePath(item, target) {
            let outputArr = [],
                findFlag = false;
            const getPath = (item, target) => {
                outputArr.push(item.value);
                if (item.value === target) {
                    // 找到节点后设置标识
                    findFlag = true;
                    return;
                }
                if (
                    item.hasOwnProperty('children') &&
                    item.children.length > 0
                ) {
                    // 有子节点且子节点个数 > 0
                    for (let i = 0; i < item.children.length; i++) {
                        getPath(item.children[i], target);
                        if (findFlag) {
                            // 如果有标识则不进行多余操作，直接返回
                            return;
                        }
                    }
                    // 子节点遍历后没有找到便弹出其父节点
                    outputArr.pop();
                } else if (
                    !item.hasOwnProperty('children') ||
                    item.children.length === 0
                ) {
                    // 遍历到最下层后弹出子节点
                    outputArr.pop();
                }
            };
            getPath(item, target);
            this.rawAuthList.push(outputArr);
        },

        /* 树列表（多棵树）的单个目标 */
        getPaths(treeList, item) {
            treeList.forEach(treeItem => {
                this.getTreePath(treeItem, item);
            });
        },
    }
```
