import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws'; 

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

app.use(express.json());

app.get('/', (req, res) => {
    res.send('HEllo');
})

app.post('/test', (req, res) => {
    console.log(JSON.parse(req.body));
    res.json({
        data: 'ok'
    });
});

const clients = new Map();

wss.on('connection', (ws) => {

    ws.on('message', (msg) => {
        const parsedMessage = JSON.parse(msg);
        const { type, channel, message, to } = parsedMessage;
        console.log(parsedMessage);
        if (type === 'subscribe') {
            clients.set(channel, ws);
            return;
        } 
        if (!clients.get(to)) {
            console.log('no clients found');
            return;
        }
        console.log('sending to ', to, ' message: ', message, ' from: ', channel);
        clients.get(to).send(JSON.stringify(message));
    })

    ws.on('disconnect', () => {
        console.log('disconnected');
    })
})

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});
