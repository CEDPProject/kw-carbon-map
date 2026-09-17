const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/getDeviceMetaApp", async (req, res) => {
    try {
        const { serial } = req.body;
        if (!serial) return res.status(400).json({ error: "serial is required" });

        const url = `https://gateway.kweather.co.kr:8443/iot/air365/v1/station/${serial}?api_key=kw-web-internal`;
        const response = await axios.get(url);
        return res.json(response.data);
    } catch (error) {
        console.error(error?.response?.data || error.message);
        res.status(500).send("API 호출 중 에러가 발생했습니다.");
    }
});

module.exports = router;