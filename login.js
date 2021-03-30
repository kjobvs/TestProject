var express=require("express");
var router=express.Router();
var PW = require("png-word");//图片验证码，只支持数字
var pw = new PW();
var R = require("random-word");
var r= new R("0123456789");//定义验证码里面的内容
var users={ };//用户初始化
var Users=require("./message.js")//使用Mongodb数据库完成数据持久华
// var message={"name":[],"contents":[] };
/*
若要重新安装random-word ,安装命令：npm install liangzeng/random-word   
*/

//登入
router.post("/loging",async function(req,res){
console.log("=========");
  let  {name,password,sum} = req.body;
    let list=await Users.find({name:req.body.name}); //这里实现不了
console.log(list);
    if ((list.name===name&&list.password===password )&&
     (Number(sum)===req.session.firstnum+req.session.secondnum) ) {
      req.session.user=list.name;
  console.log("-------------登入成功");
    }
   res.redirect("back");
})
//退出
router.get("/logout",function(req,res){
       req.session.user=null;
      res.redirect("back");
})
//渲染resgin2
  router.get("/up",function(req,res){
      res.render("resgin2");
})
//注册页
function jusfy(req,res,next){

}
router.post("/resgin",async function(req,res){
       let {name,password,confirm}=req.body;
      if( req.session.img===confirm&&name&&password){
        var  au=new Users({
         name,
         password});
try{
  await au.save();
  console.log("-------------注册成功");
  res.redirect("/login2");
}catch(err){

console.log('error------',err);

if(err.errors.name){
res.render("resgin2",{error:err.errors.name.message});
}
if(err.errors.password){
res.render("resgin2",{error1:err.errors.password.message});
}
else {
 res.render("resgin2",{error:err.errors.name.message,error1:err.error.password.message});
}

}
   console.log("-------------注册------");
}else {
  res.render("resgin2");
}

});
//图片验证码
router.get("/img",function(req,res){
  let varify=r.random(3);//随机生成3随机生成3位数的验证码
  req.session.img=varify;
  pw.createReadStream(req.session.img).pipe(res);
})
//留言区



router.post("/message",async function(req,res){
       if(req.session.user.name&&req.body.contents){
          await Users.create([
           {name:req.session.user.name,
            content:req.body.contents,
            createTime:new Date()}
      ]);
  }
        res.redirect("back");
})

// ejs 登入页，上一页下一页
router.get('/', async function(req, res, next) {
     res.locals.user = req.session.user || "";
     let firstnum=Math.round(Math.random()*10);
     let secondnum=Math.round(Math.random()*10);
     req.session.firstnum=res.locals.firstnum=firstnum;
     req.session.secondnum=res.locals.secondnum=secondnum;

     let page=Number(req.query.page)||1;
     const message=await Users.find().sort("-createTime")
      .limit(3).skip((page-1)*3);//分页思想
     let prevPage=page-1>0?page-1:1;//首页
     let nextPage=page+1;//下一页
   let list=await Users.find();//查询所有的信息
     let MaxPage=Math.ceil(list.length/3);//这里取得总页数
      res.render("login2",{message,prevPage,nextPage,MaxPage});
});
//页码
router.get('/',async function(req,res){

})

module.exports=router;
