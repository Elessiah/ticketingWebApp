const express = require('express');
const app = express();
const PORT = process.env.PORT || 5173;

app.get('/api/login', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

