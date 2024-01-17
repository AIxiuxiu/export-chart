//monaco-editor文档 https://microsoft.github.io/monaco-editor/api/index.html

var javaEditor;
var iniEditor;
var xmlEditor;

const defaultJavaCode = ``;
const defaultIniCode = `# 图片默认宽度
echarts.service.width=800
# 图片默认高度
echarts.service.height=400
# 图片默认像素大小
echarts.service.pixelRatio=2
# 图片默认主题
echarts.service.theme=vintage
# 图片项目名称，用于区分项目
echarts.service.appName=yourAppName
# 本地存储图片的目录，相对于class
echarts.service.echartsImg=imgFile
# echarts服务接口地址
echarts.service.url=http://192.168.23.92:3000`;

var defaultXmlCode = `<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.5.7</version>
</dependency>`;


require.config({
    paths: { 'vs': '/monaco-editor/min/vs' },
    'vs/nls': {
        availableLanguages: {
            "*": "zh-cn"
        }
    }
});

require(['vs/editor/editor.main'], function () {

    // 定义编辑器主题
    monaco.editor.defineTheme('myTheme', {
        base: 'vs',
        inherit: true,
        rules: [{ background: 'EDF9FA' }],
    });
    monaco.editor.setTheme('myTheme');

    // 新建一个编辑器
    function createEditor(container_id, code, language) {
        var model = monaco.editor.createModel(code, language);
        var editor = monaco.editor.create(document.getElementById(container_id), {
            model: model,
            readOnly: true,
            // wordWrap: "on", // 自动换行
            automaticLayout: true,
            overviewRulerBorder: false, // 不要滚动条的边框
            scrollBeyondLastColumn: 12,
            scrollBeyondLastLine: false, // 滚动最后一行的留白
            // 代码略缩图
            minimap: {
                enabled: false
            }
        });
        return editor;
    }

    iniEditor = createEditor("ini_monaco_container", defaultIniCode, 'ini');
    xmlEditor = createEditor("xml_monaco_container", defaultXmlCode, 'xml');
    javaEditor = createEditor("java_monaco_container", defaultJavaCode, 'java');
});


const Editor = {
    setJavaCode: (value) => {
        javaEditor.getModel().setValue(value);
    },
    setIniCode: (value) => {
        iniEditor.getModel().setValue(value);
    }
}



