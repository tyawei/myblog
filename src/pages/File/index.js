import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import './file.scss';
import BASE_PATH from '../../config/'
import Header from '../../components/Header/Container'
import Sider from '../../components/Sider/'
import Footer from '../../components/Footer/'

export default class File extends React.Component {
	constructor(props) {
		super(props);
		this.handleNav=this.handleNav.bind(this);
		this.state={
			timeArr: [],
			fileList: []
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
		$.ajax({ type:"GET", url:BASE_PATH+"/file/get",
			success: (data)=>{
				// console.log(data.timeArr);
				if (!data) return;
				this.setState({
					timeArr: data.timeArr,
					fileList: data.fileList
				})
			},
			error: (xhr)=>{
				alert("获取归档信息失败："+xhr.status)
			}
		})
	}
	//归档需要：文章id、文章名、发表时间
	//归档后台如何操作：
	//后台把所有的文章数据SELECT到，然后再把rows的所有xxx年xx月(length7)时间去重,
	//然后将时间数组和rows都返回，前后首先循环时间数组，在内部再循环rows，{`/article/${item1.article_id}`}
	//通过比较时间每一项和rows的时间字段的前7个字符相同，再在相应的年月下循环生成

	render() {
		const {timeArr, fileList}=this.state;
		return (
			<div>
				<Header />
				<div id="file" className="left layoutwidth">
					<h3 className="title">文章归档</h3>
					{
						timeArr.length?
						timeArr.map((item, index)=>{
							return (
								<div className="item" key={item}>
									<p className="time">{item}</p>
									<ul className="list">
										{
											fileList.length?
											fileList.map((item1, index1)=>{
												if (item1.join_time.substring(0,8)===item) {
													return (
														<li className="li" key={item1.article_id}>
															<a className="link" href="javascript:;" 
																onClick={(id)=>this.handleNav(item1.article_id)}
															>
																{decodeURIComponent(item1.title)}
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
						}):""
					}
				</div>
				<Sider />
				<Footer />
			</div>
		)
	}
}