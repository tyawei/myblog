import React from 'react';
import PropTypes from 'prop-types';
import Catagories from './Catagories/';
import Users from './Users/';
import Friends from './Friends/';
import {Icon} from 'antd';

import Header from '../../components/Header/Container'
import Sider from '../../components/Sider/'
import Footer from '../../components/Footer/'

export default class Admin extends React.Component{
	constructor(props) {
		super(props);
		this.handleNav=this.handleNav.bind(this);
	}

	static contextTypes={
		router: PropTypes.object.isRequired
	}

	handleNav() {
		this.context.router.history.push("/add");
	}

	render() {
		return (
			<div>
				<Header />
				<div id="admin" className="left layoutwidth">
					<h3 className="title">博主管理中心</h3>
					<p className="admintitle" onClick={this.handleNav}>管理发文<Icon type="double-right" /></p>
					<Catagories />
					<Users />
					<Friends />
				</div>
				<Sider />
				<Footer />
			</div>
		)
			
	}
}
