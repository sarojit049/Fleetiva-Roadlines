const express = require('express');
const Load = require('../models/Load');
const Truck = require('../models/Truck');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const { loadIdSchema } = require('../validations/matchValidation');

const router = express.Router();

router.get('/:loadId', authenticate, authorize('admin'), async (req, res) => {
  const { error } = loadIdSchema.validate(req.params, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }))
    });
  }

  const load = await Load.findById(req.params.loadId);
  if (!load) return res.status(404).json({ message: 'Load not found.' });

  const trucks = await Truck.find({
    isAvailable: true,
    capacity: { $gte: load.requiredCapacity },
  }).sort({ capacity: 1 });

  res.json(trucks);
});

module.exports = router;
