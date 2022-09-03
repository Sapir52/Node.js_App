/**
    * @description      : 
    * @author           : ספיר
    * @group            : 
    * @created          : 30/08/2022 - 22:16:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 30/08/2022
    * - Author          : ספיר
    * - Modification    : 
**/
const User = require('../models/user');

// Function expression to display all users
const getAllUsers = (req, res) => {
  User.find({}).exec(function(err, users) {   
    if (err) throw err;
    console.log(users);
    res.render('allUsers.ejs', { users: users });
  });
}

// Delete a user with a user id specified in the request
const deleteUser = (req, res)=>{
  const id = req.params.id;
  console.log(id);
  User.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
            console.log("Data Deleted!");
            res.redirect('/allUsers');
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete User with id=" + id
          });
      });
}
// Function expression for creating a new user -post method
const createUser = (req, res) => {
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
                    console.log("Success Add User");
                    res.redirect("/allUsers");
				} else {
					res.send({ "Success": "Email is already used." });

				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
}
// Get a method for creating user routes
const create_user = (req, res) => {
	return res.render('user.ejs', {"name": "", "email": "", "address": ""});
};

// Update a user with a  user id specified in the request -post method
const updateUser = (req, res) => {
	User.findByIdAndUpdate(req.params.id, {$set: req.body},
         function (err, result) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated User : ", result);
		res.redirect("/allUsers");
    }
});
}

// Get a method for updateing user routes   
const update_user =  (req, res) => {
	console.log( req.params.id);
	User.findById(req.params.id,function (err, user) {
		return res.render('user.ejs',  {"name": user.username, "email": user.email, "address": user.address});
	});

};


module.exports = {
    getAllUsers,
    deleteUser,
    createUser,
	updateUser,
    create_user,
    update_user
}