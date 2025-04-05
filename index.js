const express=require("express")
const cors=require("cors")
const bodyParser=require("body-parser")

const { imageRouter } = require("./router/image.route");

const app=express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json())
app.use(cors())

// Add after other middleware
app.use(express.static('public'));  // For static files
app.use('/uploads', express.static('uploads'));  // Serve uploaded files

app.use("/image", imageRouter);

app.get('/',async(req,res)=>{
    //console.log(req.body.userId)
    res.send({"msg":"Welcome to homepage"})
})

app.listen(8080,async(req,res)=>{
try {
    console.log('server started')
} catch (error) {
    console.log('something went wong')
    console.log(error);
}
})



