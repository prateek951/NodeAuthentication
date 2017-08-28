module.exports = (router,passport)=>{
	//localhost:8080/auth/
	//GET request to the index route
	router.get('/',(req,res)=>{
		res.render('index.ejs');
	});

	//localhost:8080/auth/login
	//GET request to the login route
	router.get('/login',(req,res)=>{
		res.render('auth/login.ejs',{message: req.flash('loginMessage')
		});
	});

	//POST request to the login route(Authentication for user access) 
	router.post('/login',passport.authenticate('local-login',{
	//If the user is authenticated,redirect the user to the /profile route
		successRedirect : '/profile',
	//If the user isn't authenticated,redirect the user to the same route
		failureRedirect : '/login',
		failureFlash : true
	}));

	//localhost:8080/auth/signup

	//GET request on the signup route
	router.get('/signup',(req,res)=>{
		res.render('auth/signup.ejs',{
			message : req.flash('signupMessage')
		});
	});

	//POST request on the signup route
	router.post('/signup',passport.authenticate('local-signup',{
	//If the user is signed up,redirect the user to the index route.	
		successRedirect : '/',
	//If the user is not signed up,redirect the user to the same route 
		failureRedirect : '/signup',
		failureFlash : true
	}));

	//GET request on the facebook route
	router.get('/facebook',passport.authenticate('facebook',{
		scope : ['email']
	}));
	//GET request on the facebook/callback route
	router.get('/facebook/callback',passport.authenticate('facebook',{
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	//GET request on the google route
	router.get('/google',passport.authenticate('google',{
		scope : ['email']
	}));

	//GET request on the google/callback route
	router.get('/google/callback',passport.authenticate('google',{
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	//GET request on the connect/facebook route
	router.get('/connect/facebook',passport.authorize('facebook',{
		scope : 'email'
	}));
	//GET request on the connect/google route
	router.get('/connect/google',passport.authorize('google',{
		scope : ['profile','email']
	}));

	//GET request on the connect/local route
	router.get('/connect/local',(req,res)=>{
		res.render('auth/connect-local.ejs',{
			message : req.flash('signupMessage')
		});
	});
	//POST request on the connect/local route
	router.post('/connect/local',passport.authenticate('local-signup',{
		successRedirect : '/profile',
		failureRedirect : '/connect/local',
		failureFlash : true
	}));

	//GET request on unlink/facebook route
	router.get('/unlink/facebook',(req,res)=>{
		//Tap the user which you want to unlink
		var user = req.user;
		//Assign the user's access token to NULL
		user.facebook.token = null;
		//Save the changes to the db thereby unlinking the user
		user.save((err)=>{
			if(err) throw err;
			res.redirect('/profile');
		});
	});

	//GET request on unlink/local route
	router.get('/unlink/local',(req,res)=>{
		//Tap the user which you want to unlink
		var user = req.user;
		//Assign the user's username to null
		user.local.username = null;
		//Save the changes to the db thereby unlinking the user
		user.save((err)=>{
			if(err)
				throw err;
			res.redirect('/profile');
		});	
	});


	//GET request on unlink/google route
	router.get('/unlink/google',(req,res)=>{
		//Tap the user which you want to unlink
		var user = req.user;
		//Take away the access token from the user
		user.google.token = null;
		//Save the changes to the db therby unlinking the user
		user.save((err)=>{
			if(err)
				throw err;
			res.redirect('/profile');
		});
	});

	//GET request on the logout route

	router.get('/logout',(req,res)=>{
		req.logout();
		//After logout redirect to the index route
		res.redirect('/');
	});

};