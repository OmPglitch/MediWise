'use strict';

const router = require('express').Router();
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getAllDeliveries, getDeliveryById, trackDelivery,
  createDelivery, updateDelivery, updateColdChainTemp, deleteDelivery,
} = require('../controllers/deliveryController');

router.get('/',                      asyncHandler(getAllDeliveries));
router.get('/:id',                   asyncHandler(getDeliveryById));
router.get('/:id/track',             asyncHandler(trackDelivery));
router.post('/',                     asyncHandler(createDelivery));
router.put('/:id',                   asyncHandler(updateDelivery));
router.patch('/:id/temp',            asyncHandler(updateColdChainTemp));
router.delete('/:id',                asyncHandler(deleteDelivery));

module.exports = router;
