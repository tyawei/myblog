import fetch from 'whatwg-fetch'

export function getRequest(url, fn) {
	return fetch(url)
		.then((res)=>res.json())
		.then((data)=>fn(data))
		.catch((err)=>{console.log(err)})
}
export function postRequest(url, options, fn) {
	return fetch(url, options)
		.then((res)=>res.json())
		.then((data)=>fn(data))
		.catch((err)=>{console.log(err)})
}