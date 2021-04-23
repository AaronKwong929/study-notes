# Vant Dropdown Item 的暗坑

```js
if (filterDetailsStatus.value) {
    const dom = document.querySelector(`.filter-details-ref`);
    dom &&
        dom.dispatchEvent(
            new Event(`click`, {
                view: window,
                bubbles: true,
                cancelable: true,
            })
        );
}
```
