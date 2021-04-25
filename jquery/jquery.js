	
    
    let data=new FormData();
		data.append('file',self.fileInput.files[0]);
		data.append('currentAlbumsId',self.currentAlbumsId);
        /*下面这样子改，没作用，上传不了图片，用旧版本的可以上传，改怎么做？？？？*/
$.post("/photo/img/create",data,function(res){
console.log(res);
       if(res.state == 0) {
				 self.getPhotos();
					 alert("图片上传成功");
			 }else{
				 alert("图片上传失败");
			 }
})
/*
旧版本
	let ajax = new XMLHttpRequest();
	if(!window.XMLHttpRequest)  {
					let ajax = new ActiveXObject("Microsoft.xmlhttp");
			}
			ajax.open("POST", "/photo/img/create");
	ajax.onreadystatechange = function () {
					if(ajax.readyState == 4&&ajax.status == 200) {
							var data = JSON.parse(ajax.responseText);
							if(data.state == 0) {
								self.getPhotos();
									alert("图片上传成功");
							}else{
								alert("图片上传失败");
							}
					}
			}
ajax.send(data);
*/