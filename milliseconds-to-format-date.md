# 从一个时间戳算时间的需求出发想到的小工具拓展

> 先开坑，慢慢填 2021年4月7日 15:20:53

1. 最简单的

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

2. 稍微复杂一点

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

来测试一下

![switch-case-method](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210407151400.png)

没有毛病!

3. 如果产品说：“我只要 XX 天 XX 小时不要秒” 的情况呢

~~把产品鲨了，就你事多~~

需求还是要做的

这里我就想到了，type 传入一个 String[] 再 forEach 判断，给最终结果加入

4. 如果其他技术说：“哦哟我 type 不按顺序传，但我还要这个效果” 的情况呢

~~想太多了~~

这里就要加权

ps. 最好加上传入值进行判断，万一后端给你的是字符串类型的时间戳呢

完整代码：

```javascript

```

## 最后

写着写着从一个传值导出变成了一个小工具

不知道说是想把需求做好做完善还是说自己闲的
