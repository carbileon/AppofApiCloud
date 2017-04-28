function backToaddrecord(){	
	$api.setStorage('travelpause',0);   //退出暂停
    setTimeout(function () {
    var amap = api.require('aMap');    
		amap.close();
       api.closeWin();       
    }, 100);
}

apiready = function () {   
	api.sendEvent({
	    name: 'closemap',
	    extra: {
	        key1: 'fromtravelpause'
	    }
	}); 
	var uid= api.pageParam.uid;
    var travelid=api.pageParam.travelid; 
	//var uid =  $api.getStorage('uid');	
	
	$api.setStorage('uid',uid);       
	$api.setStorage('travelid',travelid);   
		
		
	 api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
    	$api.setStorage('travelpause',0);   //退出暂停
    	api.closeWin();    	
    });
    
     api.showProgress({
        title: '加载中...',
        modal: false
    });
    
   
	var recordsUlr = '/youji?filter=';
	var recordsUlr_Param = {
      	 where:{
    		id:travelid
    		},
    	include: ['record']
			       
	    //	['record',{record:['img']}]
    }
    
	 ajaxRequest(recordsUlr+JSON.stringify(recordsUlr_Param), 'GET', '', function (ret, err) {
        if (ret) {
        	var t = ret[0].record;
        	
        	
        	/*
        	 *显示所有足迹 
        	 */       	        	
        	
        	var icons = new Array();//显示足迹点
        	var icons2 = new Array();//显示弹出气泡信息
        	var i = 0;		        
        	var lng=0.000;
        	var lat=0.000;	
            for(var id in t){	
            	i++;	            	            	
            			   
            	lng=lng*1+ t[id].point.lng*1;
            	lat=lat*1+ t[id].point.lat*1;
            	var tmpimg = ['widget://'];
            	
            	/*
            	 * 
            	 * 此处需要修改，存为本地图片
            	 * 
            	 */
            	if(t[id].type=='photo' && t[id].img.url!=null){
    	           	//tmpimg = t[id].img.url;
    	           	tmpimg = ['widget://image/test.gif'];
			    }
			    /*
			    *
			    */
            	var icon = {
            		id:i,
            		lon:t[id].point.lng,
            		lat:t[id].point.lat,
            		icons: tmpimg 
			    }; 
			    
			    
			    var curdate = new Date(t[id].createdAt);			   
			    var icon2 ={
            		id:i,
            		icons: tmpimg ,
            		time:curdate.getHours() + ':' + curdate.getMinutes(),
            		info:t[id].note,
            		recid:t[id].id
			    }; 
            	//alert(icon.icons);
            	icons.push(icon);
            	icons2.push(icon2);            	
            }	 
           
            lng=lng/i;
            lat=lat/i;
            //icons='['+icons+']';
            setrec(icons,icons2,lng,lat);
            
            
        } else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })

   
    
};


function setrec(points,poppoints,lon,lat){	

			var allpoints = points;	 
			var allpoppoints = poppoints;	
		    var amap = api.require('aMap');    
			amap.open({
			    rect: {
			        x: 0,
			        y: 40
			    }, 
			    center: {
			        lon: 116.4021310000,
			        lat: 39.9994480000
			    },
			    showUserLocation: true,
			    zoomLevel: 11,	   
			    fixedOn: api.frameName,
			    fixed: true
			}, function(ret, err) {
			    if (ret.status) {
			    	var amap = api.require('aMap');
			    	if(lon>0){
					 	amap.setCenter({
						    coords: {
						        lon: lon,
						        lat: lat
						    },
						    animation: false
						});
					}
					
					//var amap = api.require('aMap');
					//alert(JSON.stringify(points));
				    var aMap = api.require('aMap');					
					
					aMap.addAnnotations({
					    annotations:points , 
					  // icons: ['widget://'],
			    		draggable: true,
			    		timeInterval: 2.0
				    },function(ret,err){
				    	//coding...
				    	/*	 
				    	 if (ret.eventType == 'click') {
				    	 
				        	alert(ret.id);
				    	 	var aMap = api.require('aMap');
				    	 
							aMap.popupBubble({
							    id: ret.id
							});							
						
					    }	*/		  
					    if(ret){
				    	    var i=0;
						    for(var id in allpoppoints){
						    	var record
						    	i++;		
				    			aMap.setBubble({
								    id: i,
								    bgImg:allpoppoints[id].icons[0],
								    content: {
								        title: allpoppoints[id].time,
								        subTitle: allpoppoints[id].info,
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
								        //alert(JSON.stringify(ret));
								         
										var uid =  $api.getStorage('uid');	
										var travelid =  $api.getStorage('travelid');	
								        api.openWin({
									        name: 'travel-pause2',
									        url: 'travel-pause2.html',
									        opaque: true,
									        vScrollBarEnabled: false,
									        pageParam:{uid:uid,travelid:travelid,recordid:allpoppoints[id].recid}
									    });
								    }
								});
						    
						    }	
				    	
				    	}
				    });
				   
			    	
			        //alert(JSON.stringify(ret));
			        
			    } else {
			        alert(JSON.stringify(err));
			    }
			});
    
        
}
function ToPhoto(){
		var uid =  $api.getStorage('uid');	
		var travelid =  $api.getStorage('travelid');	
								       
	   api.openWin({
	        name: 'travel-pause2',
	        url: 'travel-pause2.html',
	        opaque: true,
	        vScrollBarEnabled: false,
	        pageParam:{uid:uid,travelid:travelid,recordid:1}
	    });
}

