import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
const app = express();
const httpServer = createServer(app);

app.get('/', (req, res) => {
    res.cookie('auth_token', 'some long token value to be sent to cross domain', {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        sameSite: "none",
        secure: "true"
    });
    res.sendFile(__dirname + 'index.html');
})

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});
