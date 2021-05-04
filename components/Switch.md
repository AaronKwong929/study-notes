# 开关

## 完整代码

```html
<template>
  <input
    class="switch-component"
    type="checkbox"
    v-model="isChecked"
    @change="onCheckChanged"
    :style="{
      '--backgroundColor': backgroundColor,
      '--selectedBackgroundColor': selectedBackgroundColor,
      '--buttonColor': buttonColor,
    }"
  />
</template>

<script>
  export default {
    name: "Switch",

    props: {
      backgroundColor: {
        type: String,
        default: "#dadada",
      },

      selectedBackgroundColor: {
        type: String,
        default: "#FF6706",
      },

      buttonColor: {
        type: String,
        default: "#fff",
      },

      checked: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        isChecked: false,
      };
    },

    mounted() {
      this.isChecked = this.checked;
    },

    methods: {
      onCheckChanged: function () {
        this.$emit("change", this.isChecked);
      },
    },
  };
</script>

<style>
  .switch-component {
    position: relative;
    width: 31px;
    height: 17px;
    border-radius: 15px;
    border: none;
    outline: none;
    -webkit-appearance: none;
    transition: all 0.2s ease;
    background-color: var(--backgroundColor);
  }

  .switch-component::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: var(--buttonColor);
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .switch-component:checked {
    background-color: var(--selectedBackgroundColor);
  }

  .switch-component:checked::after {
    left: 50%;
  }
</style>
```
