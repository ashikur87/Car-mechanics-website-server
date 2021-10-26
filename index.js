const express=require('express');
const { MongoClient } = require('mongodb');
//for single service start
const ObjectId=require('mongodb').ObjectId;
//for single service end
const cors=require('cors')
//secure database without username and pw enter git start
//1.dotenv search and install here
//2.dot env createfile 
//3.const uri te "" eta bad diye ~~ eta use korte hobe.
require('dotenv').config()
//secure db end
const app=express();
const port=process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

//user:Genius-car-mechanics
//pw:uzd3lkCcv6CvQlAC
//secure database without username and pw enter git start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8kme4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri); check
//secure db end

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
//----------node mongodb connect---------for async
async function run(){
    try{
        await client.connect();
        // console.log('connected to db'); check
       const database=client.db('carMechanics') ;
       const servicesCollection=database.collection('services');
       //-------------GET API--------------------
       app.get('/services',async(req,res)=>{
           //if you want to get data from database then you work same work..
        // node mongo search google then->usage example->find operation->find multiple doc
           const cursor=servicesCollection.find({});//if you find all data then use empty object
           const services=await cursor.toArray();
           res.send(services);
       })
       //----------GET SINGLE SERVICE from express routing such as app.get-----------
       app.get('/services/:id' ,async(req,res)=>{
           const id=req.params.id;
           console.log('specifiq id',id)
           const query={_id:ObjectId(id)};
           const service=await servicesCollection.findOne(query);
           res.json(service);
       })

       //------------POST API from express routing such as app.post----------------
       app.post('/services',async(req,res)=>{
           const service=req.body;
           console.log('service',service)
        console.log('hit the post');
        

           const result=await servicesCollection.insertOne(service);
           console.log(result);
        //    res.send('post hitted')
           res.json(result)
       });
       //------DELETE API from express routing such as app.delete-------
       app.delete('/services/:id',async(req,res)=>{
         const id=req.params.id; 
         const query={_id:ObjectId(id)};
         const result= await servicesCollection.deleteOne(query);
         res.json(result); 
    })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);
app.get('/',(req,res)=>{
    
    res.send('running genius server')
});
app.get('/hello',(req,res)=>{
    
    res.send('hello world!!')
});
app.listen(port,()=>{
    console.log('response done',port);
})