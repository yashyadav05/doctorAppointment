const express = require('express');
const {  getUserAppointments, getDoctorAppointments, createAppointment, deleteAppointment, updateAppointmentStatus } = require('../controller/appointment');
const { auth } = require('../middleware/jwt');
const router = express.Router();

router.post('/book', auth,createAppointment)
router.get('/getUserAppointments',auth,getUserAppointments)
router.get('/getDoctorAppointments',auth,getDoctorAppointments)
router.post('/deleteAppointment',auth,deleteAppointment)
router.put('/updateStatus',auth,updateAppointmentStatus)

module.exports = router;