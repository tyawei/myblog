import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import $ from 'jquery';
import './sider.scss';
import headUrl from '../../static/images/bloger.jpg'
import {Button} from 'antd';
import BASE_PATH from '../../config/'

class Sider extends React.Component {
	constructor(props) {
		super(props);
		this.handleNav=this.handleNav.bind(this);
		this.state={
			zanMaxList: [],
			readMaxList: []
		}
	}

	static contextTypes={
		router: PropTypes.object.isRequired
	}

	handleNav(id) {
		this.context.router.history.push("/article?id="+id);
	}

	componentDidMount() {
		const {zanMaxList, readMaxList}=this.state;

		if (!zanMaxList.length) {
			$.ajax({type: "GET", url: BASE_PATH + "/sider/zanmaxlist/",
				success: (data)=>{
					// console.log(data);
					this.setState({
						zanMaxList: data
					})
				}, error: (xhr)=>{
					alert("获取点赞排行失败："+xhr.status)
				}
			})
		}
		
		if (!readMaxList.length) {
			$.ajax({type: "GET", url: BASE_PATH + "/sider/readmaxlist/",
				success: (data)=>{
					// console.log(data);
					this.setState({
						readMaxList: data
					})
				}, error: (xhr)=>{
					alert("获取阅读量排行失败："+xhr.status)
				}
			})
		}
			
	}
	
	render() {
		const {zanMaxList, readMaxList}=this.state; 
		let userName=this.props.userName || window.sessionStorage.getItem("userName");
		let userType=this.props.userType || window.sessionStorage.getItem("userType");
		return (
			<aside id="sider" className="right">
				<div className="headimg borderbox">
					<div className="myimg"><img src={headUrl} className="img" /></div>
					{
						(userName==="admin" && userType==="admin") && 
						<p className="textcenter btn">
							<Button htmlType="button"><Link to="/admin">点击进入管理页面</Link></Button>
						</p>
					}
					<h3 className="bloger">博主简介</h3>
					<p className="myname">
						<span>Name：&nbsp;</span>
						<span>跨越南墙</span>
					</p>
					<p className="myinfo">
						<span>Info：&nbsp;</span>
						<span>一个浪迹社会工作、金融学、经济学、前端开发的文科码农</span>
					</p>
					<p className="Email">
						<span>Email：&nbsp;</span>
						<span>307308901@qq.com</span>
					</p>
				</div>
				<div className="zanmax">
					<h3 className="title textcenter">点赞量排行</h3>
					<ul>
					{
						zanMaxList.length?
						zanMaxList.map((item, index)=>{
							return (
								<li key={item.article_id} 
									onClick={(id)=>this.handleNav(item.article_id)}
								>
									<a href="javascript:;">
										<span>{index+1}.</span>
										<span>{decodeURIComponent(item.title)}</span>
										<span className="right">{item.good_times}</span>
									</a>
								</li>
							) 
						}):"尚无文章！"
					}
					</ul>
				</div>
				<div className="readmax">
					<h3 className="title textcenter">阅读量排行</h3>
					<ul>
					{
						readMaxList.length?
						readMaxList.map((item, index)=>{
							return (
								<li key={item.article_id} 
									onClick={(id)=>this.handleNav(item.article_id)}
								>
									<a href="javascript:;">
										<span>{index+1}.</span>
										<span>{decodeURIComponent(item.title)}</span>
										<span className="right">{item.read_times}</span>
									</a>
								</li>
							)
						}):"尚无文章！"
					}
					</ul>
				</div>
			</aside>
		)
	}
}

function mapStateToProps(state) {
	return {
		userName: state.LoginRegistReducer.userName,
		userType: state.LoginRegistReducer.userType
	}
}

export default connect(mapStateToProps)(Sider);