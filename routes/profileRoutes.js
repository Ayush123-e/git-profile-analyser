const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/analyze/:username', profileController.analyzeProfile);
router.get('/profiles', profileController.getAllProfiles);
router.get('/profile/:username', profileController.getProfileByUsername);
router.delete('/profiles/:username', profileController.deleteProfile);
router.delete('/profile/:username', profileController.deleteProfile);

module.exports = router;
