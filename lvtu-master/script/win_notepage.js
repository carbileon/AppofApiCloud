var uid=null;
var travelid=null;
var yjtype=null;
 apiready=function(){		
    var $header=$api.dom('.header');		
    $api.fixIos7Bar($header);	
    $api.fixStatusBar($header);	
    var $header_h=$api.offset($header).h;		
    
    var newurl = api.pageParam.url;
    //var title = api.pageParam.title;
    uid = api.pageParam.uid;
    //$api.setStorage('uid',uid);
    travelid = api.pageParam.travelid;
    //$api.setStorage('travelid',travelid);
    var startdate = api.pageParam.startdate;
    var enddate = api.pageParam.enddate;
    var yjtype = api.pageParam.yjtype;
    //$api.setStorage('yjtype',yjtype);
    //$api.byId('curtitle').innerHTML=title;
    api.openFrame({		
        name:'',		
        url:newurl,		
        rect:{		
            x:0,		
            y:$header_h,		
            w:'auto',		
            h:'auto'		
        },
	     pageParam:{
	    	header_h:$header_h,
	    	travelid:travelid,
	    	uid:uid,
	    	startdate:startdate,
	    	enddate:enddate,
	    	yjtype:yjtype
	    }	
    });		
}		
    
function backToWin(){		
    setTimeout(function () {    
       api.closeWin();       
    }, 100);
}

function publishyj(){
	var yjtitle='';
	if($api.getStorage('yjtitle')!=null && $api.getStorage('yjtitle')!='添加标题'){
		yjtitle=$api.getStorage('yjtitle');
	}
	var yjtitleinfo= '';
	if($api.getStorage('yjtitleinfo')!=null && $api.getStorage('yjtitleinfo')!='添加游记简介'){
		yjtitleinfo=$api.getStorage('yjtitleinfo');
	}
	
	
	
	api.showProgress({
        title: '完成游记中...',
        modal: false
    });
	//var travelid=$api.getStorage('travelid');
	var uid=$api.getStorage('uid');
	
	//var yjtype = $api.getStorage('yjtype');
	var type=0;
	switch(yjtype){
		case 'run':
			 type=1;
		case 'album':
			  type=2;
		break;
	}
	var endyjUlr = '/yj/'+travelid;
	var bodyParam = {
		title:yjtitle,
		type:type,
		note:yjtitleinfo,
        status: 1
    }
	 ajaxRequest(endyjUlr, 'put', JSON.stringify(bodyParam), function (ret, err) {
        if (ret) {          	
        	if(yjtype=='run'){
	             $api.setStorage('intravel',0);  	
		   }  
		   var toreshowyjarrays = $api.getStorage('toreshowyjarrays');
		   var i=0;
		   var j=0;
			for(var id in toreshowyjarrays){
				if(toreshowyjarrays[id].noteinfo!=null && toreshowyjarrays[id].noteinfo!=''){
					i++;
					var endphotoUlr = '/photo/'+toreshowyjarrays[id].photoid;
					var photobodyParam = {
						seriano:toreshowyjarrays[id].seriano,
						type:1,
						note:toreshowyjarrays[id].noteinfo,
				        status: 1
				    }
					 ajaxRequest(endphotoUlr, 'put', JSON.stringify(photobodyParam), function (ret, err) {
					 		if(ret){
					 			j++;
					 			
					 			if(j== $api.getStorage('alterphotonum')){
					 				
					 				 //$api.setStorage('travelid',null); 
									   api.openWin({
									        name: 'win_yjview',
									        url: 'win_yjview.html',
									        opaque: true,
									        vScrollBarEnabled:false,
									        pageParam:{
									        	uid:uid,
									        	travelid:travelid,
									        	type:'makeyj'
									        }
									    });
					 			}
					 		}
					 		else{
					 			 api.alert({
					                msg: err.msg
					            });
					 		}
					 
					 });
				 }
				
			}
			$api.setStorage('alterphotonum',i);
			if(i==0){
				 $api.setStorage('travelId',null); 
			    api.openWin({
			        name: 'win_yjview',
			        url: 'win_yjview.html',
			        opaque: true,
			        vScrollBarEnabled:false,
			        pageParam:{
			        	uid:uid,
			        	travelid:travelid,
			        	type:'makeyj'
			        }
			    });
			}
		   
        } 
        else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })
	
	
}


