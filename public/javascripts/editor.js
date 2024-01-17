//monaco-editor文档 https://microsoft.github.io/monaco-editor/api/index.html

var jsEditor;
var jsonParamsEditor;
var jsonResultEditor;
const Hints = ["title", "show", "text", "link", "target", "textStyle", "color", "fontStyle", "fontWeight", "fontFamily", "fontSize", "textAlign", "textBaseline", "subtext", "sublink", "subtarget", "subtextStyle", "padding", "itemGap", "zlevel", "z", "left", "top", "right", "bottom", "backgroundColor", "borderColor", "borderWidth", "shadowBlur", "shadowColor", "shadowOffsetX", "shadowOffsetY", "legend", "width", "height", "orient", "align", "itemWidth", "itemHeight", "formatter", "selectedMode", "inactiveColor", "selected", "tooltip", "data", "name", "icon", "grid", "containLabel", "trigger", "axisPointer", "type", "axis", "snap", "label", "precision", "margin", "lineStyle", "opacity", "shadowStyle", "crossStyle", "position", "extraCssText", "xAxis", "gridIndex", "offset", "nameLocation", "nameTextStyle", "nameGap", "nameRotate", "inverse", "boundaryGap", "min", "max", "scale", "splitNumber", "minInterval", "interval", "logBase", "silent", "triggerEvent", "axisLine", "onZero", "axisTick", "alignWithLabel", "inside", "length", "axisLabel", "rotate", "showMinLabel", "showMaxLabel", "baseline", "splitLine", "splitArea", "areaStyle", "value", "tiggerTooltip", "status", "handle", "size", "throttle", "yAxis", "polar", "center", "radius", "radiusAxis", "polarIndex", "angleAxis", "startAngle", "clockwise", "radar", "shape", "indicator", "dataZoom", "disabled", "xAxisIndex", "yAxisIndex", "radiusAxisIndex", "angleAxisIndex", "filterMode", "start", "end", "startValue", "endValue", "minSpan", "maxSpan", "minValueSpan", "maxValueSpan", "zoomLock", "dataBackground", "fillerColor", "handleIcon", "handleSize", "handleStyle", "borderType", "labelPrecision", "labelFormatter", "showDetail", "showDataShadow", "realtime", "visualMap", "range", "calculable", "textGap", "dimension", "seriesIndex", "hoverLink", "inRange", "outOfRange", "controller", "pieces", "categories", "minOpen", "maxOpen", "showLabel", "itemSymbol", "showContent", "alwaysShowContent", "triggerOn", "showDelay", "hideDelay", "enterable", "confine", "transitionDuration", "toolbox", "itemSize", "showTitle", "feature", "saveAsImage", "excludeComponents", "iconStyle", "normal", "textPosition", "emphasis", "pixelRatio", "restore", "dataView", "readOnly", "optionToContent", "contentToOption", "lang", "textareaColor", "textareaBorderColor", "textColor", "buttonColor", "buttonTextColor", "zoom", "back", "magicType", "line", "bar", "stack", "tiled", "option", "brush", "rect", "polygon", "lineX", "lineY", "keep", "clear", "brushLink", "geoIndex", "brushType", "brushMode", "transformable", "brushStyle", "throttleType", "throttleDelay", "removeOnClick", "inBrush", "outOfBrush", "geo", "map", "roam", "aspectScale", "boundingCoords", "scaleLimit", "nameMap", "itemStyle", "layoutCenter", "layoutSize", "regions", "areaColor", "parallel", "layout", "axisExpandable", "axisExpandCenter", "axisExpandCount", "axisExpandWidth", "axisExpandTriggerOn", "parallelAxisDefault", "parallelAxis", "dim", "parallelIndex", "areaSelectStyle", "singleAxis", "timeline", "axisType", "currentIndex", "autoPlay", "rewind", "loop", "playInterval", "controlPosition", "symbol", "symbolSize", "symbolRotate", "symbolOffset", "checkpointStyle", "animation", "animationDuration", "animationEasing", "controlStyle", "showPlayBtn", "showPrevBtn", "showNextBtn", "playIcon", "stopIcon", "prevIcon", "nextIcon", "graphic", "elements", "id", "$action", "bounding", "invisible", "cursor", "draggable", "progressive", "children", "onclick", "onmouseover", "onmouseout", "onmousemove", "onmousewheel", "onmousedown", "onmouseup", "ondrag", "ondragstart", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondrop", "style", "image", "x", "y", "fill", "stroke", "lineWidth", "font", "textVeticalAlign", "cx", "cy", "r", "r0", "endAngle", "points", "smooth", "smoothConstraint", "x1", "y1", "x2", "y2", "percent", "cpx1", "cpy1", "cpx2", "cpy2", "calendar", "cellSize", "dayLabel", "firstDay", "monthLabel", "yearLabel", "series", "coordinateSystem", "showSymbol", "showAllSymbol", "hoverAnimation", "legendHoverLink", "connectNulls", "clipOverflow", "step", "smoothMonotone", "sampling", "markPoint", "valueIndex", "valueDim", "coord", "animationThreshold", "animationDelay", "animationDurationUpdate", "animationEasingUpdate", "animationDelayUpdate", "markLine", "curveness", "markArea", "barBorderRadius", "barWidth", "barMaxWidth", "barMinHeight", "barGap", "barCategoryGap", "selectedOffset", "minAngle", "roseType", "avoidLabelOverlap", "stillShowZeroSum", "labelLine", "length2", "animationType", "large", "largeThreshold", "effectType", "showEffectOn", "rippleEffect", "period", "radarIndex", "squareRatio", "leafDepth", "nodeClick", "zoomToNodeRatio", "levels", "visualDimension", "visualMin", "visualMax", "colorAlpha", "colorSaturation", "colorMappingBy", "visibleMin", "childrenVisibleMin", "ellipsis", "gapWidth", "borderColorSaturation", "breadcrumb", "emptyItemWidth", "boxWidth", "barMinWidth", "color0", "borderColor0", "blurSize", "minOpacity", "maxOpacity", "mapValueCalculation", "showLegendSymbol", "inactiveOpacity", "activeOpacity", "polyline", "effect", "delay", "constantSpeed", "trailLength", "coords", "circular", "rotateLabel", "force", "initLayout", "repulsion", "gravity", "edgeLength", "layoutAnimation", "nodeScaleRatio", "focusNodeAdjacency", "edgeSymbol", "edgeSymbolSize", "edgeLabel", "category", "nodes", "links", "source", "edges", "nodeWidth", "nodeGap", "layoutIterations", "minSize", "maxSize", "sort", "gap", "funnelAlign", "distance", "pointer", "offsetCenter", "detail", "symbolPosition", "symbolRepeat", "symbolRepeatDirection", "symbolMargin", "symbolClip", "symbolBoundingData", "symbolPatternSize", "singleAxisIndex", "date", "progressiveThreshold", "blendMode", "hoverLayerThreshold", "useUTC"]

const defaultJsCode = `var option = {
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
        data: ['销量']
    },
    xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
}`;

const defaultJsonCode = JSON.stringify({
    "width": 600,
    "height": 400,
    "imgType": "png",
    "pixelRatio": 2,
    "theme": "shine",
    "marker": true,
    "renderer": "canvas",
    "options": "var option = {\n        title: {\n            text: 'ECharts 入门示例'\n        },\n        tooltip: {},\n        legend: {\n            data: ['销量']\n        },\n        xAxis: {\n            data: [\"衬衫\", \"羊毛衫\", \"雪纺衫\", \"裤子\", \"高跟鞋\", \"袜子\"]\n        },\n        yAxis: {},\n        series: [{\n            name: '销量',\n            type: 'bar',\n            data: [5, 20, 36, 10, 10, 20]\n        }]\n    }"
}, undefined, 2);

require.config({
    paths: { 'vs': '/monaco-editor/min/vs', },
    'vs/nls': {
        availableLanguages: {
            "*": "zh-cn"
        }
    }
});

require(['vs/editor/editor.main', '/js-beautify/js/index.js'], function (monacoEditor, jsBeautify) {
    // 定义编辑器主题
    monaco.editor.defineTheme('myTheme', {
        base: 'vs',
        inherit: true,
        rules: [{ background: 'EDF9FA' }],
    });
    monaco.editor.setTheme('myTheme');

    initLanguage(Hints, 'javascript')

    jsFormat();
    // 新建一个编辑器
    function createEditor(container_id, code, language) {
        var model = monaco.editor.createModel(code, language);
        var editor = monaco.editor.create(document.getElementById(container_id), {
            model: model,
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

    function LoadToken(Hints, languages) {
        monaco.languages.setMonarchTokensProvider(languages, {
            keywords: Hints,
            tokenizer: {
                root: [
                    // identifiers and keywords
                    [/[a-z_$][\w$]*/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@default': 'identifier'
                        }
                    }],
                ]

            }
        })
    }

    function initLanguage(Hints, languages) {
        let createCompleters = (textUntilPosition, value) => {
            //过滤特殊字符
            let _textUntilPosition = textUntilPosition
                .replace(/[\*\[\]@\$\(\)]/g, "")
                .replace(/[\s+\.,]/g, " ");
            //切割成数组
            let arr = _textUntilPosition.split(" ");
            //取当前输入值
            let activeStr = arr[arr.length - 1];
            //获得输入值的长度
            let len = activeStr.length;

            //获得编辑区域内已经存在的内容
            let rexp = new RegExp("([^\\w]|^)" + activeStr + "\\w*", "gim");
            let match = value.match(rexp);
            let _hints = !match
                ? []
                : match.map(ele => {
                    let rexp = new RegExp(activeStr, "gim");
                    let search = ele.search(rexp);
                    return ele.substr(search);
                });

            //查找匹配当前输入值的元素
            let hints = Array.from(new Set([...Hints, ..._hints]))
                .sort()
                .filter(ele => {
                    let rexp = new RegExp(ele.substr(0, len), "gim");
                    return (match && match.length === 1 && ele === activeStr) ||
                        ele.length === 1
                        ? false
                        : activeStr.match(rexp);
                });

            //添加内容提示
            let res = hints.map(ele => {
                return {
                    label: ele,
                    kind:
                        hints.indexOf(ele) > -1
                            ? monaco.languages.CompletionItemKind.Keyword
                            : monaco.languages.CompletionItemKind.Text,
                    documentation: ele,
                    insertText: ele
                };
            });
            return res;
        };
        monaco.languages.register({ id: languages });
        LoadToken(Hints, languages);
        monaco.languages.registerCompletionItemProvider(languages, {
            provideCompletionItems(model, position) {
                var textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });
                var value = model.getValue();
                var suggestions = createCompleters(textUntilPosition, value);
                return {
                    suggestions: suggestions
                };
            }
        });
    }

    function jsFormat() {
        const jsFormatProvider = {
            provideDocumentFormattingEdits(model, options, token) {
                return [{
                    text: jsBeautify.js_beautify(model.getValue(), { indent_size: 2 }), // put formatted text here
                    range: model.getFullModelRange()
                }];
            }
        };
        monaco.languages.registerDocumentFormattingEditProvider('javascript', jsFormatProvider);
    }

    jsEditor = createEditor("js_monaco_container", defaultJsCode, 'javascript');

    jsonParamsEditor = createEditor("json_params_monaco_container", defaultJsonCode, 'json');
    jsonResultEditor = createEditor("json_result_monaco_container", "", 'json');
});

const Editor = {
    getJSCode: () => {
        return jsEditor.getModel().getValue();
    },
    setJSCode: (value) => {
        jsEditor.getModel().setValue(value);
    },
    getResultJSONCode: () => {
        return jsonResultEditor.getModel().getValue();
    },
    setResultJSONCode: (value) => {
        jsonResultEditor.getModel().setValue(value);
    },
    getParamsJSONCode: () => {
        return jsonParamsEditor.getModel().getValue();
    },
    setParamsJSONCode: (value) => {
        jsonParamsEditor.getModel().setValue(value);
    }
}
