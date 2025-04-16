const security = require('../security');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = security.verifyToken(token);
    req.user = user;
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  next();
}

module.exports = authenticateToken;
