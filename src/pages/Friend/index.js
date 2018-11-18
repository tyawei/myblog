import React from 'react';
import $ from 'jquery';
import {Form, Input, Button} from 'antd';
const FormItem = Form.Item;
import './friend.scss';
import BASE_PATH from '../../config/'
import Header from '../../components/Header/Container'
import Sider from '../../components/Sider/'
import Footer from '../../components/Footer/'

export default class Friend extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick=this.handleClick.bind(this);
		this.handleChange=this.handleChange.bind(this);
		this.handleSubmit=this.handleSubmit.bind(this);
		this.handleGiveup=this.handleGiveup.bind(this);
		this.state={
			links: [],
			name: {
				value:"",
				error:"", 
				valid:false
			},
			link: {
				value:"",
				error:"", 
				valid:false
			},
			content: {
				value:"",
				error:"", 
				valid:false
			}
		}
	}

	handleClick(e) {
		let value=e.target.innerHTML;
		$(".list").removeClass("none");
		$(".apply").removeClass("none");
		if (value==="友情链接") {
			$(".apply").addClass("none")
		} else if (value==="申请友链") {
			$(".list").addClass("none")
		}
	}

	handleChange(e, field) {
		let val=e.target.value;
		let newState={error: "", value: val, valid: true};
		let xssReg=/[<>\"\']+/g;
		switch(field) {
			case "name": {
				if (!$.trim(val).length) {
					newState.error="输入不能为空";
					newState.valid=false;
				} else if ($.trim(val).length>20) {
					newState.error="称呼不得超过20位";
					newState.valid=false;
				} else if ( xssReg.test(val) ) {
					newState.error="称呼不得包含尖括号和英文引号";
					newState.valid=false;
				}
				this.setState({
					name: newState
				})
				break;
			}
			case "link": {
				if (!$.trim(val).length) {
					newState.error="输入不能为空";
					newState.valid=false;
				} else if (xssReg.test($.trim(val))) {
					newState.error="链接不得包含尖括号和英文引号";
					newState.valid=false;
				} 
				this.setState({
					link: newState
				})
				break;
			}
			case "content": {
				if (!$.trim(val).length) {
					newState.error="输入不能为空";
					newState.valid=false;
				} else if ($.trim(val) && $.trim(val).length>300) {
					newState.error="输入不能超过300字";
					newState.valid=false;
				} else if (xssReg.test($.trim(val))) {
					newState.error="理由不得包含尖括号和英文引号";
					newState.valid=false;
				} 
				this.setState({
					content: newState
				})
				break;
			}
		}
	}

	handleSubmit() {
		const {name, link, content}=this.state;
		if (!name.valid || !link.valid || !content.valid) {
			alert("请修改相关信息！"); return;
		} 
		$.ajax({
			type: "POST", 
			url: BASE_PATH+"/friend/apply/",
			data: {
				name: $.trim(name.value),
				link: $.trim(link.value),
				content: $.trim(content.value)
			},
			success: (data)=>{
				// console.log(data);
				this.setState({
					name: {
						value:"",
						error:"", 
						valid:false
					},
					link: {
						value:"",
						error:"", 
						valid:false
					},
					content: {
						value:"",
						error:"", 
						valid:false
					}
				})
				alert("申请成功，等待管理员审核！");	//又要在用户页面传递消息？
			},
			error: (xhr)=>{
				alert("申请失败："+xhr.status);
			}
		})
	}

	handleGiveup() {
		if (confirm("输入将重置，你确定要放弃？")) {
			this.setState({
				name: {value:"", error:"", valid:false},
				link: {value:"", error:"", valid:false},
				content: {value:"", error:"", valid:false}
			})
		}
	}

	componentDidMount() {
		$.ajax({ type:"GET", url:BASE_PATH+"/friend/get",
			success: (data)=>{
				// console.log(data);
				if (!data.length) return;
				this.setState({
					links: data
				})
			},
			error: (xhr)=>{
				alert("获取友链列表失败："+xhr.status);
			}
		 })
	}

	render() {
		const {links, name, link, content}=this.state; //links是数据库中已经审核通过的友情链接
		return (
			<div>
				<Header />
				<div id="friend" className="left layoutwidth">
					<h3 className="title">
						<a href="javascript:;" onClick={this.handleClick}>
							友情链接
						</a>&nbsp;|&nbsp;
						<a href="javascript:;" onClick={this.handleClick}>
							申请友链
						</a>
					</h3>
					<ul className="list">
					{
						links.length?
						links.map((item, index)=>{
							return (
								<li className="li" key={item.id}>
									<a href={item.url}>
										{item.name+"的站点"}
									</a>
								</li>
							)
						}):"尚无审核通过的友链！"
					}
						
					</ul>
					<div className="apply none">
						<p>友情提示：申请友链请先联系博主^_^。</p>
						<FormItem label="你的称呼：">
		                    <Input value={name.value} placeholder="your name" 
		                        onChange={(e)=>this.handleChange(e, "name")}
		                    />
		                    {!name.valid && <span className="errormsg">{name.error}</span>}
		                </FormItem>
						<FormItem label="你的链接：">
		                    <Input value={link.value} placeholder="your link" 
		                        onChange={(e)=>this.handleChange(e, "link")}
		                    />
		                    {!link.valid && <span className="errormsg">{link.error}</span>}
		                </FormItem>
		                <FormItem label="申请理由：">
	                        <Input type="textarea" value={content.value} placeholder="在此输入正文" 
	                            onChange={(e)=>this.handleChange(e, "content")}
	                        />
	                        {!content.valid && <span className="errormsg textareaerror">{content.error}</span>}
	                    </FormItem>
	                    <Button htmlType="button" onClick={this.handleSubmit}>提交</Button>
	                    <Button htmlType="button" onClick={this.handleGiveup}>放弃</Button>
					</div>
				</div>	
				<Sider />
				<Footer />
			</div>
		)
	}
}