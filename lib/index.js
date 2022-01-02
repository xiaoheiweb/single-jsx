var test = (function () {
  'use strict';

  /*
   * @Author: haorongzheng
   * @Date: 2020-11-25 17:18:41
   * @LastEditTime: 2022-01-02 15:17:35
   * @LastEditors: haorongzheng
   * @Description: 自定义解析操作
   * @FilePath: /single-jsx/src/compile/index.js
   * @保佑代码永无bug
   */
  // 把创建的对象转为真实DOM元素最后插入到页面中
  var Component = function Component(props) {
    this.props = props;
  };

  Component.isReactComponent = true;
  var hasSymbol = typeof Symbol === "function" && Symbol["for"]; // 浏览器是否支持 Symbol
  // 支持Symbol的话，就创建一个Symbol类型的标识，否则就以二进制 0xeac7代替。
  // 为什么是 Symbol？主要防止xss攻击伪造一个fake的react组件。因为json中是不会存在symbol的.
  // 为什么是 二进制 0xeac7 ？因为 0xeac7 和单词 React长得很像。

  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;

  function ReactElement(type, props) {
    return {
      "typeof": REACT_ELEMENT_TYPE,
      type: type,
      props: props
    };
  }

  function createElement(type, config, children) {
    var props = {};

    for (var propName in config) {
      // 如果对象本身存在该属性值，就copy
      if (Object.prototype.hasOwnProperty.call(config, propName)) {
        props[propName] = config[propName];
      }
    }

    var childrenLength = arguments.length - 2;

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      // 1. React 官方实现，声明一个和childrenLength一样长的数组
      // 然后遍历 arguments对象，把第二个之后的参数项给 childrenArray
      // let childrenArray = Array(childrenLength);
      // for (let i = 0; i < arguments.length; i++) {
      //     childrenArray[i] = arguments[i + 2]
      // }
      // props.children = childrenArray;
      // 2. 数组slice截取，截取第二个之后所有的参数项给props.children
      props.children = Array.prototype.slice.call(arguments, 2);
    }

    return ReactElement(type, props);
  }
  function render(node, mountNode) {
    if (!node) return;

    if (typeof node === "string") {
      return mountNode.append(document.createTextNode(node));
    }

    var type = node.type;
    var props = node.props;

    if (node instanceof Array) {
      return node.forEach(function (child) {
        return render(child, mountNode);
      });
    }

    while (typeof type === "function") {
      var element = type(props);
      props = element.props;
      type = element.type;
    }

    if (type && type.isReactComponent) {
      var _element = new type(props).render();

      props = _element.props;
      type = _element.type;
    }

    var domElement = document.createElement(type);

    for (var propName in props) {
      if (propName === "children") {
        var children = props[propName];
        children = Array.isArray(children) ? children : [children];
        children.forEach(function (child) {
          return render(child, domElement);
        });
      } else if (propName === "style") {
        var styleObj = props[propName];

        if (typeof styleObj === "string") {
          domElement.style = styleObj;
        } else {
          for (var attr in styleObj) {
            domElement.style[attr] = styleObj[attr];
          }
        }
      } else if (propName === "class" || propName === "className") {
        domElement.setAttribute("class", props[propName]);
      } else if (/^on/.test(propName)) {
        var event = propName.replace(/on/, "").toLocaleLowerCase();
        domElement.addEventListener(event, props[propName], false);
      } else if (propName.toLowerCase() == "innerhtml") {
        domElement.innerHTML = props[propName].toString();
      } else if (propName === "dangerouslySetInnerHTML") {
        if (props[propName] && props[propName].__html) {
          domElement.innerHTML = props[propName].__html.toString();
        }
      } else if (propName === "ref") {
        var refReal = props[propName];
        if (!refReal instanceof Ref$1) throw new Error("ref必须为Ref实例");
        refReal.set("current", domElement);
      } else if (propName === "key") ; else {
        domElement.setAttribute(propName, props[propName]);
      }
    }

    mountNode.appendChild(domElement);
  }
  function useEffect(callback, dependencies) {
    if (dependencies === void 0) {
      dependencies = [];
    }

    // useEffect待实现
    if (typeof callback !== "function") throw new Error("useEffect类型错误");
    if (!(dependencies instanceof Array)) throw new Error("依赖项必须为数组");

    if (dependencies.length === 0) {
      setTimeout(callback, 0);
    }
  }

  var Ref$1 = /*#__PURE__*/function () {
    function Ref(value) {
      this.current = value;
    } //this should be triggered when form.something


    var _proto = Ref.prototype;

    _proto.get = function get(property) {
      return this[property];
    } //this should be triggered when from.something = 'something'
    ;

    _proto.set = function set(property, value) {
      return this[property] = value;
    };

    return Ref;
  }();

  function createRef(value) {
    if (value === void 0) {
      value = null;
    }

    var ref = new Ref$1(value);
    return ref;
  }
  var React = {
    createElement: createElement,
    useEffect: useEffect,
    Component: Component,
    createRef: createRef,
    render: render
  };

  /*
   * @Author: haorongzheng
   * @Date: 2022-01-02 15:15:24
   * @LastEditTime: 2022-01-02 15:29:21
   * @LastEditors: haorongzheng
   * @Description: 测试
   * @FilePath: /single-jsx/src/index.js
   * 保佑代码永无bug
   */

  var Ref = function Ref() {
    // ref
    var ref = createRef();
    useEffect(function () {
      console.log(ref.current);
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      ref: ref
    });
  };

  var Style = function Style(props) {
    // style解析
    var children = props.children;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100px'
      }
    }, children);
  };

  var Test = function Test() {
    // jsx解析
    return /*#__PURE__*/React.createElement("div", null, "\u6D4B\u8BD5");
  };

  var Dom = function Dom() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Test, null), "12312", /*#__PURE__*/React.createElement(Ref, null), /*#__PURE__*/React.createElement(Style, null, "\u5185\u5BB9"));
  };

  var Index = function Index() {
    render( /*#__PURE__*/React.createElement(Dom, null), document.body);
  };

  return Index;

})();
//# sourceMappingURL=index.js.map
