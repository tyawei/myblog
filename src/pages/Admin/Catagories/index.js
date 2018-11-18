import React from 'react';
import $ from 'jquery';
import {Icon, Button, Input} from 'antd';
import '../admin.scss';
import BASE_PATH from '../../../config/'

export default class Catagories extends React.Component {
	constructor(props) {
		super(props);
		this.handleEdit=this.handleEdit.bind(this);
		this.handleSubmit=this.handleSubmit.bind(this);
		this.state={
			display: false,
			displayEdit: false,
			catagories: [],
			value: "",
			id: 0	//默认为添加状态
		}
	}

	handleEdit(id, text) {
		//点击编辑首先要获取原有的分类名
		this.setState({ id:id, value:text, displayEdit:true })
	}

	handleSubmit() {
		$.ajax({
			type: "POST",
			url: BASE_PATH + "/admin/catagories",
			data: {
				id: this.state.id,	//为0表示添加
				value: this.state.value
			},
			success: (data)=>{
				// console.log(data);
				this.setState({
					catagories: data,
					value: ""
				})
			}, 
			error: (xhr)=>{
				alert("更新分类信息失败："+xhr.status)
			}
		})
	}

	handleDisplay() {
		if (!this.state.display) {
			$(".displayCata").stop().slideDown(300, ()=>{//获取文章类名表信息
				if (this.state.catagories.length) return;
				$.ajax({type:"GET", url:BASE_PATH + "/admin/catagories/", 
					success:(data)=>{
						// console.log(data);
						this.setState({
							catagories: data
						})
					}, 
					error:(xhr)=>{
						alert("获取文章分类信息失败："+xhr.status);
					}
				})
			});
		} else {
			$(".displayCata").stop().slideUp(300);
		}
		this.setState({ display: !this.state.display })
				
	}

	render() {
		const {catagories}=this.state;
		return (
			<div id="catagories">
				<p className="admintitle" onClick={this.handleDisplay.bind(this)}>管理文章类别信息
					{!this.state.display? <Icon type="down" />:<Icon type="up" />}
				</p>
				<div className="displayCata" style={{display: "none"}}>
					<div className="btnbox">
					{
						catagories.length?
						catagories.map((item, index)=>{
							return (
								<Button htmlType="button" key={item.id}>{item.catagory}
									<Icon type="edit" title="点击编辑" 
										onClick={(id, text)=>this.handleEdit(item.id, item.catagory)} 
									/>
								</Button>
							)
						}):"正在加载分类名......"
					}
					{
						this.state.displayEdit?
						<Button htmlType="button"  title="返回添加" className="giveup"
							onClick={function(){this.setState({id:0,value:"",displayEdit:false})}.bind(this)}
						>
							放弃编辑
						</Button>:null
					}
					</div>
					<div className="edit">
						<Input placeholder="添加分类名" value={this.state.value} 
							onChange={function(e){this.setState({value:e.target.value})}.bind(this)} 
						/>
						<Button htmlType="button" onClick={this.handleSubmit}>确定</Button>
					</div>
				</div>
			</div>
		)
	}
}
