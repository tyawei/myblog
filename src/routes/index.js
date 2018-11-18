import React from 'react';
// import {Router, IndexRoute, BrowserHistory} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import ArticleList from '../pages/ArticleList/';
import Article from '../pages/Article/';
import ArticleEdit from '../pages//ArticleEdit/';
import Admin from '../pages/Admin/';
import File from '../pages/File/';
import ArticleCata from '../pages/ArticleCata/';
import Friend from '../pages/Friend/';
// import NotAccess from '../pages/NotAccess/'
import NotMatch from '../pages/NotMatch/'

export default class Home extends React.Component{
	render() {
		return (
			<Switch>
				<Route exact path="/" component={ArticleList} />
				<Route path="/article" component={Article} />
				<Route path="/add" component={ArticleEdit} />
				<Route path="/edit" component={ArticleEdit} />
				<Route path="/admin" component={Admin} />
				<Route path="/file" component={File} />
				<Route path="/catagory" component={ArticleCata} />
				<Route path="/friend" component={Friend} />
				<Route path="*" component={NotMatch} />
			</Switch>
		)
	}
}