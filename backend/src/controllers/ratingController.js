const pool = require('../config/db');

exports.submitOrUpdateRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId, rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
  }

  try {
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [userId, storeId, rating]
    );

    res.json({ message: 'Rating saved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};