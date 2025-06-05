const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8000;
app.use(express.json());

// Define priority levels (
const PRIORITY = { HIGH: 1, MEDIUM: 2, LOW: 3 };

let ans=0;
let allIngestions = {};


let batchQueue = [];

// Endpoint to submit ingestion request
app.post('/ingest', (req, res) => {
    const { ids, priority } = req.body;
    const ingestionId = uuidv4();
    const requestTime = Date.now();

    const batches = [];

    //taking 3 id at time as given ,making it batch of 3
    for (let i = 0; i < ids.length; i += 3) {
        const batch = {
            batchId: uuidv4(),
            ids: ids.slice(i, i + 3),
            status: 'yet_to_start',
            priority: PRIORITY[priority], // convert priority text to number
            createdAt: requestTime,
            ingestionId
        };
        batches.push(batch);
        batchQueue.push(batch);
    }

    allIngestions[ingestionId] = { ingestionId, batches };

    res.json({ ingestionId });
});

// ingestion endpoint
app.get('/status/:ingestionId', (req, res) => {
    const { ingestionId } = req.params;
    const ingestion = allIngestions[ingestionId];

    if (!ingestion) {
        return res.status(404).json({ error: 'Invalid ingestion ID' });
    }

    const batchStatuses = ingestion.batches.map(batch => batch.status);

    //check status
    let overallStatus = 'yet_to_start';
    if (batchStatuses.every(status => status === 'completed')) {
        overallStatus = 'completed';
    } else if (batchStatuses.some(status => status === 'triggered' || status === 'completed')) {
        overallStatus = 'triggered';
    }

    res.json({
        ingestionId,
        status: overallStatus,
        batches: ingestion.batches.map(({ batchId, ids, status }) => ({ batchId, ids, status }))
    });
});

// Function that processes batches from the queue continuously
function processBatches() {
    setInterval(() => {
        if (batchQueue.length === 0) return;

        
        batchQueue.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return a.createdAt - b.createdAt;
        });

        const currentBatch = batchQueue.shift();
        currentBatch.status = 'triggered';

        console.log(`Processing batch: ${currentBatch.batchId} with IDs ${currentBatch.ids}`);

        
        setTimeout(() => {
            currentBatch.status = 'completed';
            console.log(`Completed batch: ${currentBatch.batchId}`);
        }, 2000);

    }, 5000); //5 second as told
}


processBatches();

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
