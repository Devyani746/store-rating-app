const pool = require('../config/db');

exports.getStoresForUser = async (req, res) => {
  const userId = req.user.id;
  const { search = '', sortBy = 'name', sortOrder = 'ASC' } = req.query;
  const allowedSortCols = ['name', 'address', 'overallRating'];
  const sortCol = allowedSortCols.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  try {
    const query = `
      SELECT s.id, s.name, s.address,
             COALESCE(ROUND(AVG(all_r.rating), 1), 0) AS overallRating,
             user_r.rating AS userRating
      FROM stores s
      LEFT JOIN ratings all_r ON all_r.store_id = s.id
      LEFT JOIN ratings user_r ON user_r.store_id = s.id AND user_r.user_id = ?
      WHERE (s.name LIKE ? OR s.address LIKE ?)
      GROUP BY s.id, user_r.rating
      ORDER BY ${sortCol === 'overallRating' ? 'overallRating' : `s.${sortCol}`} ${order}
    `;
    const [stores] = await pool.query(query, [userId, `%${search}%`, `%${search}%`]);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.id;
  try {
    const [stores] = await pool.query('SELECT id, name, address FROM stores WHERE owner_id = ?', [ownerId]);
    if (stores.length === 0) return res.status(404).json({ message: 'No store registered for this owner' });

    const store = stores[0];
    const [[{ avgRating }]] = await pool.query(
      'SELECT COALESCE(ROUND(AVG(rating), 1), 0) AS avgRating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    const [raters] = await pool.query(
      `SELECT u.name, u.email, r.rating, r.updated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({ store, avgRating, raters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};