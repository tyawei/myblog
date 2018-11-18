import React from 'react';

const styles={
	lineHeight:"100px", clear:"both", fontSize: "24px"
}

export default class Footer extends React.Component {
	render() {
		return (
			<div className="textcenter" style={styles}>Based on ECS Centos 7.2 in Hong Kong~</div>
		)
	}
}