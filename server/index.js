const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // For parsing incoming request to backend bodies
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Ensure you are using dotenv to load the .env file

app.use(cors());
app.options('*', cors()); // Enable CORS for all requests



// Middleware
app.use(bodyParser.json());
app.use(express.json());

// app.get('/',(req,res)=>{
//     res.json({status:"success"})
// })

// DATABASE Connection
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Database connection is ready...');
        // Start the server only after DB connection
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
