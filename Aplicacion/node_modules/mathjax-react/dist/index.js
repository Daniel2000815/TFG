'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var mathjax = require('mathjax-full/js/mathjax');
var tex$1 = require('mathjax-full/js/input/tex');
var mathml$1 = require('mathjax-full/js/input/mathml');
var svg$1 = require('mathjax-full/js/output/svg');
var browserAdaptor = require('mathjax-full/js/adaptors/browserAdaptor');
var html = require('mathjax-full/js/handlers/html');
var MathItem = require('mathjax-full/js/core/MathItem');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

// create and register adaptor bound to the real DOM
var adaptor = browserAdaptor.browserAdaptor();
html.RegisterHTMLHandler(adaptor);
//  Create input and output jax and a document using them on the content from
//  the HTML file (see:
//  https://github.com/mathjax/MathJax-demos-node/blob/master/direct/tex2svg)
var tex = new tex$1.TeX({ packages: ["base", "ams"] });
var mathml = new mathml$1.MathML({});
var svg = new svg$1.SVG({ fontCache: "none" });
var markErrors = [MathItem.STATE.TYPESET + 1, null, onError];
var tex_html = mathjax.mathjax.document("", {
    InputJax: tex,
    OutputJax: svg,
    renderActions: {
        markErrors: markErrors,
    },
});
var mathml_html = mathjax.mathjax.document("", {
    InputJax: mathml,
    OutputJax: svg,
    renderActions: {
        markErrors: markErrors,
    },
});
function onError(math) {
    var root = math.root, typesetRoot = math.typesetRoot;
    if (root.toString().substr(0, 14) === "math([merror([") {
        var merror = root.childNodes[0].childNodes[0];
        var text = merror.attributes.get("data-mjx-error") ||
            merror.childNodes[0].childNodes[0].getText();
        adaptor.setAttribute(typesetRoot, "data-mjx-error", text);
    }
}
function updateCSS(nodeID, text) {
    var styleNode = document.getElementById(nodeID);
    if (styleNode === null) {
        styleNode = document.createElement("style");
        styleNode.setAttribute("id", nodeID);
        document.head.appendChild(styleNode);
    }
    styleNode.innerHTML = text;
}
var CancelationException = /** @class */ (function () {
    function CancelationException() {
    }
    return CancelationException;
}());
function convertPromise(srcSpec, node, display, settings) {
    var src = srcSpec.src, lang = srcSpec.lang;
    if (!node)
        throw new Error();
    var html = tex_html;
    if (lang == "MathML")
        html = mathml_html;
    var math = src.trim();
    // const metrics = svg.getMetricsFor(node, display);
    var canceled = false;
    var cancel = function () { return (canceled = true); };
    var res = mathjax.mathjax
        .handleRetriesFor(function () {
        if (canceled) {
            throw new CancelationException();
        }
        var dom = html.convert(math, __assign({ display: display }, settings));
        return dom;
    })
        .then(function (dom) {
        // do stuff with dom
        html.updateDocument();
        updateCSS("MATHJAX-SVG-STYLESHEET", svg.cssStyles.cssText);
        var err = adaptor.getAttribute(dom, "data-mjx-error");
        if (err) {
            throw err;
        }
        return adaptor.outerHTML(dom);
    })
        .catch(function (err) {
        if (!(err instanceof CancelationException)) {
            throw err;
        }
        else {
            console.log("cancelled render!");
        }
    });
    return { promise: res.then(function (v) { return (v ? v : ""); }), cancel: cancel };
}

/**
 * A low-level hook to use MathJax in your application.
 *
 * Before reading further, make sure `MathComponent` doesn't cover your use case.
 *
 * To use, provide inputs to this hook (eg. source, source language,
 * display/inline), then spread `getProps()` onto the child you would like to
 * render the math in.
 */
function useMathJax(_a) {
    var src = _a.src, lang = _a.lang, display = _a.display, settings = _a.settings;
    var _b = React.useState(null), renderedHTML = _b[0], setRenderedHTML = _b[1];
    var _c = React.useState(null), node = _c[0], setNode = _c[1];
    var _d = React.useState(null), error = _d[0], setError = _d[1];
    React.useEffect(function () {
        if (!node)
            return function () { };
        var _a = convertPromise({ src: src, lang: lang }, node, display, settings), promise = _a.promise, cancel = _a.cancel;
        promise.then(setRenderedHTML, setError);
        return function () {
            setError(null);
            cancel();
        };
    }, [node, src, lang, display, settings]);
    return {
        renderedHTML: renderedHTML,
        error: error,
        getProps: function () { return ({
            ref: setNode,
            dangerouslySetInnerHTML: renderedHTML !== null ? { __html: renderedHTML } : undefined,
        }); },
    };
}

function parseSource(props) {
    if (props.mathml !== undefined)
        return {
            lang: "MathML",
            src: props.mathml,
        };
    else
        return {
            lang: "TeX",
            src: props.tex,
        };
}
function MathComponent(props) {
    var _a = props.display, display = _a === void 0 ? true : _a, settings = props.settings;
    var getProps = useMathJax(__assign({ display: display,
        settings: settings }, parseSource(props))).getProps;
    return display ? React__namespace.createElement("div", __assign({}, getProps())) : React__namespace.createElement("span", __assign({}, getProps()));
}

exports.MathComponent = MathComponent;
exports.useMathJax = useMathJax;
//# sourceMappingURL=index.js.map
