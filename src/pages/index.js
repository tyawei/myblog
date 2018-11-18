import React from 'react';
import {render} from 'react-dom';
// import {Router, IndexRoute, BrowserHistory} from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../reducer/store'
import Home from '../routes/'

import '../static/css/public.scss';
import 'antd/dist/antd.css';

render(
	<Provider store={store}>
		<BrowserRouter>
			<Home />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app')
)