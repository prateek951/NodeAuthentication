var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var User = require('../app/models/user').User;
var Token = require('../app/models/user').Token;
var configAuth = require('./auth');

module.exports = (passport)=>{

	//Serialise the user
	passport.serializeUser((user,done)=>{
		done(null,user.id);
	});
	//Deserialise the user
	passport.deserializeUser((id,done)=>{
		User.findById(id,(err,user)=>{
			done(err,user);
		});
	});

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL,
		passReqToCallback : true
	},
	(req,accessToken,refreshToken,profile,done)=>{
		process.nextTick(()=>{
			//Check if the user is logged in
			//If the user is not logged in
			if(!req.user){
				User.findOne({'facebook.id' : profile.id},(err,user)=>{
					if(err)
						return done(err);
					//If user is logged in
					if(user){
						//but user has no token
						if(!user.facebook.token){
							//Grant him token
							user.facebook.token = accessToken;
							user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
							user.facebook.email = profile.emails[0].value;
							//Save the changes to db
							user.save((err)=>{
								if(err) throw err;
							});
						}
						return done(null,user);
					}
					//if no such user is there
					else{
						//Create a user
						var newUser = new User();
						newUser.facebook.id = profile.id;
						//Grant accessToken to the user
						newUser.facebook.token = accessToken;
						newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;
						//Save the changes to the db
						newUser.save((err)=>{
							if(err)
									throw err;
							return done(null,newUser);
						})
					}
				});
			}
		//User is logged in already but it needs to be merged
		else{
			//Tap the user
			var user = req.user;
			user.facebook.id = profile.id;
			user.facebook.token = accessToken;
			user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
			user.facebook.email = profile.emails[0].value;
			//Save the user to the db
			user.save((err)=>{
				if(err) throw err;
				return done(null,err);
			})
		}

		});
	}));

passport.use(new GoogleStrategy({
	clientID : configAuth.googleAuth.clientID,
	clientSecret : configAuth.googleAuth.clientSecret,
	callbackURL : configAuth.googleAuth.callbackURL,
	passReqToCallback : true
},(req,accessToken,refreshToken,profile,done)=>{
	process.nextTick(()=>{
		//If the user is not logged in yet
		if(!req.user){
			//Make the user get loggedin
			User.findOne({'google.id' : profile.id},(err,user)=>{
				if(err) throw err;
				//Now the user is logged in
				if(user){
					// if user doesn't have the accessToken
						if(!user.google.token){
							//Grant the accessToken to the user
							user.google.token = accessToken.
							user.google.name = profile.displayName;
							user.google.email = profile.emails[0].value;
							//Save the user to the db
							user.save((err)=>{
								if(err) throw err;
								//console.log('done');
							});
						}
					return done(null,user);
				}
			//if the user doesn't exists
			else{
					//Create a new user
					var newUser = new User;
					//Assign an ID to the user
					newUser.google.id = profile.id;
					//Grant a token to the user
					newUser.google.token = accessToken;
					newUser.google.email = profile.emails[0].value;
					//Save the user to the db
					newUser.save((err)=>{
						if(err) throw err;
						return  done(null,user);
					})
			}
			});
		}else{
			var user = req.user;
			user.google.id = profile.id;
			user.google.token = accessToken;
			user.google.name = profile.displayName;
			user.google.email = profile.emails[0].value;
			//Commit the changes to the db
			user.save((err)=>{
				if(err) throw err;
				return done(null,user);
			});

		}
	});
}));

passport.use(new BearerStrategy({},
	(token,done)=>{
		Token.findOne({value : token}).populate('user').exec((err,token)=>{
			//If there is no bearer of the token
			if(!token)
				return done(null,false);
			//if there is a bearer of the token
			return done(null,token.user);
		})
	}));
};
