import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import reactRenderer from 'remark-react';
import $ from "jquery";
import { Pagination } from 'antd';
import './main.scss';
import BASE_PATH from '../../config/'
import Header from '../../components/Header/Container'
import Sider from '../../components/Sider/'
import Footer from '../../components/Footer/'

export default class ArticleList extends React.Component{
	constructor(props) {
		super(props);
		this.handleNav=this.handleNav.bind(this);
		this.state={
			current: 1,
			total: 0,
			articleList: []
		}
	}

	static contextTypes={
		router: PropTypes.object.isRequired
	}

	handleNav(id) {
		// 文章上的key获取不到
      	this.context.router.history.push("/article?id="+id);
	}

	handleChange(page) {
		this.setState({
			current: page
		})
		// console.log(page);
		// return;
		$.ajax({type:"GET", url:BASE_PATH+"/articlelist/"+page,
			success:(data)=>{
				// console.log(data)
				this.setState({
					articleList: data.current
				})
			},
			error:(xhr)=>{
				alert("获取文章列表失败："+xhr.status);
			}
		})
	}

	componentDidMount() {
		const {current}=this.state;
		// return;
		$.ajax({type:"GET", url:BASE_PATH+"/articlelist/"+current,
			success:(d)=>{
				// console.log(d.total);
				this.setState({
					total: d.total,
					articleList: d.current
				})
			},
			error:(xhr)=>{
				alert("获取初始文章列表失败："+xhr.status);
			}
		})
	}

	render() {
		const {total, articleList}=this.state;
		return (
			<div>
				<Header />
				<main id="mainlist" className="left borderbox layoutwidth">
					{
						articleList.length?
						articleList.map((item, index)=>{
							return (
								<section className="list" key={item.article_id}> 
					                <h3 className="title">
					                	<a href="javascript:;" onClick={(id)=>this.handleNav(item.article_id)}>
					                		{decodeURIComponent(item.title)}
					                	</a>
					                </h3>
					                <div className="content">
					                	{remark().use(reactRenderer).processSync( decodeURIComponent(item.content).substring(0,100)+"......").contents}
					                </div>
					                <p className="infos">
					                  	<span className="readall">
					                  		<a href="javascript:;" onClick={(id)=>this.handleNav(item.article_id)}>
					                  			阅读全文>>
					                  		</a>
					                  	</span>
					                  	<em className="inf right">
					                    	<span className="admin">跨越南墙</span> 
					                    	<span className="time">{item.join_time.substring(0,11)}</span>
					                    	<span>浏览量：<span>{item.read_times}</span></span>
					                  	</em>
					                </p>
				                </section>
							) 
						}):<section className="list">正在加载文章列表......</section>
					}
	                <div className="pagnum textcenter">
	                	<Pagination defaultCurrent={1} pageSize={10} total={total}
	                		current={this.state.current}
	                		onChange={this.handleChange.bind(this)}
	                	 />
	                </div>
				</main>
				<Sider />
				<Footer />
			</div>
		)
	}
}

//文章展示列表上，时间是从最新到最老，后台相应每次取10条
//首先要把文章总数量取到，来计算分页上的数目
//注意列表页面刷新之后不要跳到第一页：
//	上线时第一页默认地址：http:localhost:3000
//	以后点击分页器：http:localhost:3000/articlelist?page=2
//	注意：地址栏和ajax的GET请求是无区别的请求。按下地址栏后，返回的是页面而不是数据
//		  只是ajax请求的同时如何变动地址栏地址？

//上线时的猜想：首先点击分页还是发送ajax请求，只是同时设置地址栏为ajax的url；
//				其次点击分页器，跳转到目标的url；
//				再次，后台是res.send还是res.render，或者res.sendFile？