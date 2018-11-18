import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import '../File/file.scss';

import Header from '../../components/Header/Container'
import Sider from '../../components/Sider/'
import Footer from '../../components/Footer/'

import BASE_PATH from '../../config/'

export default class ArticleCata extends React.Component {
	constructor(props) {
		super(props);
		this.handleNav=this.handleNav.bind(this);
		this.state={
			catagories: [],
			articleList: []
		}
	}

	static contextTypes={
		router: PropTypes.object.isRequired
	}

	handleNav(id) {
		// console.log(id);
		this.context.router.history.push("/article?id="+id);
	}

	componentDidMount() {
		$.ajax({ type:"GET", url:BASE_PATH+"/articlecata/catagories",
			success: (data)=>{
				// console.log(data);
				this.setState({
					catagories: data.catagories,
					articleList: data.articleList
				})
			},
			error: (xhr)=>{
				alert("获取分类信息失败："+xhr.status)
			}
		});

	}

	render() {
		const {catagories, articleList}=this.state;
		return (
			<div>
				<Header />
				<div id="articlecata" className="left layoutwidth">
					<h3 className="title">文章分类</h3>
				  	{
						catagories.length?
						catagories.map((item, index)=>{
							return (
								<div className="item" key={item.id}>
									<p className="time">{item.catagory}</p> {/*和文章归档共用样式*/}
									<ul className="list">
										{
											articleList.length?
											articleList.map((item1, index1)=>{
												if (item1.catagory.indexOf(item.catagory)>-1) {
													return (
														<li className="li" key={item1.article_id}>
															<a className="link" href="javascript:;" 
																onClick={(id)=>this.handleNav(item1.article_id)}
															>
																{item1.title}
															</a>
															<em className="t">
																{item1.join_time.substring(0, 10).replace(/[\u4e00-\u9fa5]/g,"-")}
															</em>
														</li>
													)
												}
											}):""
										}
									</ul>
								</div>
							)
						}):"暂无文章分类！"
					}
				</div>
				<Sider />
				<Footer />
			</div>
		)
	}
}

