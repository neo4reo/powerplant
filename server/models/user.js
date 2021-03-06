const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const saltRounds = 11;

/**
 * When fetched with a query, unless explicitly selecting other fields, only
 * the username and id will be returned.
 * 
 * @constructor
 * @alias User
 * @param {Object} user
 * @param {String} user.username
 * @param {String} user.email
 * @param {String} user.password Passed in plaintext, but will be salted and hashed on save
 * @param {(ObjectId[]|server.models.Location[])} [locations] IDs of all locations stored under the user
 */
const userSchema = new Schema({
	username: { type: String, index: { unique: true }, required: true },
	email: {
		type: String,
		select: false,
		index: { unique: true },
		required: true
	},
	password: { type: String, select: false, required: true },
	locations: [{ type: ObjectId, select: false, ref: 'Location' }]
});

userSchema.pre('save', function(next) {
	const user = this;
	if (!user.isModified('password')) {
		// If the password wasn't modified, hash doesn't need to be updated
		next();
	} else {
		bcrypt.hash(user.password, saltRounds, function(err, hash) {
			user.password = hash;
			next();
		});
	}
});

/**
 * Custom query method for finding a single User by their username.
 * 
 * @example
 * // fetch the user with username "testUser"
 * User.find().byUsername("testUser").exec((err, user) => {
 *   // do something with user
 * })
 * @alias byUsername
 * @memberof server.models.User
 * @static
 * @param {String} username Exact username to find
 * @return {Mongoose.Query}
 */
userSchema.query.byUsername = function(username) {
	return this.findOne({ username });
};

/**
 * @alias checkPassword
 * @memberof server.models.User
 * @param {String} password Hashed password to check
 * @param {server.models.User~passwordCheckCallback} callback Callback function when done checking
 * @return {None}
 */
userSchema.methods.checkPassword = function(password) {
	return bcrypt.compare(password, this.password);
};

/**
 * @callback server.models.User~passwordCheckCallback
 * @param {String} err Error message, if there was one
 * @param {Boolean} success Did the passwords match or not?
 */

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
