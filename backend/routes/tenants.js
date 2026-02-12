const express = require('express');
const Tenant = require('../models/Tenant');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const { updateTenantStatusSchema } = require('../validations/tenantValidation');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', authenticate, authorize('superadmin'), asyncHandler(async (req, res) => {
  const tenants = await Tenant.find().sort({ createdAt: -1 });
  res.json(tenants);
}));

router.patch('/:id/status', authenticate, authorize('superadmin'), asyncHandler(async (req, res) => {
  const { error, value } = updateTenantStatusSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }))
    });
  }

  const tenant = await Tenant.findByIdAndUpdate(
    req.params.id,
    { isActive: value.isActive },
    { new: true }
  );

  if (!tenant) {
    return res.status(404).json({ message: 'Tenant not found.' });
  }

  res.json(tenant);
}));

module.exports = router;
