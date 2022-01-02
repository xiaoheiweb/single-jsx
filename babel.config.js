/*
 * @Author: haorongzheng
 * @Date: 2022-01-02 15:13:16
 * @LastEditTime: 2022-01-02 15:14:04
 * @LastEditors: haorongzheng
 * @Description: 
 * @FilePath: /single-jsx/babel.config.js
 * 保佑代码永无bug
 */
const presets = [
  [
    "@babel/preset-env",
    {
      targets: [
        "last 7 versions",
        "ie >= 8",
        "ios >= 8",
        "android >= 4.0",
      ].join(","),
      useBuiltIns: false,
      corejs: { version: 3, proposals: true },
      modules: false, // 交给rollup处理模块化 https://babeljs.io/docs/en/babel-preset-env#
      loose: true, // 非严格es6
      debug: false,
    },
  ],
];

const plugins = [
  "@babel/plugin-transform-react-jsx",
  "@babel/plugin-transform-runtime",
];

module.exports = { presets, plugins };
