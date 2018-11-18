function getTime(now) {
	function toTwo(n) { 
		return n<10? "0"+n: ""+n; 
	}
	var year=now.getFullYear(),
	    month=now.getMonth()+1,
	    date=now.getDate(),
	    hour=now.getHours(),
	    min=now.getMinutes(),
	    second=now.getSeconds();
	var timeStr=`${toTwo(year)}年${toTwo(month)}月${toTwo(date)}日 ${toTwo(hour)}:${toTwo(min)}:${toTwo(second)}`;
	return timeStr;
}

module.exports=getTime;