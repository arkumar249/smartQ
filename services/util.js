const jwt = require('jsonwebtoken');
const JWT_SECRET="Aaryan@321#";

// will be used during signup/login
function createToken(user) {
  return jwt.sign(
    { _id: user._id, email:user.email , role: user.role },
      JWT_SECRET,
    { expiresIn: '1d' }
  );
}

module.exports = createToken;
