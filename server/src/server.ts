import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { isJson } from './utils';
import { BodyComparator, Comparator, JSONComparator, JSONDeepComparator } from './comparators';
import { Tester } from './tester';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000; 

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.json())
app.use('/', express.static("../client/dist/"));

app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, "client/index.html"));
});

const bodyComparator = new JSONDeepComparator();
const tester = new Tester(bodyComparator);

app.post('/api', async (req, resp) => {
    const {response, result} = await tester.makeTest({
        url: req.body.url,
        method: req.body.method,
        params: req.body.request.params,
        targetBody: req.body.response.body
    })
    
    resp.send({
        request: req.body,
        response,
        result
    });
});
