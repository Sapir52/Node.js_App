/**
    * @description      : 
    * @author           : ספיר
    * @group            : 
    * @created          : 27/08/2022 - 19:48:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/08/2022
    * - Author          : ספיר
    * - Modification    : 
**/
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const UserController = require('../controllers/UserController');

// Create a get method for register routes
router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});

// Create a post method for register routes
router.post('/', (req, res, next) => {
	let personInfo = req.body;

	if (!personInfo.email || !personInfo.username || !personInfo.address || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					let c;
					User.findOne({}, (err, data) => {

						if (data) {
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						let newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							address: personInfo.address,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}

});

// Create a get method for login routes
router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});

// Create a post method for login routes
router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				req.session.userId = data.unique_id;
				res.send({ "Success": "Success!" });
			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

// Create a get method for profile routes
router.get('/profile', (req, res, next) => {
	// Find a user by id ID and show
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			res.redirect('/');
		} else {
			return res.render('data.ejs', { "name": data.username, "email": data.email, "address": data.address});
		}
	});
});

// Create a get method for logout routes
router.get('/logout', (req, res, next) => {
	if (req.session) {
		// delete session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

// Create a get method for forgetpass routes
router.get('/forgetpass', (req, res, next) => {
	res.render("forget.ejs");
});

// Create a post method for forgetpass routes
router.post('/forgetpass', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
    /*If an email ID does not exist in the database, 
	 show the user that they are not registered on the site*/
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		// Otherwise, save the user's new password
		} else {
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save((err, Person) => {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

/*****************************************************/
// For user methods
router.route('/allUsers')
    .get(UserController.getAllUsers);
router.route('/deleteUser/:id')
	.get(UserController.deleteUser);
router.route('/createUser')
	.post(UserController.createUser);
router.route('/createUser')
	.get(UserController.create_user);
router.route('/updateUser/:id')
	.post(UserController.updateUser);
router.route('/updateUser/:id')
	.get(UserController.update_user);
	
/*****************************************************/




module.exports = router;
