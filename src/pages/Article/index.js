import React from 'react';
import {connect} from 'react-redux';
import $ from "jquery";
import PropTypes from 'prop-types';
import remark from 'remark';
import reactRenderer from 'remark-react';
import './article.scss';
import Comment from '../Comment/Container';
import BASE_PATH from '../../config/'
import Header from '../../components/Header/Container'
import Sider from '../../components/Sider/'
import Footer from '../../components/Footer/'


export default class Article extends React.Component {
  	constructor(props) {
  		super(props);
  		this.handleEvaluate=this.handleEvaluate.bind(this);
      this.handleEdit=this.handleEdit.bind(this);
      this.handleDel=this.handleDel.bind(this);
  		this.state={
        isAdmin:false,
        user: {
          userName: window.sessionStorage.getItem("userName"),
          userType: window.sessionStorage.getItem("userType")
        },
  			article: {
          id: 0,
          title: "",
          content: "",
          catagory: "",
          joinTime: "",
          readTimes: "0",
          goodTimes: "0",
          badTimes: "0"
        }
  		}
  	}

    static contextTypes={
      router: PropTypes.object.isRequired
    }

  	handleEvaluate(eva) { 
      let {userName, userType}=this.state.user;
      let id=this.state.article.id;

      if (!userType && !userName) {
        alert("请先登录或注册");
        return;
      }
      
      $.ajax({
        type: "POST",
        url: BASE_PATH + "/article/eva/0",
        data: {
          id: id,
          flag: eva
        },
        success: (data)=>{
          this.setState({
            article: {
              id: data.article_id,
              title: decodeURIComponent(data.title),
              content: decodeURIComponent(data.content),
              catagory: data.catagory,
              joinTime: data.join_time,
              readTimes: data.read_times,
              goodTimes: data.good_times,
              badTimes: data.bad_times
            }
          })
        },
        error: (xhr)=>{
          alert("出错啦："+xhr.status);
        }
      })
    }

    handleEdit() {
      let {id}=this.state.article;
      this.context.router.history.push("/edit?id="+id);
    }

    handleDel() {
      let {id}=this.state.article;
      let {userName, userType}=this.state.user;
      if (userName!=="admin" || userType!=="admin") {
        alert("无操作权限！请确认身份！");
        return;
      }
      if (confirm("你确定要删除？")) {
        $.ajax({ 
          type: "POST", 
          url: BASE_PATH + "/article/del/0", 
          data: { id:id },
          success: (data)=>{
            alert("删除成功！");
            this.context.router.history.push("/");
          },
          error: (xhr)=>{
            alert("出错啦："+xhr.status);
          }
        })
      }
    }

    componentDidMount() {
      let {userName, userType}=this.state.user;
      let url=window.location.href;
      // this.setState({ isAdmin: (userName==="admin" && userType==="admin")? true:false })
  
      if (url.indexOf("article?id=")>-1) {
        // startIndex=url.lastIndexOf("/");
        // id=url.substring(startIndex+1);
        let search=this.props.location.search;
        let id=search.split("=")[1];
        if (isNaN(id)) return; //转到404页面

        $.ajax({ type:"GET", url: BASE_PATH + "/article/get/"+id,
          success: (data)=>{
            // console.log(data);
            this.setState({
              article: {
                id: data.article_id,
                title: decodeURIComponent(data.title),
                content: decodeURIComponent(data.content),
                catagory: data.catagory,
                joinTime: data.join_time,
                readTimes: data.read_times,
                goodTimes: data.good_times,
                badTimes: data.bad_times
              }
            })
          },
          error: (xhr)=>{
            alert("出错啦："+xhr.status);
          }
        })
      } 
    }

	render() {
    const {id, title, content, catagory, joinTime, readTimes, goodTimes, badTimes}=this.state.article;
    const {userName, userType}=this.state.user;
		return (
      <div>
          <Header />
  			  <article id="article" className="left layoutwidth">
              {
                	parseInt(id)? 
                  <div>
                      <div className="article">
                          <section className="content">
                            	<h3 className="title"><a href="javascript:;">{title}</a></h3>
                            	<p className="info">
                                <em className="inf">
                                  	<span className="name">跨越南墙</span> 
                                    <span className="cata">分类：{catagory}</span>
                                  	<span className="time">{joinTime}</span>
                                  	<span className="">浏览量(<span>{readTimes}</span>)</span>
                                  {
                                    (userName==="admin" && userType==="admin") && 
                                    (<span className="edit">
                                        <a href="javascript:;" title="编辑文章" onClick={this.handleEdit}>编辑</a>
                                    </span>)
                                  }&nbsp;
                                  {
                                    (userName==="admin" && userType==="admin") && 
                                    (<span className="del">
                                        <a href="javascript:;" title="删除文章" onClick={this.handleDel}>删除</a>
                                    </span>)
                                  }
                                </em>
                            	</p>
                            	<div className="para">
                            		{remark().use(reactRenderer).processSync(content).contents}
                            	</div>
                          </section> 
                          <section className="evaluate textcenter">
                            <p className="">
                                <span className="zan">
                                  	<a href="javascript:;" className="" onClick={(eva)=>this.handleEvaluate("good")}>我觉得很赞
                                    	<strong>{goodTimes}</strong>
                                  	</a>
                                </span>
                                <span className="cai">
                                  	<a href="javascript:;" className="" onClick={(eva)=>this.handleEvaluate("bad")}>我觉得很踩
                                    	<strong>{badTimes}</strong>
                                  	</a>
                                </span>
                            </p>
                          </section> 
                      </div>
                      <Comment 
                        articleId={id} 
                        articleTitle={title}
                      />   
                  </div>: "正在加载文章。。。"
              }
  	      </article>
          <Sider />
          <Footer />
      </div>
		)
	}
}

// function mapStateToProps(state) {
//   return {
//     userType: state.LoginRegistReducer.userType,
//     userName: state.LoginRegistReducer.userName
//   }
// }

// export default connect(mapStateToProps)(Article);
