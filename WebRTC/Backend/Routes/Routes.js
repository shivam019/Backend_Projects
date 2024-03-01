const app = require('../server').app;
const jwt = require('jsonwebtoken');

const linkSecret = "fdfdf4d5fd8fd8fsfsfs";

app.get("/test", (req, res) => {
    res.json("Test route");
});

app.get("/user-link", (req, res) => {
    const apptData = {
        // Data for end user Appointment
        professionalFullName: "Shivam",
        apptDate: Date.now()
    };

    // Encode data in token
    const token = jwt.sign(apptData, linkSecret);
    res.send('https://localhost:5173/join-video?token=' + token);
});

app.post("/validate-link", (req, res) => {
    // Get the token from the body of the post request
    const token = req.body.token;

    try {
        const decodedData = jwt.verify(token, linkSecret);
        res.json(decodedData);
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
});
