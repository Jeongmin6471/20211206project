const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs"); //비크립트
const config = require('../config/database'); 

// User Schema
const UserSchema = mongoose.Schema({
  name: {              //첫번째 필드는 name
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },    
  username: {
    type: String,
    required: true
  },    
  password: {
    type: String,
    requird: true
  } 
});

const User = mongoose.model('User', UserSchema);

User.getUserById = function(id, callback) {          //유저 기준으로 db를 검색해보겠다
  User.findById(id, callback);         
};

User.getUserByUsername = function(username, callback) {    
  const query = { username: username};
  User.findOne(query, callback);         //입력하는username 레코드를 하나 찾아라
};

User.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);  //패스워드를 해시값으로 대체하여 저장
    });
  });
}

User.comparePassword= function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
    if(err) throw err;
    callback(null, isMatch);
  });
}

// Return all user list
User.getAll = function (callback) {
  User.find(callback);
};
  

module.exports = User;