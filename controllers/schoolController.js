const { pool } = require('../config/database');
const { schoolValidationSchema, coordinateValidationSchema } = require('../utils/validation');
const { calculateDistance } = require('../utils/distanceCalculator');

// Add School API
const addSchool = async (req, res) => {
  try {
    // Validate input data
    const { error, value } = schoolValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { name, address, latitude, longitude } = value;

    // Insert school into database
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude
      }
    });

  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// List Schools API
const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate user coordinates
    const { error } = coordinateValidationSchema.validate({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided',
        errors: error.details.map(detail => detail.message)
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // Fetch all schools from database
    const connection = await pool.getConnection();
    const [schools] = await connection.execute('SELECT * FROM schools ORDER BY id');
    connection.release();

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found',
        data: []
      });
    }

    // Calculate distance for each school and sort by proximity
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return {
        id: school.id,
        name: school.name,
        address: school.address,
        latitude: school.latitude,
        longitude: school.longitude,
        distance: `${distance} km`
      };
    });

    // Sort schools by distance (closest first)
    schoolsWithDistance.sort((a, b) => {
      const distanceA = parseFloat(a.distance);
      const distanceB = parseFloat(b.distance);
      return distanceA - distanceB;
    });

    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      userLocation: {
        latitude: userLat,
        longitude: userLon
      },
      data: schoolsWithDistance
    });

  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = { addSchool, listSchools };
