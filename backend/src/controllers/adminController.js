const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
    const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email is already registered' });

    const userRole = ['ADMIN', 'USER', 'OWNER'].includes(role) ? role : 'USER';
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, userRole]
    );

    res.status(201).json({ message: `User created successfully with role ${userRole}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  try {
    const [owner] = await pool.query('SELECT id FROM users WHERE id = ? AND role = "OWNER"', [ownerId]);
    if (owner.length === 0) return res.status(400).json({ message: 'Selected owner does not exist or is not an OWNER' });

    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId]
    );

    res.status(201).json({ message: 'Store created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const { search = '', role = '', sortBy = 'name', sortOrder = 'ASC' } = req.query;
  const allowedSortCols = ['name', 'email', 'address', 'role'];
  const sortCol = allowedSortCols.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  try {
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role,
             COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE (u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ?)
    `;
    const params = [`%${search}%`, `%${search}%`, `%${search}%`];

    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    query += ` GROUP BY u.id ORDER BY u.${sortCol} ${order}`;
    const [users] = await pool.query(query, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStores = async (req, res) => {
  const { search = '', sortBy = 'name', sortOrder = 'ASC' } = req.query;
  const allowedSortCols = ['name', 'email', 'address', 'rating'];
  const sortCol = allowedSortCols.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  try {
    const query = `
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)
      GROUP BY s.id
      ORDER BY ${sortCol === 'rating' ? 'rating' : `s.${sortCol}`} ${order}
    `;
    const [stores] = await pool.query(query, [`%${search}%`, `%${search}%`, `%${search}%`]);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};