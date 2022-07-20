const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000
const app = express();


// middleware
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1bmf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const studentsCollection = client.db('student-management').collection('students');

        // get all students
        app.get('/students', async (req, res) => {
            const students = await studentsCollection.find().toArray();
            res.send(students);
        })

        // add new student
        app.post('/students', async (req, res) => {
            const student = req.body;
            const result = await studentsCollection.insertOne(student);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Student Management!');
})

app.listen(port, () => {
    console.log(`Student Management listening on port ${port}`)
})