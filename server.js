import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080; 

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.json())
app.use('/', express.static("client/dist/"));

app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, "client/index.html"));
});

app.post('/api', (req, resp) => {
    const body = req.body;
    console.log(body);
    resp.send(body);
});
