var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var randtoken = require('rand-token');
var Schema = mongoose.Schema;
// Create The User Schema
var userSchema = new Schema({
	local : {
		username : String,
		password : String
	},
	facebook : {
		id : String,
		token : String,
		email : String,
		name : String
	},
	google : {
		id : String,
		token : String,
		email : String,
		name : String
	},
	token : {
		type : Schema.Types.ObjectId,
		ref : 'Token',
		default : null
	}
});

//Create the Token Schema
var tokenSchema = new Schema({
	value : String,
	user : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	expireAt : {
		type : Date,
		expires : 60,
		default : Date.now
	}
});
userSchema.methods.generateToken = ()=>{
	//Create a token
	var token = new Token();
	//Token properties
	token.value = randtoken.generate(32);
	token.user = this._id;
	this.token = token._id;
	//Saving the token
	this.save((err)=>{
		if(err) throw err;
		token.save((err)=>{
			if(err) throw err;
			// console.log('Done');
		});
	});
}
//Generate Hash
userSchema.methods.generateHash = (password)=>{
	return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}
//Validation of password
userSchema.methods.validPassword = (password)=>{
	return bcrypt.compareSync(password,this.local.password);
}
//Create model for User Schema
var User = mongoose.model('User',userSchema);
//Create model for Token Schema
var Token = mongoose.model('Token',tokenSchema);

module.exports = {
	User : User,
	Token : Token
};
