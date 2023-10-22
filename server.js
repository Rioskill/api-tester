import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080; 

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/static', express.static("client/dist/static"));

app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, "client/index.html"));
});

app.get('/api', (req, resp) => {
    resp.send({
        "one": 1,
        "two": 2
    });
});
