const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;

function createToken(user) {
  return jwt.sign(
    { _id: user._id, email:user.email , role: user.role },
      JWT_SECRET,
    { expiresIn: '1d' }
  );
}

module.exports = createToken;
