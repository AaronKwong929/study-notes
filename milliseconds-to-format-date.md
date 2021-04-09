# 从一个时间戳算时间的需求出发想到的小工具拓展

## 最简单的

```js
function formatDuring(mss) {
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (mss % (1000 * 60)) / 1000;
    return (
        days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 "
    );
}
```

## 稍微复杂一点

可以想到 switch 语句，case 下不写 break 的话会继续顺次执行下去的这个特性，传入 type，从 type 开始进行结果计算，每个 case 的结果累加到 result 中最终返回效果

```javascript
export const milliToHour = (ms = new Date().getTime(), type = `days`) => {
    const days = parseInt(ms / (1000 * 60 * 60 * 24)),
        hours = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60)),
        seconds = Math.floor((ms % (1000 * 60)) / 1000);

    let result = ``;
    // note: 不写 break 会顺次执行下去
    switch (type) {
        case `days`:
            result += `${days}天 `;

        case `hours`:
            result += `${hours}小时 `;

        case `minutes`:
            result += `${minutes}分钟 `;

        case `seconds`:
            result += `${seconds}秒`;
            break;

        default:
            break;
    }

    return result;
};
```

测试一下

![switch-case-method](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210407151400.png)

没有毛病!

## 再复杂一点

如果产品说：“我只要 XX 天 XX 小时不要秒” 的情况呢

~~把产品鲨了，就你事多~~

需求还是要做的

这里我就想到了，type 传入一个 String[] 再 forEach 判断，给最终结果加入

代码如下：

```javascript
const milliToHour2 = (
    ms = new Date().getTime(),
    type = [`days`, `hours`, `minutes`, `seconds`]
) => {
    const timeMap = Object.freeze({
            days: parseInt(ms / (1000 * 60 * 60 * 24)),
            hours: parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: parseInt((ms % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((ms % (1000 * 60)) / 1000),
        }),
        unitMap = Object.freeze({
            days: `天`,
            hours: `小时`,
            minutes: `分钟`,
            seconds: `秒`,
        });

    let result = ``;

    type.forEach((item) => {
        result += `${timeMap[item]}${unitMap[item]}`;
    });

    return result;
};
```

通过哈希表记录对应的值和单位，对传入的 type 进行遍历加入 result，得到结果

测试一下：

![better1](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210408095638.png)

不按顺序传值也没有问题！

## 再再复杂一点

如果其他技术说：“哦哟我 type 不按顺序传，但我还要这个效果” 的情况呢

~~技术何苦为难技术~~

其实也很简单，这里只需要加权排序即可，通过一个额外的 hash 表记录每个字段对应的权重，再根据权重排序

代码如下：

```javascript
// 这是权重
const orderMap = Object.freeze({
    seconds: 1,
    minutes: 2,
    hours: 3,
    days: 4,
});

// 这是单位
const unitMap = Object.freeze({
    days: `天`,
    hours: `小时`,
    minutes: `分钟`,
    seconds: `秒`,
});

const milliToHour = (
    ms = new Date().getTime(),
    type = [`days`, `hours`, `minutes`, `seconds`]
) => {
    const timeMap = Object.freeze({
        days: parseInt(ms / (1000 * 60 * 60 * 24)),
        hours: parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: parseInt((ms % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((ms % (1000 * 60)) / 1000),
    });

    // 加权排序
    type.sort((a, b) => orderMap[b] - orderMap[a]);

    let result = ``;

    type.forEach((item) => {
        result += `${timeMap[item]}${unitMap[item]}`;
    });

    return result;
};
```

测试一下

![better-2](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210409125319.png)

## 其他需要注意的

传入的值可能会有问题，需要加入类型判断

## 没有函数重载但是期望 type 可以传数组或者字符串？

## 最终完整代码

```javascript

```

## 最后

> 写着写着从一个传值导出变成了一个小工具，不知道说是想把需求做好做完善还是说自己闲的
