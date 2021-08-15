# 手撸一个 JSON 预览组件

## 实现思路

能够展开收起某层，能够在数组层外展示包含元素个数，能用颜色区分不同类型

## 完整代码

```vue
<template>
  <div class="json-view-container" v-if="visible">
    <div :class="['json-view', length ? 'closeable' : '']">
      <span @click="toggle" class="angle" v-if="length">
        <svg
          v-if="innerclosed"
          :fill="'#747983'"
          width="1em"
          height="1em"
          viewBox="0 0 1792 1792"
          style="vertical-align: middle; color: rgb(42, 161, 152); height: 1em; width: 1em;"
        >
          <path
            d="M1344 800v64q0 14-9 23t-23 9h-352v352q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-352h-352q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h352v-352q0-14 9-23t23-9h64q14 0 23 9t9 23v352h352q14 0 23 9t9 23zm128 448v-832q0-66-47-113t-113-47h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q119 0 203.5 84.5t84.5 203.5z"
          />
        </svg>

        <svg
          v-if="!innerclosed"
          :fill="'#747983'"
          width="1em"
          height="1em"
          viewBox="0 0 1792 1792"
          style="vertical-align: middle; color: rgb(88, 110, 117); height: 1em; width: 1em;"
        >
          <path
            d="M1344 800v64q0 14-9 23t-23 9h-832q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h832q14 0 23 9t9 23zm128 448v-832q0-66-47-113t-113-47h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q119 0 203.5 84.5t84.5 203.5z"
          />
        </svg>
      </span>

      <div class="content-wrap">
        <p class="first-line">
          <span v-if="jsonKey" class="json-key">"{{ jsonKey }}": </span>

          <span v-if="length"
            >{{ prefix }}{{ innerclosed ? '...' + subfix : '' }}
            <span class="json-note">{{
              innerclosed ? length + ' items' : ''
            }}</span>
          </span>

          <span v-if="!length">{{
            `${isArray ? '[]' : '{}'}${isLast ? '' : ','}`
          }}</span>
        </p>

        <div v-if="!innerclosed && length" class="json-body">
          <template v-for="(item, index) in items">
            <!-- 是数组/对象则递归嵌套渲染 -->
            <template v-if="item.isJSON">
              <json-viewer
                v-if="item.isJSON"
                :key="index"
                :data="item.value"
                :json-key="item.key"
                :current-deep="currentDeep + 1"
                :closed="isClosed()"
                :deep="deep"
                :is-last="index === items.length - 1"
              />
            </template>
            <!-- 否则直接渲染对象/数字 -->
            <template v-else>
              <p class="json-item" :key="index">
                <span class="json-key">{{
                  isArray ? '' : `"${item.key}":`
                }}</span>
                <span :class="['json-value', getDataType(item.value)]">
                  {{
                    `${isString(item.value) ? '"' : ''}${item.value}${
                      isString(item.value) ? '"' : ''
                    }${index === items.length - 1 ? '' : ','}`
                  }}
                </span>
              </p>
            </template>
          </template>

          <span v-if="!innerclosed" class="bracket-line" />
        </div>

        <p v-if="!innerclosed" class="last-line">
          <span>{{ subfix }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { isArray, isObject, isString, getDataType } from '@/utils/data-type.js';

export default {
  name: 'JsonViewer',

  props: {
    data: {
      type: [Object, Array],
      required: true,
    },

    jsonKey: {
      // JSON对象的 key 值，用于第二层及二层以上的组件
      type: String,
      default: '',
    },

    isLast: {
      //是否是最后一行
      type: Boolean,
      default: true,
    },

    closed: {
      type: Boolean,
      default: false,
    },

    deep: {
      // 默认展开深度
      type: Number,
      default: 3,
    },

    currentDeep: {
      // 当前递归层数
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      innerclosed: this.closed,
      visible: false,
    };
  },

  computed: {
    isArray() {
      return isArray(this.data);
    },

    length() {
      return this.isArray ? this.data.length : Object.keys(this.data).length;
    },

    // 前后包裹
    prefix() {
      return this.isArray ? '[' : '{';
    },

    subfix() {
      const data = this.data;
      if (this.isEmptyArrayOrObject(data)) {
        return '';
      } else {
        return (this.isArray ? ']' : '}') + (this.isLast ? '' : ',');
      }
    },

    items() {
      const json = this.data;
      if (this.isArray) {
        return json.map(item => {
          const isJSON = this.isObjectOrArray(item);
          return {
            value: item,
            isJSON,
            key: '',
          };
        });
      }
      return Object.keys(json).map(key => {
        const item = json[key];
        const isJSON = this.isObjectOrArray(item);
        return {
          value: item,
          isJSON,
          key,
        };
      });
    },
  },

  methods: {
    getDataType(data) {
      return getDataType(data).toLowerCase();
    },

    isString(data) {
      return isString(data);
    },

    isObjectOrArray(data) {
      return isObject(data) || isArray(data);
    },

    toggle() {
      if (this.length === 0) {
        return;
      }
      this.innerclosed = !this.innerclosed;
    },

    isClosed() {
      return this.currentDeep + 1 > this.deep;
    },

    isEmptyArrayOrObject(data) {
      return [{}, []]
        .map(item => JSON.stringify(item))
        .includes(JSON.stringify(data));
    },
  },

  mounted() {
    setTimeout(() => {
      this.visible = true;
    }, 0);
  },
};
</script>

<style scoped lang="scss">
.json-view-container {
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;

  .json-view {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    padding-left: 2rem;
    box-sizing: border-box;
    font-family: Consolas !important;
    cursor: default;

    .json-note {
      color: #909399;
      font-size: 12px;
      font-style: italic;
    }

    .json-key {
      color: #8c6325;
    }

    .json-value {
      display: inline-block;
      color: #57b73b;
      word-break: break-all;
      white-space: normal;
      &.number {
        color: #2d8cf0;
      }

      &.string {
        color: #57b73b;
      }

      &.boolean {
        color: #eb3324;
      }

      &.null {
        color: #eb3324;
      }
    }

    .json-item {
      margin: 0;
      padding-left: 2rem;
      display: flex;
    }

    .first-line {
      padding: 0;
      margin: 0;

      &.pointer {
        cursor: pointer !important;
      }
    }

    .json-body {
      position: relative;
      padding: 0;
      margin: 0;

      .bracket-line {
        position: absolute;
        height: 100%;
        border-left: 1px dashed #bbb;
        top: 0;
        left: 3px;
      }
    }

    .last-line {
      padding: 0;
      margin: 0;
    }

    .angle {
      position: absolute;
      display: block;
      cursor: pointer;
      float: left;
      width: 20px;
      text-align: center;
      left: 12px;
    }
  }
}
</style>
```

## 参考

https://juejin.cn/post/6844903841113047047
