
apiready = function () {	
	var header_h = api.pageParam.header_h;
	var uid = api.pageParam.uid;
	var travelid = api.pageParam.travelid;
	$api.setStorage('uid',uid);
	$api.setStorage('travelid',travelid);
    $api.fixStatusBar($api.dom('.header'));
    
    
    
    api.addEventListener({
	    name: 'closemap'
	}, function(ret, err) {
	    //alert(JSON.stringify(ret.value));
	    if(ret.value.key1=='fromslide' || ret.value.key1=='fromrunstop'){
	    	//alert();
	    	var amap = api.require('aMap');   
			amap.close(); 
	    }
	});
    
    api.sendEvent({
	    name: 'closemap',
	    extra: {
	        key1: 'fromrun'
	    }
	});
	
	initMap(header_h);
}


function initMap(maph){
	var aMap = api.require('aMap');
	aMap.open({
	    rect: {
	        x: 0,
	        y:maph
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
	    	
	    	/*
	    	 * 定位及设定定位按钮
	    	 */      	   
	    	setlocation();	    	
	    	initSetLocationbtn();	  
	    	
	    	/*
	    	 * 设定拍照、结束、暂停按钮
	    	 */   
	    	initTakePicbtn();	    	      
	    	initEndbtn();	
	    	initPausebtn();	
	    	/*
	    	 * 显示已记录点
	    	 */
	    	var newday = getToday();
        	var travelid = $api.getStorage("travelid");
			var getdayviewUrl = '/yj?filter=';
			 
		    var yj_urlParam = {
		    	where:{
		    		id:travelid
		    		},
		    	include: ['dayview'],
		    	includefilter:{
		    		dayview:{
		    			where:{
		    				dayinfo:newday
		    			}
		    		}
		    	}
		    };
		    ajaxRequest(getdayviewUrl + JSON.stringify(yj_urlParam), 'GET', '', function (ret, err) {   
		        //alert(JSON.stringify(ret));
		        if (ret && ret[0]!=null && ret[0].dayview!=null && ret[0].dayview[0]!=null) {  	
		        	var dayviewid=ret[0].dayview[0].id;  	        	  
		        	showdayviewpoint(dayviewid);  
		        }
	    	});
	    	
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
}


function setlocation(){

	
	var aMap = api.require('aMap');
        aMap.getLocation({
        	autoStop:true
        },function(ret, err) {
		    if (ret.status) {
		        if(ret.lon>0){
					aMap.setCenter({
					    coords: {
					        lon: ret.lon,
					        lat: ret.lat
					    },
					    animation: false
					});
					
		        }
		    } else {
		        alert(JSON.stringify(err));
		    }
		});	  
}


function initSetLocationbtn(){
	var button = api.require('UIButton');
	button.open({
	    rect: {
	        x: 10,
	        y: 500,
	        w: 30,
	        h: 30
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/frm_run/setmaplocation.png',
	        highlight: 'widget://image/frm_run/setmaplocation.png',
	        active: 'widget://image/frm_run/setmaplocation.png'
	    },
	    title: {
	        size: 14,
	        highlight: '',
	        active: '',
	        normal: '',
	        highlightColor: '#000000',
	        activeColor: '#000adf',
	        normalColor: '#ff0000',
	        alignment: 'center'
	    },
	    fixedOn: api.frameName,
	    fixed: true,
	    move: true
	}, function(ret, err) {
	    if (ret) {	 
	    	$api.setStorage('setlocationbtn',ret.id);		//存储定位按钮的id
	    	if(ret.eventType=="click")
	    	{
	    		
	    		setlocation();
	    	}
	        //alert(JSON.stringify(ret));
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});
}


function initTakePicbtn(){
	var frmWidth = api.frameWidth;
	var frmHeight = api.frameHeight;	
	var tmpX= frmWidth-140;
	var tmpY= frmHeight-frmHeight/5;
	var button = api.require('UIButton');
	button.open({
	    rect: {
	        x: tmpX,
	        y: tmpY,
	        w: 100,
	        h: 100
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/frm_run/camera.png',
	        highlight: 'widget://image/frm_run/camera.png',
	        active: 'widget://image/frm_run/camera.png'
	    },
	    title: {
	        size: 14,
	        highlight: '',
	        active: '',
	        normal: '',
	        highlightColor: '#000000',
	        activeColor: '#000adf',
	        normalColor: '#ff0000',
	        alignment: 'center'
	    },
	    fixedOn: api.frameName,
	    fixed: true,
	    move: true
	}, function(ret, err) {
	    if (ret) {	 
	    	$api.setStorage('TakePicbtn',ret.id);		//存储拍照按钮的id
	    	if(ret.eventType=="click")
	    	{	    		
	    		api.getPicture({
				    sourceType: 'camera',
				    encodingType: 'png',
				    mediaValue: 'pic',
				    destinationType: 'url',
				    allowEdit: true,
				    quality: 60,
				    targetWidth: 200,
				    targetHeight: 200,
				    saveToPhotoAlbum: true
				}, function(ret, err) {
				    if (ret) {	    	
				    	var picurl = ret.data;
				    	getlocation(function(recpoint){
			    			if(recpoint!=null){
			    				saveimg(picurl,recpoint);
			    			}
			    			else{
			    			
				    			saveimg(picurl,null);
			    			}
				    	});
				    	
				        //alert(JSON.stringify(ret));
				    } else {
				        alert(JSON.stringify(err));
				    }
				});
	    		
	    	}
	        //alert(JSON.stringify(ret));
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});
} 

function saveimg(imgurl,recpoint){								   
	api.showProgress({
        title: '照片存储中...',
        modal: false
    });
	var uploadphtoUlr = '/file';
	var bodyParam = {
        file:imgurl
    }
	 ajaxPhotoRequest(uploadphtoUlr, 'post', imgurl, function (ret, err) {	
        if (ret) {  
        	//alert(ret.id);
        	var file ={
        		id:ret.id,
        		name:ret.name,
        		url:ret.url
        	}
        	var newday = getToday();
        	var travelid = $api.getStorage("travelid");
			var getdayviewUrl = '/yj?filter=';
			 
		    var yj_urlParam = {
		    	where:{
		    		id:travelid
		    		},
		    	include: ['dayview'],
		    	includefilter:{
		    		dayview:{
		    			where:{
		    				dayinfo:newday
		    			}
		    		}
		    	}
		    };
		    ajaxRequest(getdayviewUrl + JSON.stringify(yj_urlParam), 'GET', '', function (ret, err) {   
		        //alert(JSON.stringify(ret));
		        if (ret && ret[0]!=null && ret[0].dayview!=null && ret[0].dayview[0]!=null) {  	        	
		        	  var dayviewid=ret[0].dayview[0].id;   
		        	  
		        	  showdayviewpoint(dayviewid);
		        	   setTimeout(function () { 					       
							shownewpoint(dayviewid,file,recpoint,imgurl);      
					    }, 500);
		        	  
		        }
		        else{
		        	//新建dayview
		        	 var setdayviewUlr = '/yj/'+travelid+'/dayview';
					var bodyParam = {
				        dayinfo:newday,
				    }		   
					 ajaxRequest(setdayviewUlr, 'post', JSON.stringify(bodyParam),function (ret, err) {
					 	if(ret)
					 	{
					 		var dayviewid = ret.id;
					 		shownewpoint(dayviewid,file,recpoint,imgurl);
					 	
					 	}	
					 	else{
					 		api.alert({
				                msg: "图片上传失败,请重试一次！"
				            });
					 	}
					 });		        	
        			api.hideProgress();
		        }		        
        		api.hideProgress();
	        });
        	
        } else {
            api.alert({
                msg: "图片上传失败,请重试一次！"
            });
        }
        api.hideProgress();
    })

}


/*
 * 拍照后先列出当天已记录的足迹
 */
function showdayviewpoint(dayviewid){
	var recordsUlr = '/dayview?filter=';
	var recordsUlr_Param = {
      	 where:{
    		id:dayviewid
    		},
    	include: ['photo']
			       
	    //	['record',{record:['img']}]
    }
    
	 ajaxRequest(recordsUlr+JSON.stringify(recordsUlr_Param), 'GET', '', function (ret, err) {
        if (ret) {
        	var t = ret[0].photo;      	
        	
        	/*
        	 *显示已有所有足迹 
        	 */       	        	
        	
        	var curpoints = new Array();//显示足迹点
        	var curpoppoints = new Array();//显示弹出气泡信息
        	var i = 1;		        
        	var lng=0.000;
        	var lat=0.000;	
            for(var id in t){	
            	i++;	            	            	
            			   
            	lng=lng*1+ t[id].gpsinfo.lng*1;
            	lat=lat*1+ t[id].gpsinfo.lat*1;
            	var tmpimg = ['widget://image/frm_run/position-b.png'];
            	
            	
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
           
           var aMap = api.require('aMap');					
					
			aMap.addAnnotations({
			    annotations:curpoints , 
			    icons: ['widget://image/frm_run/position-b.png'],
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
    })

}

/*
 *显示新添加纪录点 
 */
function shownewpoint(dayviewid,file,recpoint,imgurl){
	
	var newdate = new Date();
    var addphotoUlr ='/dayview/'+dayviewid+'/photo';
	var bodyParam = {
        gpsinfo:recpoint,
        height:'',
        filename:file.name,
        note:'',
        url:file,
        tag:'',
        status:0,
        source:'run',
        phototime:newdate,
    }
	 ajaxRequest(addphotoUlr, 'post', JSON.stringify(bodyParam), function (ret, err) {							
        if (ret) {
        	var aMap = api.require('aMap');			
				aMap.addAnnotations({
				    annotations:[{
				        id: 0,
				        lon: $api.strToJson(recpoint).lng,
				        lat: $api.strToJson(recpoint).lat
				    }], 
				   icons: ['widget://image/frm_run/position.png'],
		    		draggable: true,
		    		timeInterval: 2.0
			    },function(ret,err){
				 		 aMap.setBubble({
						    id: 0,
						    bgImg:imgurl,
						    content: {
						        title:'' ,
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
			    
			    });
        }
        else{
        	api.alert({
                msg: "图片上传失败,请重试一次！"
					            });
					        }					        
        					api.hideProgress();
				        });
}


/*
 * 获取拍照时的位置
 */
function getlocation(callback){
		var aMap = api.require('aMap');
        aMap.getLocation({
        	autoStop:true
        },function(ret, err) {
		    if (ret.status) {
		 		if(ret.lon >0){		 	
		 				
		 			var recpoint ='{"lat":"'+ ret.lat+'","lng":"'+ret.lon+'"}';	
		 			callback&&callback(recpoint);	
					//$api.setStorage('newphotorecpoint',recpoint);  
		 		}
		 		else{
		 			callback&&callback(null);
		 			//$api.setStorage('newphotorecpoint',null);
		 		}
		    } else {
		    	callback&&callback(null);
		    	//$api.setStorage('newphotorecpoint',null);
		        //alert(JSON.stringify(err));
		    }
		});	    

}

function initEndbtn(){
	
	var button = api.require('UIButton');
	button.open({
	    rect: {
	        x: 50,
	        y: 100,
	        w: 60,
	        h: 60
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/frm_run/stop.png',
	        highlight: 'widget://image/frm_run/stop.png',
	        active: 'widget://image/frm_run/stop.png'
	    },
	    title: {
	        size: 14,
	        highlight: '',
	        active: '',
	        normal: '',
	        highlightColor: '#000000',
	        activeColor: '#000adf',
	        normalColor: '#ff0000',
	        alignment: 'center'
	    },
	    fixedOn: api.frameName,
	    fixed: true,
	    move: true
	}, function(ret, err) {
	    if (ret) {	 
	    	$api.setStorage('Endbtn',ret.id);		//存储结束按钮的id
	    	if(ret.eventType=="click")
	    	{
	    		var travelid = $api.getStorage('travelid');
	    		var uid = $api.getStorage('uid');
	    		api.openWin({
			        name: 'win_runstop',
			        url: 'win_runstop.html',
			        opaque: true,
			        vScrollBarEnabled:false,
			        pageParam:{uid:uid,travelid:travelid}
			    });
	    	}
	        //alert(JSON.stringify(ret));
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});
}	

function initPausebtn(){
	var frmWidth = api.frameWidth;
	var tmpX= frmWidth-120;
	var button = api.require('UIButton');
	button.open({
	    rect: {
	        x: tmpX,
	        y: 100,
	        w: 60,
	        h: 60
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/frm_run/pause.png',
	        highlight: 'widget://image/frm_run/pause.png',
	        active: 'widget://image/frm_run/pause.png'
	    },
	    title: {
	        size: 14,
	        highlight: '',
	        active: '',
	        normal: '',
	        highlightColor: '#000000',
	        activeColor: '#000adf',
	        normalColor: '#ff0000',
	        alignment: 'center'
	    },
	    fixedOn: api.frameName,
	    fixed: true,
	    move: true
	}, function(ret, err) {
	    if (ret) {	 
	    	$api.setStorage('Pausebtn',ret.id);		//存储暂停按钮的id
	    	if(ret.eventType=="click")
	    	{
	    		
	    	}
	        //alert(JSON.stringify(ret));
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});
}	

function getToday(){
	 var curday = new Date();
    var tmpMonth =curday.getMonth()+1;
    var newday = curday.getFullYear()+'-'+tmpMonth+'-'+curday.getDate();
    return newday;
}