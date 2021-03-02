var express = require('express');
var router = express.Router();
var multer = require("multer");//中间节
const upload = multer ({
    dest:"imgs/"
});
var fs = require('fs')
var albumNames = require("./album.json");
var albumMap =  require('./albumMap.json');
let currentAlbum= albumMap.default;
const single = upload.single("img");
//上传图片
router.post("/up",single,function( req,res){
       let file =req.file.filename ;
      let name = req.body.album;
     // albumMap.default.push(file) ;//默认相册添加图片
    albumMap[name].push(file); // 分类相册添加
     fs.writeFileSync(__dirname + "/albumMap.json",JSON.stringify(albumMap ))
 //持久华，转换成字符类型
     // res.send(req.file);
    res.redirect("back");
});
//图片请求
router.get('/img/:name', function(req, res) {
  fs.createReadStream("imgs/" + req.params.name).pipe(res);// 图片读取流
});
//添加相册
router.post("/add",function(req,res,next){
    let name = req.body.album;
   albumNames.push(name);
 fs.writeFileSync(__dirname +"/album.json",JSON.stringify(albumNames))//相册持久华
  res.locals.albumlist = albumNames;
  albumMap.name= [] ;
  res.redirect("back");
} );
//点击相册返回
router.get("/albumNames/:album",function(req,res){
      let name = req.params.album;
        currentAlbum= albumMap[name]
       res.locals.slectedAlbum=name;
       res.locals.albumNames=albumNames;
       // res.locals.currentImages=albumMap[name];
       //res.redirect("back");
 res.render('users');
})
//ejs渲染
router.get('/', function(req, res) {
  res.locals.currentImages=albumMap.name;
  res.render('users',{ albumNames,currentAlbum});
});
module.exports = router;