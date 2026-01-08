const router = require('express').Router();
//const { sequelize } = require('../config/database');
const { clearDatabase } = require('../config/database');

// POST /test/reset – drop & recreate schema
// Used to reset the database between tests
router.post('/reset', async (req, res) => {
  try {
    await clearDatabase();
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('TEST RESET failed:', err);
    return res.status(500).json({ ok: false, error: 'reset_failed' });
  }
});

module.exports = router;
