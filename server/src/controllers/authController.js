const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { password } = req.body;

    let role = null;
    if (password === process.env.ADMIN_PASSWORD) {
      role = 'admin';
    } else if (password === process.env.VIEWER_PASSWORD) {
      role = 'viewer';
    }

    if (!role) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verify = async (req, res) => {
  res.json({ user: req.user });
};