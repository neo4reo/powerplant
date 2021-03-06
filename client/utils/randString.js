/**
 * Generate a roughly 11-character random string
 * @function
 * @return {String} [description]
 */
const randString = () => {
	return Math.random()
		.toString(36)
		.substring(2);
};

module.exports = {
	randString
};
