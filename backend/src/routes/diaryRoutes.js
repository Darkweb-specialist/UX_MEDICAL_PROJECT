const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');

router.get('/', diaryController.getAllDiaryEntries);
router.post('/', diaryController.createDiaryEntry);
router.delete('/:id', diaryController.deleteDiaryEntry);

module.exports = router;
