import DatabaseService from "../service/DatabaseService.js";

const controller = {};

controller.getAllDishes = async (req, res) => {
  try {
    const dishes = await DatabaseService.Dish.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

controller.getDishById = async (req, res) => {
  try {
    const dish = await DatabaseService.Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }
    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

controller.getDishByName = async (req, res) => {
  try {
    const dish = await DatabaseService.Dish.findOne({ 
      name: { $regex: new RegExp(req.params.name, 'i') } 
    });
    
    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

controller.createDish = async (req, res) => {
  try {
    const dish = await DatabaseService.Dish.create(req.body);
    res.status(201).json({
      success: true,
      data: dish
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Dish with this name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

controller.updateDish = async (req, res) => {
  try {
    const dish = await DatabaseService.Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

controller.deleteDish = async (req, res) => {
  try {
    const dish = await DatabaseService.Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

export default controller;