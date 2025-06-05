#  Data Ingestion API System (Node.js + Express)

A RESTful API system for asynchronous data ingestion with batching, priority-based processing, and rate limiting. This project was built using **Node.js**, **Express.js**, and deployed on **Render**.

---

## 🌐 Live Demo

Your API is deployed on Render at:https://data-ingestion-api-igv4.onrender.com

##  Features

- Batch processing with a maximum of 3 IDs per batch
- Rate limit: 1 batch every 5 seconds
- Priority handling: HIGH > MEDIUM > LOW
- Asynchronous background processing
- Real-time status tracking for ingestion requests and their batches
- In-memory data storage (no external DB for simplicity)
- Comprehensive testing to validate rate-limiting, priority ordering, and status accuracy

- ## 🔧 Tech Stack

- Node.js
- Express.js
- `uuid` for ID generation
- `setInterval` for async background processing
  ## request body
  ```json
{
  "ids": [1, 2, 3,4, 5],
  "priority": "HIGH"
}

## POST response (/ingest)
{
  "ingestionId": "52f3f2c5-2d49-47b5-a8be-6d499394fb6c"
}

## get (/status/:id)
{
  "ingestionId": "52f3f2c5-2d49-47b5-a8be-6d499394fb6c",
  "status": "completed",
  "batches": [
    {
      "batchId": "3f53e1a2-a845-4997-9542-f7b1b7981b72",
      "ids": [
        1,
        2,
        3
      ],
      "status": "completed"
    },
    {
      "batchId": "490bd63a-24fc-4a4f-ab02-0ec35a3b747f",
      "ids": [
        4,
        5
      ],
      "status": "completed"
    }
  ]
}



