var uid=null;
var travelid=null;
var type=null;
apiready= function(){
	var $header=$api.dom('.header');		
    $api.fixIos7Bar($header);	
    $api.fixStatusBar($header);	
    var $header_h=$api.offset($header).h;	
    
     uid = api.pageParam.uid;
    //$api.setStorage('uid',uid);
    travelid = api.pageParam.travelid;
    //$api.setStorage('travelid',travelid);
    type = api.pageParam.type;
    //$api.setStorage('type',type);
    
    showyjinfo(travelid);
}


function showyjinfo(travelid){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
	var dayviewUrl = '/yj?filter=';
	var dayviewUrl_Param = {
      	 where:{
    		id:travelid
    		},
    	include: ['dayview']
    }
    
	 ajaxRequest(dayviewUrl+JSON.stringify(dayviewUrl_Param), 'GET', '', function (ret, err) {
        if (ret) {
        	if(ret[0].guideimg!=null && ret[0].guideimg.url!=null ){
        	
        		var imgurl = ret[0].guideimg.url;
        		var frmwidth=api.frameWidth;
        		$api.byId('guideimg').innerHTML = '<img  height="200px" src="'+imgurl +'">';
        	}
        	else{
        	
        		$api.byId('guideimg').innerHTML = '<img src="../image/win_yjview/pic144.png">';
        	}
        	
        	var dayviews = ret[0].dayview;  
        	var yjinfostr='';    
        	var strArrays = new Array();
        	for(var id in dayviews){
        		var curdate = dayviews[id].dayinfo;
        	    var curMonth= curdate.split('-')[1];
        	    var curDay = curdate.split('-')[2];
        	    
        	    var dvid = dayviews[id].id;
        	    var strr="";
        	    
				strr+='<a class="dateofview">'+curMonth+'月<br/>'+curDay+'日</a>';
        	    strr+='<div id="'+dvid+'" class="dayview">';
				strr+='</div>';
				var strArray={
        			id:dvid,
        			info:strr
        		}
        		strArrays.push(strArray);
        		yjinfostr+=strr;
        	}
        	$api.byId('yjinfo').innerHTML = yjinfostr;
        	
        	 for(var id in strArrays){  
        	 		var curdvid= strArrays[id].id;    
	        	 	var photoUrl = '/dayview?filter=';
					var photoUrl_Param = {
				      	 where:{
				    		id:strArrays[id].id
				    		},
				    	include: ['photo']
				    }
					ajaxRequest(photoUrl+JSON.stringify(photoUrl_Param), 'GET', '', function (ret, err) {
					    if (ret) {
					    	var photostr="";
					    	var photos = ret[0].photo;
						    for(var id in photos){
						    	photostr+='<div class="photo">';
							    photostr+='<div class="photourl">';			
								photostr+='<img src="'+photos[id].url.url+'"  height="200px">';
								photostr+='</div>';
								photostr+='<a class="photoinfo">'+photos[id].note+'</a>';
								photostr+='</div>';
								photostr+='<div class="photointervel">';
								photostr+='</div>';
						    }
						    $api.byId(curdvid).innerHTML = photostr;
					    }
					});
        	 }
        	
        }
       else{
    		api.alert({
                msg: err.msg
            });
    	}  
	    api.hideProgress();  
     });
}

function closeyjview(){
	//var type = $api.getStorage('type');
	switch(type){
		case 'makeyj':
			api.closeToWin({
	            name: 'slide'
            });
			break;
		case 'viewyj':
			api.closeWin();
			break;
		default:
			
			break;
	}
}