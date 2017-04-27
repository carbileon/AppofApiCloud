apiready=function(){		
    var $header=$api.dom('.header');		
    $api.fixIos7Bar($header);		
    $api.fixStatusBar($header);
    var $header_h=$api.offset($header).h;
    var uid = api.pageParam.uid;
    $api.setStorage('uid',uid);
    var travelid = api.pageParam.travelid;    
    $api.setStorage('travelid',travelid);
    
    api.addEventListener({
	    name: 'closemap'
	}, function(ret, err) {
	    //alert(JSON.stringify(ret.value));
	    if(ret.value.key1=='fromslide' || ret.value.key1=='fromrun'){
	    	//alert();
	    	var amap = api.require('aMap');   
			amap.close(); 
	    }
	});
    
    api.sendEvent({
	    name: 'closemap',
	    extra: {
	        key1: 'fromrunstop'
	    }
	});
	
	initMap($header_h);
  
}	

function initMap(maph){
	var aMap = api.require('aMap');
	aMap.open({
	    rect: {
	        x: 0,
	        y:maph,
	        h:240
	    },
	    showUserLocation: true,
	    zoomLevel: 16,
	    center: {
	        lon: 116.4021310000,
	        lat: 39.9994480000
	    },
	    fixedOn: api.frameName,
	    fixed: true
	}, function(ret, err) {
	    if (ret.status) {         	   
	    	
	    	api.showProgress({
		        title: '看看你的足迹哦...',
		        modal: false
		    });
	    	
        	var travelid =$api.getStorage("travelid");
			var getdayviewUrl = '/yj?filter=';			 
		    var yj_urlParam = {
		    	where:{
		    		id:travelid
		    		},
		    	include: ['dayview']
		    };
		    ajaxRequest(getdayviewUrl + JSON.stringify(yj_urlParam), 'GET', '', function (ret, err) {   
		        //alert(JSON.stringify(ret));
		        if (ret && ret[0]!=null && ret[0].dayview!=null && ret[0].dayview[0]!=null) {  	
		        		
		        		var points = new Array();//显示足迹点
        				var poppoints = new Array();//显示弹出气泡信息
        				$api.setStorage('points',points);
        				$api.setStorage('poppoints',poppoints);
		        		var dayviews = ret[0].dayview;
		        		var daynum = ret[0].dayview.length;
		        		
        				$api.setStorage('curdaynum',daynum);//判断是否打点完毕
        				var i=0;
        				//获取起始日期
        				var startdate=dayviews[0].dayinfo;
        				var len = dayviews.length;
        				var enddate = dayviews[len-1].dayinfo;
        				$api.setStorage('startdate',startdate);
        				$api.setStorage('enddate',enddate);
        				
        				
		        	    for(var id in dayviews){
		        	    
		        	    	i++;
		        	    	var tmpdvid = dayviews[id].id;		        	    	
		        	    	showdayviewpoint(tmpdvid,i);
		        	    }  	
		        	    
		        	   
		        	    
		        }
		        else {
			        alert(JSON.stringify(err));
			    }	        	
    			api.hideProgress();
	    	});
	    	
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
}


function showdayviewpoint(dayviewid,j){


	var recordsUlr = '/dayview?filter=';
	var recordsUlr_Param = {
      	 where:{
    		id:dayviewid
    		},
    	include: ['photo']
    }
	 ajaxRequest(recordsUlr+JSON.stringify(recordsUlr_Param), 'GET', '', function (ret, err) {
        if (ret) {
        	var t = ret[0].photo;      	
        	
        	/*
        	 *显示已有所有足迹 
        	 */       	        	
        	
        	var curpoints = $api.getStorage('points');
        	var curpoppoints = $api.getStorage('poppoints');
			
			
        	var i = curpoints.length+1;		        
        	var lng=0.000;
        	var lat=0.000;	
            for(var id in t){	
            	i++;	            	            	
            			   
            	lng=lng*1+ t[id].gpsinfo.lng*1;
            	lat=lat*1+ t[id].gpsinfo.lat*1;
            	var tmpimg = ['widget://image/win_runstop/position-compass.png'];
            	
            	
            	var icon = {
            		id:i,
            		lon:t[id].gpsinfo.lng,
            		lat:t[id].gpsinfo.lat,
            		icons: tmpimg 
			    }; 
			    
			    
			    var curdate = new Date(t[id].phototime);			   
			    var icon2 ={
            		id:i,
            		icons: tmpimg ,
            		time:curdate.getHours() + ':' + curdate.getMinutes(),
            		info:'',
            		recid:t[id].id
			    }; 
            	//alert(icon.icons);
            	curpoints.push(icon);
            	curpoppoints.push(icon2);            	
            }	 
           
            lng=lng/i;
            lat=lat/i;
           
           $api.setStorage('points',curpoints);
           $api.setStorage('poppoints',curpoppoints);
          
       
           var aMap = api.require('aMap');					
			var curdaynum = $api.getStorage('curdaynum');
	 		
			if(j==curdaynum){
				setyjlocation();
			}
			aMap.addAnnotations({
			    annotations:curpoints , 
			  	icons: ['widget://image/win_runstop/position-compass.png'],
	    		draggable: true,
	    		timeInterval: 2.0
		    },function(ret,err){
		    	
			    if(ret){
			    	
		    	    var i=0;
				    for(var id in curpoppoints){
				    	var record
				    	i++;		
		    			aMap.setBubble({
						    id: i,
						    bgImg:curpoppoints[id].icons[0],
						    content: {
						        title: curpoppoints[id].time,
						        subTitle: '',
						        illus: ''
						    },
						    styles: {
						        titleColor: '#000',
						        titleSize: 16,
						        subTitleColor: '#999',
						        subTitleSize: 12,
						        illusAlign: 'left'
						    }
						}, function(ret) {
						 	
						    if (ret.eventType=='clickContent') {
						        aMap.closeBubble({
								    id: ret.id
								});
						    }
						});
				    
				    }	
		    	
		    	}
		    });
				   
           
            
            
        } else {
            api.alert({
                msg: err.msg
            });
        }
        	        	
		api.hideProgress();
    })

}
	
function setyjlocation(){
	
	var allpoints = $api.getStorage('points');
	var tmplblon = allpoints[0].lon;
	var tmplbLat=allpoints[0].lat;
	var tmprtLon= allpoints[0].lon;
	var tmprtLat= allpoints[0].lat;
	for(var id in allpoints){
		 var curlng = allpoints[id].lon;
		 var curlat = allpoints[id].lat;
		 if(curlng<tmplblon){
		 	tmplblon = curlng;
		 }
		 if(curlng>tmprtLon){
		 	tmprtLon = curlng;
		 }
		 
		 if(curlat<tmplbLat){
		 	tmplbLat= curlat;
		 }
		 
		 if(curlat>tmprtLat){
		 	tmprtLat=curlat;
		 }
	}
	
	var test=tmprtLat*1+0.0003;
	//alert(test);
	var aMap = api.require('aMap');
	aMap.setRegion({
	    lbLon: tmplblon, 
	    lbLat: tmplbLat, 
	    rtLon: tmprtLon, 
	    rtLat: test,
	    animation: true
	});
}

function endrun(){	
	api.showProgress({
        title: '完成游记中...',
        modal: false
    });
	var travelid=$api.getStorage('travelid');
	var endyjUlr = '/yj/'+travelid;
	var bodyParam = {
		title:'',
		type:1,
		note:$api.byId('yjinfo').value,
        status: 1
    }
	 ajaxRequest(endyjUlr, 'put', JSON.stringify(bodyParam), function (ret, err) {
        if (ret) {          	
        	
             $api.setStorage('intravel',0);   
		    $api.setStorage('travelId',null);  	
		   
		    api.closeToWin({
	            name: 'slide'
            });
        } else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })
	
}

function edityj(){		
	var uid=$api.getStorage('uid');
	var travelid=$api.getStorage('travelid');
	api.openWin({
        name: 'win_notepage',
        url: '../html/win_notepage.html',
        pageParam: {
            url: 'frm_newnote.html',
            frameName: 'frm_newnote',
            uid:uid,
            travelid:travelid,
            startdate:$api.getStorage('startdate'),
            enddate:$api.getStorage('enddate')
        },
        bounces: false,
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },           
        reload: true,
        showProgress: true
    });
}