require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const multer = require('multer');
const subletModel = require('./models/subletSchema');
const fs = require('fs'); 

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

const dbUrl = process.env.MONGODB_URL


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
let upload = multer({ storage: storage });

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log('MongoDB is connected')
    } catch (error) {
        console.log(error)
    }
}

connectDB()

app.post('/api/messages', async (req, res) => {
    res.header('Content-Type', 'application/json');
    client.messages
        .create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: req.body.to,
            body: req.body.body
        })
        .then(() => {
            res.send(JSON.stringify({ success: true }));
        })
        .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
});

app.post('/api/uploadSublettest', async (req, res) => {
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();

    try {
        console.log("got here");
        console.log(req.body.imageURL);
        const [result] = await client.textDetection(
            {
              image: {
                content: req.body.imageURL
              }
            }
        );
        const detections = result.textAnnotations;
        let outputJson = {
            name: '',
            location: ''
        };
        detections.forEach(text => {
            if (text.description == 'Fergus') {
                outputJson.name = 'Rez-One Fergus House'
                outputJson.location = '254 Phillip St, Waterloo, ON N2L 0E1'
            }
            if (text.description == 'Blair') {
                outputJson.name = 'Rez-One Blair House'
                outputJson.location = '256 Phillip St, Waterloo, ON N2L 6B6'
            }
            if (text.description == 'Hespeler') {
                outputJson.name = 'Rez-One Hespeler House'
                outputJson.location = '252 Phillip St, Waterloo, ON N2L 6B6'
            }
        });
        res.send(JSON.stringify({data: outputJson}))
    } catch (error) {
        console.log(error)
        res.send({error: error})
    }
})

app.get('/api/getSublet', async (req, res) => {
    try{
        let results = await subletModel.find();
        res.json({
            success: true,
            sublets: results
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            error: error.message
        })
    }
});

app.post('/api/uploadSublet', upload.array('image'), (req, res, next) => {
    let obj = {};
    let date = new Date();
    let dateString = date.toString();
    obj = {
        name: req.body.name,
        location: req.body.location,
        price: req.body.price,
        phone: req.body.phone,
        image: req.files.map((file)=>{return{
                data: fs.readFileSync('./uploads/' + file.filename),
                contentType: file.mimetype
            }
            }
        ),
        userName: req.body.userName,
        email: req.body.email,
        date: dateString
    }
    subletModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
            res.json({sucess: false, error: err});
        }
        else {
            req.files.map((file)=>{
                fs.unlinkSync('./uploads/'+file.filename);
            })
            // item.save();
            res.json({sucess: true});
        }
    });
});

const Port = 5000

app.listen( Port, () => {
    console.log("Server running on port " + Port);
})