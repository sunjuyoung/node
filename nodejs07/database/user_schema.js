var crypto = require('crypto');

var Schema={};

Schema.createSchema = function(mongoose){
var UserSchema = mongoose.Schema({
    id:{type:String,required:true,unique:true},
    name:{type:String,index:'hashed'},
    password:{type:String,required:true},
    age:{type:Number,required:true},
    created_at : {type:Date,index:{unique:false},'default':Date.now},
    updated_at : {type:Date,index:{unique:false},'default':Date.now}
})
  //스키마 static메소드 추가
UserSchema.static('findById',function(id,callback){
    return this.find({id:id},callback);
})
UserSchema.static('findAll',function(callback){
    return this.find({},callback);
})
console.log('UserSchema 정의함');

return UserSchema;
};


module.exports = Schema; 