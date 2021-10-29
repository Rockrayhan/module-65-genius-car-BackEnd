const express = require('express'); // 1
const { MongoClient } = require('mongodb'); // 2 connect
require('dotenv').config()      // 2 ( for env ) 
const cors = require('cors'); // 1
const app = express(); // 1
const port = process.env.PORT ||  5000; // 1
const ObjectId = require('mongodb').ObjectId ; // 7 (id er vitorer obj er jonno)

app.use(cors()); // 1
app.use(express.json());  // 1 json converter



// 2 ( connect using environment veriable )
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shqkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
// 3 (creating DB)
        const database = client.db('carMechanic-2');
        const servicesCollection = database.collection('services');
//3

    // 6 GET API ( to get data from DB )
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })
    // 7 GET Single Services
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id ;
            console.log('id', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query) ;
            res.json(service)
        })    

    // 4 POST API ( to insert data in DB )
        app.post('/services', async (req, res) => {
            const service = req.body ;  // 5 req er body=service
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            // res.send('post hitted') //4            
            res.json(result);   // 5 
        });
    // 8 DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query) ;
            res.json(result)
        })    
        
    }
    finally {
        // await client.close() ;
    }
}

run().catch(console.dir);
// 2

app.get('/', (req, res) => {
    res.send('requist has been hitted') // 1
})

app.get('/hello', (req, res)=> {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('port has been hitted', port); // 1
})