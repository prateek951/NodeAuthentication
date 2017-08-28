var User = require('../models/user').User;
var Token = require('../models/user').Token;

module.exports = (router,passport)=>{

	router.use((req,res,next)=>{
		if(req.isAuthenticated){
			return next();
		}
		res.redirect('/auth');
	});

	//GET request on the profile route
	router.get('/profile',(req,res)=>{
		User.findOne({_id : req.user._id}).populate('token').exec((err,user)=>{
			res.render('secured/profile.js',{user : user});
		});
	});

	//GET request on the home route
	router.get('/home',(req,res)=>{
		res.render('secured/home.ejs');
	});

	//GET request on the getToken route
	router.get('/getToken',(req,res)=>{
		User.findOne({_id : req.user._id}).populate('token').exec((err,user)=>{
			//Check if the user's token is null.If so,generate a token for him
			if(user.token == null)
					user.generateToken();
			req.user = user;
			res.redirect('/profile');
		}
	});
});

	//GET request on the * route
	router.get('/*',(req,res)=>{
		res.redirect('/profile');
	});

































}