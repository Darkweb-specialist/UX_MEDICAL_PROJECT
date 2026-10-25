const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// Medicine routes
router.get('/', medicineController.getAllMedicines);
router.post('/', medicineController.createMedicine);
router.get('/:id', medicineController.getMedicineById);
router.put('/:id', medicineController.updateMedicine);
router.delete('/:id', medicineController.deleteMedicine);

// Dose logs routes
router.post('/doses/log', medicineController.recordDoseLog);
router.get('/doses/logs', medicineController.getDoseLogs);

module.exports = router;
