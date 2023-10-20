const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(express.json());
app.use(cors());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqbtto6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("productsDB");
        const productCollection = database.collection("product");
        const brandCollection = database.collection("brand");
        const cartProductCollection = database.collection("cartProduct");

        // const brands=[
        //     {id:1 ,brandName:"Mercedes-Benz",photo:"https://i.ibb.co/FJJDGRv/55022df90a344617fa1246a942ec0169.png"},

        //     {id:2 ,brandName:"Ford",photo:"https://i.ibb.co/hRFsGQB/fordlogo.webp"},

        //     {id:3 ,brandName:"BMW",photo:"https://i.ibb.co/N9YMn5z/bmwlogo.webp"},

        //     {id:4 ,brandName: "Tesla",photo:"https://i.ibb.co/vQQ7JgY/images.jpg"},

        //     {id:5 ,brandName: "Toyota",photo:"https://i.ibb.co/qWq3vLx/toyotalogo.webp"},
        //     {id:6 ,brandName:"Mercedes-Benz",photo: "https://i.ibb.co/pwgsy2G/Honda-Motorcycle-Logo.webp"}
        // ]

        app.post('/products', async (req, res) => {
            const newProduct = req.body
            console.log(newProduct)
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })
        


        
        // app.get('/products',async(req,res)=>{
        //     productCollection.find({ brandName: brandName }, (err, products) => {
        //         if (err) {
        //           res.status(500).send('Error querying the database.');
        //         } else {
        //           res.send(products);
        //         }
        //       });
        // })
        // app.get('/products',async(req,res)=>{
        //     const brandName=req.params.brand
        //     console.log(brandName)
        //      const  query = { brandName: brandName };
        //     const cursor = productCollection.find();
        //     const result= await cursor.toArray()
        //     res.send(result)
        // })
        app.get('/products/brand', async (req, res) => {
            let products = {};
            if (req.query.brandId) {
                products = {
                    brandName: req.query.brandId
                }
            }
            const cursor = productCollection.find(products);
            const result = await cursor.toArray()
            res.send(result);
        })
        // app.get('/products/brand', async (req, res) => {
        //     let products = {};
        //     if (req.query.brandId) {
        //         products = {
        //             brandId: req.query.brandId
        //         }
        //     }
        //     const cursor = productCollection.find(products);
        //     const result = await cursor.toArray()
        //     res.send(result);
        // })

        app.get('/brands',async(req,res)=>{
            const cursor = brandCollection.find();
            const result= await cursor.toArray()
            res.send(result)
        })

        app.put('/products/:id',async(req,res)=>{
            const id=req.params.id
            const filter={_id: new ObjectId(id)}
            const options={ upsert:true }
            const updatedProduct=req.body
            const product={
                $set:{
                    photo:updatedProduct.photo,
                    type:updatedProduct.type,
                     brandName:updatedProduct.brandName,
                    rating:updatedProduct.rating,
                     productName:updatedProduct.productName,
                     shortDescription:updatedProduct.shortDescription,
                     price:updatedProduct.price
                }

            }

            const result=await productCollection.updateOne(filter,product,options)
            res.send(result)
        })

        app.get('/products/:id', async(req,res)=>{
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result=await productCollection.findOne(query)
            res.send(result)
        })



        app.post('/cartProducts',async(req,res)=>{
            console.log(req.body)
            const cartProduct=req.body
            const result=await cartProductCollection.insertOne(cartProduct)
            res.send(result)
        })

        app.get('/cartProducts', async (req,res)=>{
            const cursor =cartProductCollection.find()
            const result=await cursor.toArray()
            res.send(result)
        })
     
        app.delete('/cartProducts/:id',async(req,res)=>{
            const id=req.params.id
            const query={ _id : new ObjectId(id)}
            const result = await cartProductCollection.deleteOne(query);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db ("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Automotive server is running')
})

app.listen(port, () => {
    console.log(`Automotive server is running on port:${port}`)
})