function showtypelist(){
}  
function backToaddrecord(){	
    setTimeout(function () {    
       api.closeWin();      
    }, 100);
}


function endlvtu(){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
	//创建一个新的游记
	
	var travelid=$api.getStorage('travelid');
    var uid = $api.getStorage('uid');
	var endyoujiUlr = '/youji/'+travelid;
	var bodyParam = {
		youjiname:$api.byId('yjname').value,
		type:1,
		experience:$api.byId('feel').value,
        status: 1
    }
	 ajaxRequest(endyoujiUlr, 'put', JSON.stringify(bodyParam), function (ret, err) {
        if (ret) {          	
        	
            $api.setStorage('intravel',0);   
             api.openWin({
		        name: 'travel-youji',
		        url: 'travel-youji.html',
		        opaque: true,
		        vScrollBarEnabled: false,
		        pageParam:{uid:api.pageParam.uid,travelid:travelid}
		    });
        } else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })
    
    
    
}


apiready = function () {
	 api.addEventListener({
            name:'viewappear'
        },function(ret,err){
        	
           var travelstatus = $api.getStorage('intravel');   
			if(travelstatus && travelstatus==0){
				backToaddrecord();
				//api.closeWin();
			    return;
			}
        })   
    

	var uid= api.pageParam.uid;
    var travelid=api.pageParam.travelid;
    //var travelid = api.pageParam.travelid;
    $api.setStorage('uid',uid);   
    $api.setStorage('travelid',travelid);   
    
    //var uid = $api.getStorage('uid');
	if(!uid){
		api.openWin({
	        name: 'userLogin',
	        url: 'userLogin.html',
	        opaque: true,
	        vScrollBarEnabled:false
	    });
	    return;
	}
	

};