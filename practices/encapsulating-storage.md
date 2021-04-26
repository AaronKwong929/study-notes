# 封装 Storage 的一个实践

localStorage 在设置内容时，如果值没有发生变化，则不会触发 storage 事件，这在于使用 localStorage 进行同域通讯出现问题

值不改变则不会触发 [Storage 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/storage_event)

## 导出

解决方法：对 localStorage 方法进行封装，每一次 set 值把 timestamp 带上

```js
localStorage.setItem(key, JSON.stringify({ val, timestamp: Date.now() }));
```

## 完整代码

```js
export const getItem = (key) => {
    try {
        const val = JSON.parse(localStorage.getItem(key));
        return val ? val.data : null;
    } catch (err) {
        console.error(`获取本地数据: ${key} 异常`, err);
    }
};

export const setItem = (key, data) => {
    try {
        // 这里显式指定 key 名为 data
        localStorage.setItem(
            key,
            JSON.stringify({ data: data, timestamp: Date.now() })
        );
        return;
    } catch (err) {
        console.error(`设置本地数据: ${key} 异常`, err);
    }
};

export const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
        return;
    } catch (err) {
        console.error(`删除本地数据: ${key} 异常`, err);
    }
};

export const clearStorage = () => localStorage.clear();
```

## 结束
