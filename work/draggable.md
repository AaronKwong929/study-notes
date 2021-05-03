# vue-draggable 使用

## 安装

```bash
npm install vuedraggable
```

## 引入

```js
import draggable from "vuedraggable";

components: {
  draggable;
}
```

### 配置

```js
group: { name: "...", pull: [true, false, clone],
tag: 'td' // 默认div，设置draggable标签解析html标签
v-model：data // 绑定数据列表
put: [true, false, array] } // name相同的组可以互相拖动, pull可以写条件判断，是否允许拖走，put可以写条件判断，是否允许拖入
sort: true,  // 内部拖动排序列表
delay: 0, // 以毫秒为单位定义排序何时开始。
touchStartThreshold: 0, // px,在取消延迟拖动事件之前，点应该移动多少像素?
disabled: false, // 如果设置为真，则禁用sortable。
animation: 150,  // ms, 动画速度运动项目排序时，' 0 ' -没有动画。
handle: ".my-handle",  // 在列表项中拖动句柄选择器，设置某些地方拖动才有效。
filter: ".ignore-elements",  // 不能拖拽的选择器(字符串 class)
preventOnFilter: true, // 调用“event.preventDefault()”时触发“filter”
draggable: ".item",  // 指定元素中的哪些项应该是可拖动的class。
ghostClass: "sortable-ghost",  // 设置拖动元素的class的占位符的类名。
chosenClass: "sortable-chosen",  // 设置被选中的元素的class
dragClass: "sortable-drag",  //拖动元素的class。
forceFallback: false,  // 忽略HTML5的DnD行为，并强制退出。（h5里有个属性也是拖动，这里是为了去掉H5拖动对这个的影响）
fallbackClass: "sortable-fallback",  // 使用forceFallback时克隆的DOM元素的类名。
fallbackOnBody: false,  // 将克隆的DOM元素添加到文档的主体中。（默认放在被拖动元素的同级）
fallbackTolerance: 0, // 用像素指定鼠标在被视为拖拽之前应该移动的距离。
scroll: true, // or HTMLElement
scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) { ... },
scrollSensitivity: 30, // px
scrollSpeed: 10, // px
```

```js
start (evt) {} // 刚开始拖动时候触发
add (evt) {} // 拖拽新增的时候触发
remove (evt) {} // 从列表拖走，移除触发
update (evt) {} // 列表更新触发
end (evt) {} // 和start对应，拖拽完了触发
choose(evt) {} // 选择拖拽元素触发
sort (evt) {} // 排序触发
change (evt) {} // 这个很重要，如果数据不是整个提交，单个提交数据的时候就会用到它 evt.added.element / evt.removed.element如果这个列表添加元素就会added的数据，如果删除元素就是removed的元素，还会获取到移动和删除的所在位置index
:move (evt, dragevt) {} // 这个也很重要，在两个列表相互拖拽的时候，有时候需要更新ui，在接口还没有更新之前，所以就会用到move，他是把元素从一个列表拖到另一个列表的瞬间触发，这时候可以给原来的位置设置元素样式等等。
```

## 直接使用 chrome 避免其他浏览器的问题

```js
// firefox 火狐浏览器默认拖拽搜索问题
created () {
    // 阻止火狐浏览器默认的拖拽搜索行为
    document.body.ondrop = (event) \=> {
        // 阻止事件默认行为
        event.preventDefault()
        // 阻止时间冒泡
        event.stopPropagation()
    }
}
```

## safari 浏览器的拖拽问题

```js
/*
safari浏览器拖动一次，不能连续拖动第二次，只能在空白处单机才可以继续拖拽，添加 :forceFallback="true"解决
*/
<draggable
:group="{name: 'scene', pull: 'clone'}"
:sort="false"
:forceFallback="true"
```
