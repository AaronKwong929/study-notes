<template>
<div class="form-input form-item">
    <div class="form-label">
        <span class="required" v-show="info && info.compulsoryStatus === 1">*</span>
        <slot name="index"></slot>
        {{label}}
    </div>
    <div class="form-content">
        <el-input 
            class="input" 
            v-model="value" 
            placeholder="请输入" 
            :type="getInputType(type)" 
            :autosize="type === 'textareaInput' ? { minRows: 6, maxRows: 8} : null" 
            :maxlength="getMaxlength(type)"
            :show-word-limit="type === 'textareaInput'"
            @input="handleInput"
        >
            <div v-if="type === 'nameInput'" class="input-icon__box" slot="prefix">
                <img class="input-icon" src="../../assets/用户icon@2x.png" alt="用户名" />
            </div>
            <div v-if="type === 'phoneInput'" class="input-icon__box" slot="prefix">
                <img class="input-icon" src="../../assets/手机icon@2x.png" alt="手机号码" />
            </div>
        </el-input>
    </div>
    <div class="form-tip">
        <i v-show="errorMsg !== ''" class="el-icon-warning el-icon--left"></i>
        {{errorMsg}}
    </div>
</div>
</template>

<script>
export default {
    name: 'form-input',

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
            value: '',
            errorMsg: ''
        };
    },

    methods: {
        getValue() {
            let obj = {
                answerType: this.info.answerType,
                answerValue: JSON.stringify([this.value]),
                optionIdList: [],
                questionId: this.id
            };
            return obj;
        },

        validate() {
            // 检测是否必填
            if (
                this.info.compulsoryStatus === 1 &&
                (this.value == null || this.value === '')
            ) {
                this.errorMsg = '请填写完整';
                return false;
            }

            // 验证手机号码
            if (
                this.type === 'phoneInput' &&
                this.value !== '' &&
                !/^1[0-9]{10}$/.test(this.value)
            ) {
                this.errorMsg = '请输入11位格式正确的手机号码';
                return false;
            }

            // 验证姓名中文
            if (
                this.type === 'nameInput' &&
                this.value !== '' &&
                !/^[\u4e00-\u9fa5]+$/.test(this.value)
            ) {
                this.errorMsg = '请输入中文姓名';
                return false;
            }

            this.errorMsg = '';
            return true;
        },

        getInputType(type) {
            switch (type) {
                case 'phoneInput':
                    return 'number';
                case 'textareaInput':
                    return 'textarea';
                default:
                    return 'text';
            }
        },

        getMaxlength(type) {
            if (type === 'nameInput') {
                return 6;
            }
            return this.info.answerLengthLimit || null;
        },

        handleInput(value){
            if(this.type !== 'phoneInput'){
                return
            }
            if(String(value).length > 11){
                this.value = String(value).slice(0, 11)
            }
        }
    }
};
</script>

<style lang="scss">
@import './form.scss';

.form-input {
    .input {
        font-size: 0.14rem;

        &.el-input--prefix {
            input {
                padding-left: 0.35rem;
            }
        }

        input {
            // height: 0.4rem;
            // line-height: 0.4rem;
            height: auto;
            line-height: .18rem;
            padding-top: 0.11rem;
            padding-bottom: 0.1rem; // 直接设置高度的话，ios下光标不会垂直居中

            color: $fc2;
            font-size: 0.14rem;
            background: rgb(255, 254, 252);
            border-color: $theme-color;

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none !important;
            }

            &[type='number'] {
                -moz-appearance: textfield;
            }

            -webkit-tap-highlight-color: transparent; // 去掉ios下点击输入框，会出现一个灰色背景问题
            -webkit-appearance: none; // 去除ios下默认样式
        }

        textarea {
            color: $fc2;
            font-size: 0.14rem;
            background: rgb(255, 254, 252);
            font-family: inherit;
            border-color: $theme-color;
            -webkit-tap-highlight-color: transparent; // 去掉ios下点击输入框，会出现一个灰色背景问题
            -webkit-appearance: none; // 去除ios下默认样式
        }

        /deep/ .el-input__prefix {
            display: flex;
            align-items: center;
            justify-content: center;

            .el-input__icon {
                line-height: 0.4rem;
            }
        }

        .input-icon__box {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 0.3rem;
            height: 100%;

            .input-icon {
                width: 0.13rem;
            }
        }

        .el-input__count{
            font-size: .12rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: $fc2;
        }
    }
}
</style>
