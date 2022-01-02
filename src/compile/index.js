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
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }
}

const hasSymbol = typeof Symbol === "function" && Symbol.for; // 浏览器是否支持 Symbol
// 支持Symbol的话，就创建一个Symbol类型的标识，否则就以二进制 0xeac7代替。
// 为什么是 Symbol？主要防止xss攻击伪造一个fake的react组件。因为json中是不会存在symbol的.
// 为什么是 二进制 0xeac7 ？因为 0xeac7 和单词 React长得很像。
const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 0xeac7;

function ReactElement(type, props) {
  return {
    typeof: REACT_ELEMENT_TYPE,
    type,
    props,
  };
}

export function createElement(type, config, children) {
  const props = {};

  for (let propName in config) {
    // 如果对象本身存在该属性值，就copy
    if (Object.prototype.hasOwnProperty.call(config, propName)) {
      props[propName] = config[propName];
    }
  }

  const childrenLength = arguments.length - 2;

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

export function render(node, mountNode) {
  if (!node) return;
  if (typeof node === "string") {
    return mountNode.append(document.createTextNode(node));
  }
  let type = node.type;
  let props = node.props;
  if (node instanceof Array) {
    return node.forEach((child) => {
      return render(child, mountNode);
    });
  }
  while (typeof type === "function") {
    let element = type(props);
    props = element.props;
    type = element.type;
  }
  if (type && type.isReactComponent) {
    let element = new type(props).render();
    props = element.props;
    type = element.type;
  }
  let domElement = document.createElement(type);
  for (let propName in props) {
    if (propName === "children") {
      let children = props[propName];
      children = Array.isArray(children) ? children : [children];
      children.forEach((child) => render(child, domElement));
    } else if (propName === "style") {
      let styleObj = props[propName];
      if (typeof styleObj === "string") {
        domElement.style = styleObj;
      } else {
        for (let attr in styleObj) {
          domElement.style[attr] = styleObj[attr];
        }
      }
    } else if (propName === "class" || propName === "className") {
      domElement.setAttribute("class", props[propName]);
    } else if (/^on/.test(propName)) {
      const event = propName.replace(/on/, "").toLocaleLowerCase();
      domElement.addEventListener(event, props[propName], false);
    } else if (propName.toLowerCase() == "innerhtml") {
      domElement.innerHTML = props[propName].toString();
    } else if (propName === "dangerouslySetInnerHTML") {
      if (props[propName] && props[propName].__html) {
        domElement.innerHTML = props[propName].__html.toString();
      }
    } else if (propName === "ref") {
      const refReal = props[propName];
      if (!refReal instanceof Ref) throw new Error("ref必须为Ref实例");
      refReal.set("current", domElement);
    } else if (propName === "key") {
      // key相关处理
      // TODO
    } else {
      domElement.setAttribute(propName, props[propName]);
    }
  }
  mountNode.appendChild(domElement);
}

export function useEffect(callback, dependencies = []) {
  // useEffect待实现
  if (typeof callback !== "function") throw new Error("useEffect类型错误");
  if (!(dependencies instanceof Array)) throw new Error("依赖项必须为数组");
  if (dependencies.length === 0) {
    setTimeout(callback, 0);
  } else {
    // 有依赖项处理
  }
}

class Ref {
  constructor(value) {
    this.current = value;
  }
  //this should be triggered when form.something
  get(property) {
    return this[property];
  }

  //this should be triggered when from.something = 'something'
  set(property, value) {
    return (this[property] = value);
  }
}

export function createRef(value = null) {
  const ref = new Ref(value);
  return ref;
}

export default {
  createElement,
  useEffect,
  Component,
  createRef,
  render,
};
