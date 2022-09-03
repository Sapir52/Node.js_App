/**
    * @description      : 
    * @author           : ספיר
    * @group            : 
    * @created          : 27/08/2022 - 19:43:25
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/08/2022
    * - Author          : ספיר
    * - Modification    : 
**/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create a user schema
userSchema = new Schema( {
	
	unique_id: Number,
	email: {
        type:String,
        required:true,
        minLength:[11,'Email should be minimum of 11 characters'],
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
	username: String,
	address: String,
	password: {
        type:String,
        required:true,
        minLength:[4,'Password should be minimum of 4 characters']
    },
	passwordConf: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
}),
// Call the model constructor on the mongoose
User = mongoose.model('User', userSchema);

module.exports = User;