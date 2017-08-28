var fs = require('fs');
module.exports = (router,passport)=>{
	router.use(passport.authenticate('bearer',{session : 'false'}));
	router.use((req,res,next)=>{
		fs.appendFile('logs.txt',req.path + "token:" + req.query.access_token + "\n",
			(err)=>{
				next();
			});
	});
//GET request on the testAPI route
router.get('/testAPI',(req,res)=>{
	res.json({SecretData : 'abc123'});
});
}