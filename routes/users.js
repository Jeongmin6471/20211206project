const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');    
const Card = require("../models/card");
const config = require('../config/database');

//사용자 등록
router.post('/register', (req, res, next) => {  
  let newUser = new User({              //user라는 이름으로 객체 생성
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password    
  });

  User.addUser(newuser, (err, user) => {
    if(err) {
      res.json({success: false, msg:'사용자 등록 실패'});
    } else {
      res.json({sucess: true, msg: '사용자 등록 성공'});
    }
  });
}); 

//2.사용자 로그인 및 JWM 발급
router.post('/authenticate',(req,res,next)=>{
  constusername=req.body.usernam;
  constpassword=req.body.password;
  User.getUserByUsername(username,(err,user)=>{
    if(err)throwerr;
    if(!user){
      returnres.json({success:false,msg:'Usernotfound'})
    }
    User.comparePassword(password,user.password,(err,isMatch)=>{
      if(err)throwerr;
      if(isMatch){
        lettokenUser={_id:user.
          _id,name:user.name,
          username:user.username,
          email:user.email,
        }
        consttoken=jwt.sign({data:tokenUser},config.secret,{
          expiresIn:604800//1week
        });
        res.json({
          success:true,
          token:token,
          userNoPW :tokenUser,
        });
      }else{
        returnres.json({success:false,msg:'Wrongpassword'})
      }
    });
  });
});

//3. profile 페이지 요청, JMT 인증 이용
router.get('/profile',passport.authenticate('jwt',{session:false}),
(req,res,next)=> {
  res.json({
    userNoPW:{
      name:req.user.name,
      username:req.user.username,
      email:req.user.email,
    },
  });
}
);

//4번
router.get("/list",
  passport.authenticate('jwt',{session:false}),
  (req, res, next) => {
    User.getAll((err, users) => {
      if (err) throw err;
      res.json(users);
    });
  });
  
// 5. 명함등록/수정
router.post("/card", (req, res, next) => {
  let username = req.body.username;
  let update = {
  name: req.body.name,
  org: req.body.org,
  title: req.body.title,
  tel: req.body.tel,
  fax: req.body.fax,
  mobile: req.body.mobile,
  email: req.body.email,
  homepage: req.body.homepage,
  address: req.body.address,
  zip: req.body.zip,
  };
  Card.getCardByUsername(username, (err, card) => {
    if (err) throw err;
    if (card) {
    Card.updateCard(username, update, (err, card) => {
    return res.json({
    success: false,
    msg: "명함정보 업데이트 성공",
    });
    });
    } else {
    update.username = req.body.username;
    let newCard = new Card(update);
    Card.addCard(newCard, (err, card) => {
    if (err) throw err;
    if (card) {
    res.json({ success: true, msg: "명함 등록 성공" });
    } else {
    res.json({ success: false, msg: "명함 등록 실패" });
    }
    });
    }
    });
});

// 6. 내 명함정보 전송
router.post("/myCard", (req, res, next) => {
  Card.getCardByUsername(req.body.username, (err, card) => {
  if (err) throw err;
  if (card) {
  return res.json({
  success: true,
  card: JSON.stringify(card),
  });
  } else {
  res.json({ success: false, msg: "명함정보가 없습니다" });
  }
  });
  });
    

module.exports = router;