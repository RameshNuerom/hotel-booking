// controllers/admin/adminHotelController.js
const adminHotelService = require('../../services/admin/adminHotelService');

const createHotel = async (req, res, next) => {
  try {
    const newHotel = await adminHotelService.createHotel(req.body);
    res.status(201).json({
      message: 'Hotel created successfully!',
      hotel: newHotel,
    });
  } catch (error) {
    next(error);
  }
};

const getAllHotels = async (req, res, next) => {
  try {
    const hotels = await adminHotelService.getAllHotels();
    res.status(200).json({
      message: 'Hotels retrieved successfully!',
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    next(error);
  }
};

const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await adminHotelService.getHotelById(id);
    res.status(200).json({
      message: 'Hotel retrieved successfully!',
      hotel,
    });
  } catch (error) {
    next(error);
  }
};

const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedHotel = await adminHotelService.updateHotel(id, req.body);
    res.status(200).json({
      message: 'Hotel updated successfully!',
      hotel: updatedHotel,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedHotel = await adminHotelService.deleteHotel(id);
    res.status(200).json({
      message: 'Hotel deleted successfully!',
      deletedHotelId: deletedHotel.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
}; 
