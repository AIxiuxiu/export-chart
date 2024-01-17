/*
 * @Description:
 * @Author: ahl
 * @Date: 2021-01-15 12:35:53
 * @LastEditTime: 2021-01-15 13:26:38
 */

function runScript(script) {
    return new Promise((reslove, rejected) => {
        // 直接 document.head.appendChild(script) 是不会生效的，需要重新创建一个
        const newScript = document.createElement('script');

        // 获取 inline script
        newScript.innerHTML = script.innerHTML;
        // 存在 src 属性的话
        const src = script.getAttribute('src');
        if (src) {
            newScript.async = false
            newScript.setAttribute('src', src);
        }

        // script 加载完成和错误处理
        newScript.onload = () => {
            console.error(echarts);
            reslove();
        }
        newScript.onerror = err => rejected();
        document.head.appendChild(newScript);
        // document.head.removeChild(newScript);
        if (!src) {
            // 如果是 inline script 执行是同步的
            reslove();
        }
    })
}

function setHTMLWithScript(container, rawHTML) {
    var range = document.createRange();
    // make the parent of the first div in the document becomes the context node
    range.selectNode(document.body);
    var documentFragment = range.createContextualFragment(rawHTML);

    const scripts = documentFragment.querySelectorAll('script');
    for (script of scripts) {
        documentFragment.removeChild(script);
    }

    container.innerHTML = documentFragment;
    return Array.prototype.slice.apply(scripts).reduce((chain, script) => {
        return chain.then(() => runScript(script));
    }, Promise.resolve());
}