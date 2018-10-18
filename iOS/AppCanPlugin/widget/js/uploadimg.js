    function $viewpic(uploadUrl,picNum,callback,uploadType){
        console.log(uploadUrl) 
        if(uploadUrl == ''){
            return false;
        }
        randOpId = Math.floor(Math.random() * ( 1000 + 1));
        uexUploaderMgr.onStatus = function(opCode,fileSize,percent,serverPath,status){ 
                switch (status){
                    case 0: 
                            uexWindow.toast("1","5",percent+"%","0");
                            break;
                    case 1: 
                            uexWindow.closeToast();     
                            serverPath = JSON.parse(serverPath);
                            serverPath.localPath = file_src[opCode]
                            callback(JSON.stringify(serverPath));
                            uexUploaderMgr.closeUploader(opCode); 
                            break;
                    case 2:  
                            $.hideIndicator(); 
                            $.alert("图片上传失败");
                            uexUploaderMgr.closeUploader(opCode); 
                            uexWindow.closeToast();  
                            break;
                    default: 
                            break;
            }
        };
        uexUploaderMgr.cbCreateUploader = function(opCode,dataType,data){ 
            var path = file_src[opCode]; 
            var inCompress = 2;
            if (uexWidgetOne.platformName == "iOS"){
                    uexUploaderMgr.uploadFile(opCode,path,"image_1",inCompress,720);
            }
            if (uexWidgetOne.platformName == "android"){
                    uexUploaderMgr.uploadFile(opCode,path,"image_1",inCompress,720);
            } 
        
        };
        if(!isiOS){
            uexImageBrowser.cbPick = function(opCode, dataType, data) { 
                callbackPick(data)
            }
        }else{
            uexImagePicker.cBphotoPath = function(opCode, dataType, data){
                callbackPick(data)
            }
        }
        
        
        function callbackPick(data){ 
            file_src = new Array(); 
            if (data.indexOf(',') >= 0) {
                var arr = data.split(',');
                var len = arr.length; 
                for (var i = 0; i < len; i++) { 
                    file_src.push(arr[i]);
                    uexUploaderMgr.createUploader(i,uploadUrl);//创建上传对象
                }
            } else { 
                file_src.push(data);  
                uexUploaderMgr.createUploader("0",uploadUrl);//创建上传对象
            }
        }
        uexCamera.cbOpen = function(opCode, dataType, data){
            file_src = new Array(); 
            console.log(data);
            if (data.indexOf(',') >= 0) {
                var arr = data.split(',');
                var len = arr.length;
                
                for (var i = 0; i < len; i++) {
                    file_src.push(arr[i]);
                    uexUploaderMgr.createUploader(i,uploadUrl);//创建上传对象
                }
            } else { 
                file_src.push(data); 
                uexUploaderMgr.createUploader("0",uploadUrl);//创建上传对象
            }
        }
        if(uploadType === 1){
            uexCamera.open();
            return;
        }   
        if(picNum <= 1){ 
             isiOS ? uexImagePicker.pickPhotos() : uexImageBrowser.pick();
        }else{
             isiOS ? uexImagePicker.pickPhotos(picNum) : uexImageBrowser.pickMulti(picNum); 
        }
    }