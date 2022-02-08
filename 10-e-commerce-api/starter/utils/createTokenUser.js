const createTokenUser = (user) => {
	return { userId: user._id, email: user.email, name: user.name, role: user.role };
};

module.exports = createTokenUser;
