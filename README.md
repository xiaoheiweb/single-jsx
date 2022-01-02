<!--
 * @Author: haorongzheng
 * @Date: 2022-01-02 15:01:49
 * @LastEditTime: 2022-01-02 15:29:48
 * @LastEditors: haorongzheng
 * @Description: 
 * @FilePath: /single-jsx/README.md
 * 保佑代码永无bug
-->
> 背景：有一些第三方广告/插件类项目需要产物小，无依赖的特点，故不能引入各种框架，但又想拥有他们的开发优势，故有脱离react使用jsx语法的需求
## 在脱离react的基础上单独使用jsx语法

核心：将jsx语法转换成抽象语法树，自定义语法树解析过程，这里用了跟react一样的解析，便于开发
运行： `npm run start`