<template>
    <div class="form-checkbox form-item">
        <div class="form-label">
            <span class="required" v-show="info && info.compulsoryStatus === 1">*</span> 
            <slot name="index"></slot>
            {{label}} <span class="label-type">（{{getLabelTip()}}）</span>
        </div>
        <div class="form-content">
            <el-checkbox-group 
                class="checkbox-container" 
                v-model="value" 
                :max="info.answerLengthLimit > 0 ? info.answerLengthLimit : undefined"
                @change="onChange" 
            >
                <template v-for="(item) in options">   
                    <el-checkbox 
                        class="checkbox"
                        v-if="item.optionType !== 1"
                        :key="item.id"
                        :label="item"
                        @change="onSelect($event, item)"
                    >
                        <span>{{item.content}}</span>
                    </el-checkbox>
                    <!-- 【其他】项 -->
                    <el-checkbox v-else :label="item" class="checkbox" :key="item.id" @change="onSelect($event, item)">
                        <div class="other-container">
                            <span>{{item.content}}</span>
                            <input 
                                type="text" 
                                class="input-other" 
                                v-model="other" 
                                :maxlength="Array.isArray(item.ruleTypes) && item.ruleTypes.includes(1) ? item.optionLengthLimit : 200"
                            > 
                            <span 
                                class="required" 
                                v-if="Array.isArray(item.ruleTypes) && item.ruleTypes.includes(2)"
                            >*</span>
                        </div>
                    </el-checkbox>
                </template>
            </el-checkbox-group>
        </div>
        <div class="form-tip"><i v-show="errorMsg !== ''" class="el-icon-warning el-icon--left"></i>{{errorMsg}}</div>
    </div>
</template>

<script>
export default {
    name: 'form-checkbox',

    props: {
        type: {
            type: String,
        },

        id: {
            type: [String, Number],
        },

        label: {
            type: String,
        },

        options: {
            type: Array,
            default: () => {
                return [] 
            }
        },
        
        info: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },

    data(){
        return {
            value: [],
            errorMsg: '',
            other: '',
        }
    },

    methods: {
        validate(){
            // 检测必填
            if(this.info.compulsoryStatus === 1){
                if(this.value.length === 0){
                    this.errorMsg = '请填写完整';
                    return false
                }
            }

            // 验证选中其他项时，补充填空是否必填
            let hasOther = null;
            this.value.some((item) => {
                if(item.optionType === 1){
                    hasOther = item;
                    return true
                }
                return false
            })
            if(hasOther && Array.isArray(hasOther.ruleTypes) && hasOther.ruleTypes.includes(2) && (this.other == null || this.other === '')){
                this.errorMsg = '请补充其他选项';
                return false
            }

            this.errorMsg = ''; // 所有检验通过时，清除当前警示语
            return true
        },

        getValue(){
            let obj = {
                answerType: this.info.answerType,
                answerValue: "[]",
                optionIdList: this.value.map((item) => item.id),
                questionId: this.id
            }
            // 有勾选'其他'项时，应该把其他项的值加上
            if(this.value.some((item) => item.optionType === 1)){
               obj.answerValue = JSON.stringify([this.other]); 
            }
            return obj
        },

        onChange(val){
            // 模拟单选框
            if(this.type === 'radio'){
                this.value = val.length > 0 ? [val.pop()] : [];
            }
        },

        onSelect(checked, item){
            // 互斥状态:0-正常；1-互斥项
            // 如果选中的是一个互斥项，则把其他清空，并保留自己
            // 如果选中的不是一个互斥项，则判断当前已选的有没有互斥项，有的话需要去除该互斥项
            
            if(item.exclusiveStatus !== 1){
                let index = -1;
                this.value.some((item, i) => {
                    if(item.exclusiveStatus === 1){
                        index = i;
                        return true
                    }
                    return false
                })
                if(index > -1){
                    this.value.splice(index, 1);
                }
                return
            }
            if(checked){
                this.value = [item]; // 清空其他项，只保留当前项
                
            }
        },

        getLabelTip(){
            if(this.type === 'checkbox'){
                if(this.info.answerLengthLimit != null && this.info.answerLengthLimit > 0){
                    return `至多选${this.info.answerLengthLimit}项`;
                }else{
                    return '可多选'
                }
            }else{
                return '单选'
            }
        }

    }
}
</script>

<style lang='scss'>
@import './form.scss';
.form-checkbox{

    .label-type{
        color: $fc2;
        font-weight: 500;
        font-size: .12rem;
    }

    .checkbox-container{
        padding: 0 .13rem;
        border: 1px solid $theme-color;
        border-radius: 5px;
    }

    .checkbox{
        display: flex;
        align-items: center;
        padding: .09rem 0;
        margin-right: 0;
        border-bottom: 1px solid #faeddb;
        &:last-of-type{
            border-bottom: none;
        }
        &.is-disabled{
            .input-other{
                border-color: #C0C4CC;
            }
        }

        .el-checkbox__input{
            &.is-disabled{
                .el-checkbox__inner{
                    border-color: #C0C4CC;
                }
            } 
            &.is-checked .el-checkbox__inner{
                border-color: $theme-color;
            }
            .el-checkbox__inner{
                width: .14rem;
                height: .14rem;
                border-color: $fc2;
                &::after{
                    width: .03rem;
                    height: .07rem;
                    left: .04rem;
                    top: .01rem;
                }
            }
        }

        .el-checkbox__label{
            color: $fc2;
            font-size: .14rem;
            line-height: 0.18rem;
            white-space: pre-wrap;
        }

        .required{
            color: #FF6951;
        }
    }

    .other-container{
        display: flex;
        flex-wrap: wrap;
        white-space: pre-line;

        .input-other{
            width: 10em;
            border: none;
            border-bottom: 1px solid $fc2;
            border-radius: none;
            background: rgb(255,254,252);
            outline: none;
            font-size: .14rem;
            color: $fc2;
            margin-left: .5em;
            line-height: 0.18rem;
            border-radius: 0; // 如果不设置为0，ios下两边会有圆弧
            -webkit-tap-highlight-color: transparent; // 去掉ios下点击输入框，会出现一个灰色背景问题
        }
    }

}
</style>