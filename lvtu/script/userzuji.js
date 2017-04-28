
function backToWin(){
    setTimeout(function () {
        api.closeWin();
    }, 100);
}

apiready = function () {
	init();

    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
    	init();
    });

};


function init() {
  	var uid= api.pageParam.uid;	
	$api.setStorage('uid',uid);  
	
	var strr=''; 
	var zujiUlr = '/user?filter=';
	var zujiUlr_Param = {
      	 where:{
    		id:uid
    		},
    	include: ['zuji']
	    //	['record',{record:['img']}]
    }
    
	 ajaxRequest(zujiUlr+JSON.stringify(zujiUlr_Param), 'GET', '', function (ret, err) {
        if (ret) {
        	for(var id in ret[0].zuji){
        		var tmpday = ret[0].zuji[id].day.split('-');
        		var strday = tmpday[0]+'年'+tmpday[1]+'月'+tmpday[2]+'日';
        		var recordnum = ret[0].zuji[id].recordnum;
        		var zid= ret[0].zuji[id].id;
        		
        		strr+='<a href="" class="item Fix hightitem" tapmode onclick="showdayzuji('+"'"+zid+"'"+');">';		
	            strr+='<div class="cnt">';		
	            	strr+='<img class="pic" src="../image/zujidefault.png">';		
		            strr+='<div class="wrap">';		
			            strr+='<div class="wrap2">';		
				            strr+='<div class="content">';		
				                strr+='<div class="shopname">'+strday+'</div>';		
				                strr+='<div class="comment"><span></span></div>';		
				                strr+='<span class="classify">'+recordnum+'个脚印</span><span class="distance"><img src="../image/ic_address_big.png" alt=""></span>';		
					            strr+='</div>';		
				            strr+='</div> ';          		
			            strr+='</div>';		
		            strr+='</div>';		
		       strr+= '</a>';	
        	}        	
        	
        	$api.byId('zuji').innerHTML=strr;        	
    	}
    	else{
    	}
	});
}

function showdayzuji(zid){
	var uid = $api.getStorage('uid');  
	api.openWin({
	        name: 'dayzuji',
	        url: 'dayzuji.html',
	        opaque: true,
	        vScrollBarEnabled:false,
	        pageParam:{uid:uid,zujiid:zid}
	    });
}