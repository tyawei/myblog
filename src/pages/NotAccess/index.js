import React from 'react'

export default class NotAccess extends React.Component{
	render() {
		return (
			<div>
				<h1>非法提示：你没有该页面的访问权限！</h1>
				<div>原因可能是：</div>
				<ul>
					<li>身份信息已经过期；</li>
					<li>用户类型不正确.</li>
				</ul>
			</div>
		)
	}
}