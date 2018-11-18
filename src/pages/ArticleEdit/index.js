import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import remark from 'remark';
import reactRenderer from 'remark-react';
import BASE_PATH from '../../config/'
import './articleedit.scss';
import Header from '../../components/Header/Container'
import Sider from '../../components/Sider/'
import Footer from '../../components/Footer/'

import { Form, Input, Button, Select, Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

export default class ArticleEdit extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handlePreview=this.handlePreview.bind(this);
        this.handleSave=this.handleSave.bind(this);
        this.handleReset=this.handleReset.bind(this);
        this.state={  
            title: {
                error: "", 
                value: "", 
                valid: true 
                //如果文章点击编辑之后并没有真正编辑就直接提交，
                //设置false就会跳出“请修改相关信息”的弹窗
            },
            content: {
                error: "", 
                value: "", 
                valid: true
            },
            edit: {
                id: 0   //发表状态下为0，编辑状态下，是地址栏传过来的文章id
            },
            visible: false,
            options: [],
            currentOption: []
        }
    }

    static contextTypes={
        router: PropTypes.object.isRequired
    }

    handleChange(field, val) {
        let { title, content, currentOption }=this.state;
        let newObj={ error:"", value: val, valid:true };
        switch(field) {
            case "title": {
                if (!val) {
                    newObj.error="标题不能为空！";
                    newObj.valid=false;
                } else if (val.length<6 || val.length>100) {
                    newObj.error="不少于6或大于100字";
                    newObj.valid=false;
                } 
                this.setState({ title: newObj }, function() {
                    window.localStorage.setItem("blog-title", newObj.value)
                })
                break;
            }
            case "content": {
                if (!val) {
                    newObj.error="正文不能为空！";
                    newObj.valid=false;
                } else if (val && val.length<100) {
                    newObj.error="正文不小于100字";
                    newObj.valid=false;
                }
                this.setState({ content: newObj }, function() {
                    window.localStorage.setItem("blog-content", newObj.value)
                })
                break;
            }
        }
    }

    handleSubmit(e) {
        let {title, content, edit, currentOption}=this.state;
        let url=edit.id==0? "add/0":"edit/0";

        if (!title.valid || !title.value || !content.valid || !content.value) {
            alert("请完善或修改相关信息！");
            return;
        }
        if (currentOption.length===0) {alert("请选择文章分类！"); return;}

        $.ajax({
            type: "POST",
            url: BASE_PATH+"/article/"+url, 
            data: {
                title: encodeURIComponent(title.value),
                content: encodeURIComponent(content.value),
                catagory: currentOption.join(),
                id: edit.id     //0是add，非0是edit
            },
            success: (data)=>{ //data应该是后台返回的文章id
                window.localStorage.removeItem("blog-title");
                window.localStorage.removeItem("blog-content");
                this.context.router.history.push("/article?id="+data.article_id);
            },
            error: (xhr)=> {
                alert("更新文章失败："+xhr.status);
            }
        })
    }

    handleSave() {
        //本地储存同key可以覆盖其值，不用管之前有没有值
        let {title, content}=this.state;
        if (title.value && content.value) {
            window.localStorage.setItem("blog-title", title.value);
            window.localStorage.setItem("blog-content", content.value);
            alert("已保存编辑内容！")
        }
    }
    
    handlePreview() {
        //预览需要弹出一个页面，只包括内容，只看md语法是否正确
        const {title, content}=this.state;
        if ( !title.value && !content.value) {alert("尚未写文！"); return;}
        this.setState({ visible: true })
    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }

    handleReset() {
        if (confirm("你确定要重置当前内容？")) {
            this.setState({
                title: {...this.state.title, value:""},
                content: {...this.state.content, value:""}
            }, function() {
                //即使之前本来为空，移除也不影响
                window.localStorage.removeItem("blog-title");
                window.localStorage.removeItem("blog-content");
            })
        }
    }

    componentDidMount() { 

        //加载文章分类
        $.ajax({type:"GET", url:BASE_PATH+"/admin/catagories/",
            success: (data)=>{
                // console.log(data);
                if ( !data.length ) return;
                let options=data.map((item)=>{
                    return (<Option key={item.catagory}>{item.catagory}</Option>)
                })
                this.setState({ options: options })
            }, 
            error: (xhr)=>{
                alert("加载文章分类名失败："+xhr.status)
            }
        })
        
        //加载文章
        let url=window.location.href;
        if (url.indexOf("edit?id=")>-1) {//判断地址栏是不是从文章页面点击进入进行编辑文章的
            // startIndex=url.lastIndexOf("/");
            // id=url.substring( startIndex+1 );
            let search=this.props.location.search;
            let id=search.split("=")[1];
            if (isNaN(parseInt(id))) return;//转到404页面

            $.ajax({type:"GET", url: BASE_PATH+"/article/get/"+id,
                success: (data)=>{
                    // console.log(data);
                    this.setState({
                        title: {
                            value: decodeURIComponent(data.title),
                            valid: true
                        },
                        content: {
                            value: decodeURIComponent(data.content),
                            valid: true
                        },
                        edit: {
                            id: data.article_id
                        }
                    })
                },
                error: (xhr)=>{
                    alert("获取需编辑的文章失败："+xhr.status);
                }
            })
        } else {
            //检查localStorage里面有没有，如果没有就不管，如果有，就放到对应的state里面
            let title=window.localStorage.getItem("blog-title");
            let content=window.localStorage.getItem("blog-content");
            if (!title && !content) return;

            this.setState({
                title: {...this.state.title, value:title},
                content: {...this.state.content, value:content}
            })
        }

        
    }

    handleSelect(value) {
        this.setState({currentOption: value})   //value是数组，Option中的key
    }

	render() {
        let { title, content }=this.state;
		return (
            <div>
                <Header />
                <div id="edit" className="layoutwidth left">
                    <h3 className="title">写博文</h3>
                    <div className="theme">
                        <p className="t">标题</p>
                        <FormItem>
                            <Input value={title.value} name="username" placeholder="标题6-100字" 
                                onChange={(e)=>this.handleChange( "title", e.target.value)}
                            />
                            {!title.valid && <span className="error">{title.error}</span>}
                        </FormItem>
                    </div>
                    <div className="content">
                        <p className="t">正文</p>
                        <FormItem>
                            <Input type="textarea" value={content.value} name="content" placeholder="在此输入正文" 
                                onChange={(e)=>this.handleChange( "content", e.target.value)}
                            />
                            {!content.valid && <span className="textareaerror">{content.error}</span>}
                        </FormItem>
                    </div>
                    <div className="catagory">
                        <p className="t">分类</p>
                        <Select
                            mode="multiple"
                            size="default"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onChange={this.handleSelect.bind(this)}
                        >
                            {this.state.options}
                        </Select>
                    </div>
                    <div className="confirm">
                        <Button htmlType="button" onClick={this.handleSubmit}>提交</Button>
                        <Button htmlType="button" onClick={this.handlePreview}>预览</Button>
                        <Button htmlType="button" onClick={this.handleSave}>保存</Button>
                        <Button htmlType="button" onClick={this.handleReset}>重置</Button>
                    </div>
                    <Modal title={this.state.title.value || "尚未写题目！"}          
                        visible={this.state.visible}
                        style={{right:"12%"}}
                        onCancel={this.handleCancel.bind(this)}
                        footer={null}
                      >
                        {remark().use(reactRenderer).processSync(this.state.content.value).contents}
                    </Modal>
                </div>
                <Sider />
                <Footer />
            </div>
        )
	}
}



