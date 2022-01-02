/*
 * @Author: haorongzheng
 * @Date: 2021-10-28 14:22:18
 * @LastEditTime: 2022-01-02 15:25:50
 * @LastEditors: haorongzheng
 * @Description: 编译
 * @FilePath: /single-jsx/rollup.config.js
 * 保佑代码永无bug
 */
import commonjs from "@rollup/plugin-commonjs"; // 让 Rollup 识别 commonjs 类型的包，默认只支持导入ES6
import resolve from "@rollup/plugin-node-resolve";

import babel from "rollup-plugin-babel"; // babel
import path from "path"; // 让 Rollup 能识别 node_modules 中的包，引入第三方库，默认识别不了的
import serve from "rollup-plugin-serve";

const resolveFile = function (filePath) {
  return path.join(__dirname, "./", filePath);
};

module.exports = {
  input: resolveFile("src/index.js"),
  output: [
    {
      file: './lib/index.js',
      format: "iife",
      name: "test",
      sourcemap: true,
      esModule: false,
    },
  ],
  plugins: [
    resolve(), //  这样 Rollup 能找到 `ms`
    commonjs({
      // 这样 Rollup 能转换 `ms` 为一个ES模块
      include: "node_modules/**",
    }),
    babel({
      // babelHelpers: 'runtime',
      runtimeHelpers: true, // 使plugin-transform-runtime生效
      exclude: /node_modules/,
      sourceMaps: true,
      rootMode: "upward",
    }), //  upward的作用就是告诉babel从当前的工作目录，向父级文件夹向上查找babel.config.js，如果从上层文件夹找到了babel.config.js，就启用该配置文件，同时把它所在目录作为当前运行的root目录。也就是说有了rootMode： upward，就等同于在repo目录运行babel。
    serve({
      port: 3000,
      open: true,
      contentBase: [resolveFile("example"), resolveFile("lib")],
    }),
  ],
};
