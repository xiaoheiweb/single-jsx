/*
 * @Author: haorongzheng
 * @Date: 2022-01-02 15:15:24
 * @LastEditTime: 2022-01-02 15:29:21
 * @LastEditors: haorongzheng
 * @Description: 测试
 * @FilePath: /single-jsx/src/index.js
 * 保佑代码永无bug
 */
import React,{render,createRef,useEffect} from './compile';
const Ref = () => {  // ref
    const ref = createRef();
    useEffect(()=> {
        console.log(ref.current);
    },[])
    return <div ref={ref}></div>
};
const Style = (props) => { // style解析
    const {children} = props;
    return <div style={{height: '100px'}}>{children}</div>
}
const Test = () => { // jsx解析
    return <div>测试</div>
}
const Dom =() => {
    return <div><Test />12312<Ref /><Style>内容</Style></div>
}

const Index = () => {
    render(<Dom />,document.body)
}

export default Index
