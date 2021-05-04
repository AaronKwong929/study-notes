<template>
    <div class="form-rate form-item">
        <div class="form-label">
            <span class="required" v-show="info && info.compulsoryStatus === 1">*</span> 
            <slot name="index"></slot>
            {{label}}
        </div>
        <div class="form-content">
            <div class="star">
                <div class="star-item" v-for="(item, index) in options" :key="item.id" @click="value = index + 1;">
                    <img v-if="(index + 1) <= value" src="../../assets/星星1@2x.png" alt="评价">
                    <img v-else src="../../assets/星星5@2x.png" alt="评价">
                </div>
                <div class="star-text">{{value > 0 ? (options[value - 1].content) : ''}}</div>
            </div>
        </div>
        <div class="form-tip"><i v-show="errorMsg !== ''" class="el-icon-warning el-icon--left"></i>{{errorMsg}}</div>
    </div>
</template>

<script>
export default {
    name: 'form-rate',

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
        
        info: {
            type: Object,
            default: () => {
                return {}
            }
        },

        options: {
            type: Array,
            default: () => {
                return []
            }
        }
    },

    data(){
        return {
            value: 0,
            errorMsg: '',  
        }
    },

    methods: {
        getValue(){
            let obj = {
                answerType: this.info.answerType,
                answerValue: JSON.stringify([this.value]),
                optionIdList: this.value > 0 ? [this.options[this.value - 1].id] : [],
                questionId: this.id
            }
            return obj
        },

        validate(){
            if(this.info.compulsoryStatus === 1 && (this.value == null || this.value < 1)){
                this.errorMsg = '请填写完整';
                return false
            }

            this.errorMsg = '';
            return true
        }
    }
}
</script>

<style lang='scss' scope>
.form-rate{

    .star{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &-item{
            width: .23rem;
            margin-right: .11rem;
            font-size: 0;
            flex-shrink: 0;
            img{
                width: 100%;
                height: auto;
            }
        }

        &-text{
            font-size: .14rem;
            font-weight: 500;
            color: $theme-color;
            padding-left: .04rem;
        }
    }
}
</style>