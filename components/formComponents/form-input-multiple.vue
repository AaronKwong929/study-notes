<template>
    <div class="form-input-multiple form-item">
        <div class="form-label">
            <span class="required" v-show="info && info.compulsoryStatus === 1"
                >*</span
            >
            <slot name="index"></slot>
            <!-- {{label}} -->
            填空题
        </div>
        <div class="form-content">
            <input-multiple
                :content="label"
                :length-limit="info.answerLengthLimit"
                ref="inputMultiple"
            />
        </div>
        <div class="form-tip">
            <i
                v-show="errorMsg !== ''"
                class="el-icon-warning el-icon--left"
            ></i
            >{{ errorMsg }}
        </div>
    </div>
</template>

<script>
const inputMultiple = {
    props: {
        content: {
            type: String,
            default: ''
        },

        lengthLimit: {
            type: Number
        }
    },

    data() {
        return {
            value: [], // 按顺序存放填空的各个值
            inputNum: 0 // 记录填空的数量
        };
    },

    render(createElement) {
        console.log('render');
        let self = this;
        let list = this.content.split('___'); // TODO:改成正确的切割符号
        let vnodeList = [];
        self.inputNum = list.length - 1;

        list.forEach((item, index) => {
            vnodeList.push(createElement('span', item));
            if (index < list.length - 1) {
                vnodeList.push(
                    createElement('input', {
                        attrs: {
                            type: 'text',
                            'data-index': index,
                            maxlength: self.lengthLimit || 200
                        },
                        class: { input: true },
                        on: {
                            input: function(e) {
                                self.value[parseInt(e.target.dataset.index)] =
                                    e.target.value;
                            }
                        }
                    })
                );
            }
        });

        return createElement(
            'pre',
            {
                class: { content: true }
            },
            vnodeList
        );
    },

    mounted () {
        // 默认填充空字符串
        for (let i = 0; i < this.inputNum; i++) {
            this.value.push('');
        }
    },

    methods: {
        // 整段文本获取
        getTextValue() {
            let res = '';
            let nodes = this.$el.childNodes;
            for (let i = 0; i < nodes.length; i++) {
                const ele = nodes[i];
                if (ele.nodeType === 1 && ele.nodeName === 'SPAN') {
                    res += ele.innerText;
                }
                if (ele.nodeType === 1 && ele.nodeName === 'INPUT') {
                    res += ele.value;
                }
            }
            return res;
        },

        // 只获取输入的各个值
        getInputValue() {
            return this.value;
        }
    }
};

export default {
    name: 'form-input-multiple',

    components: {
        inputMultiple
    },

    props: {
        type: {
            type: String
        },

        id: {
            type: [String, Number]
        },

        label: {
            type: String
        },

        info: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },

    data() {
        return {
            errorMsg: ''
        };
    },

    methods: {
        getValue() {
            let obj = {
                answerType: this.info.answerType,
                answerValue: JSON.stringify(this.$refs.inputMultiple.getInputValue()),
                optionIdList: [],
                questionId: this.id
            };
            return obj;
        },

        validate() {
            // 检测是否必填
            if (this.info.compulsoryStatus === 1) {
                this.errorMsg = '请填写完整';

                let inputNum = this.$refs.inputMultiple.inputNum;
                let values = this.$refs.inputMultiple.getInputValue();

                if (values.length < inputNum) {
                    return false;
                }
                if (values.some(item => item == null || item === '')) {
                    return false;
                }
            }

            this.errorMsg = ''; // 所有检验通过时，清除当前警示语
            return true;
        }
    }
};
</script>

<style lang="scss" scope>
@import './form.scss';
.form-input-multiple {
    .content {
        white-space: pre-line;
        line-height: 0.26rem;
        font-family: inherit;
        font-size: 0.14rem;
        font-weight: 500;
        color: $fc2;
    }

    .input {
        border: none;
        border-bottom: 1px solid $fc2;
        border-top: 0px solid rgb(255, 254, 252);
        border-right: 0px solid rgb(255, 254, 252);
        border-left: 0px solid rgb(255, 254, 252);
        border-radius: 0;
        background: none;
        outline: none;
        width: 7em;
        margin: 0 0.5em;
        font-family: inherit;
        font-size: 0.14rem;
        font-weight: 500;
        color: #666666;
        line-height: 0.2rem;
        -webkit-tap-highlight-color: transparent; // 去掉ios下点击输入框，会出现一个灰色背景问题

    }
}
</style>
