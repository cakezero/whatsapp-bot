const express = require("express")
const router = express.Router;
const QR = require("../src/app");

router.get('/genQR', QR.genQR);

module.exports = router;