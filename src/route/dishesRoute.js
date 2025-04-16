import express from 'express';
import controller from '../controller/DishesController.js';

const router = express.Router();

// API endpoints
router.get('/', controller.getAllDishes);
router.get('/:id', controller.getDishById);
router.get('/name/:name', controller.getDishByName);
router.post('/', controller.createDish);
router.put('/:id', controller.updateDish);
router.delete('/:id', controller.deleteDish);

export default router;

