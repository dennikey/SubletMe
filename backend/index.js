require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const multer = require('multer');
const subletModel = require('./models/subletSchema');
const fs = require('fs'); 
const fetch = require("node-fetch")

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

const dbUrl = process.env.MONGODB_URL
const googleUrl = process.env.GOOGLE_API_KEY2

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
            location: '',
            parking: false,
            internet: false,
            utilities: false
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
            if( text.description.toLowerCase().includes("parking")) {
                outputJson.parking = true;
            }
            if( text.description.toLowerCase().includes("internet") || text.description.toLowerCase().includes("wifi")){
                outputJson.internet = true;
            }
            if( text.description.toLowerCase().includes("utilities")){
                outputJson.utilities = true;
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
        date: dateString,
        parking: req.body.parking,
        bathroom: req.body.bathroom,
        internet: req.body.internet,
        utilities: req.body.utilities,
        description: req.body.description
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

app.get('/api/map/:location', async (req, res) => { 
    try {
        const addresses = ["200 University Ave W, Waterloo, ON N2L 3G1", "170 University Ave W, Waterloo, ON N2L 3E9", "75 University Ave W, Waterloo, ON N2L 3C5", "50 Young St W, Waterloo, ON N2L 2Z4", "200 Ring Rd, Waterloo, ON N2L 3G1"]
        let obj = [];

        /*
        let promisearr = [];
        addresses.forEach((address) => {
            promisearr.push(fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + req.params.location + "&destinations=" + address + "&key=" + googleUrl))
        })

        Promise.all(promisearr).then((info) => {
            info.forEach((stuff) => {
                console.log(stuff.json())
            })
        })
        */
        
        const result1 = await fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + req.params.location + "&destinations=" + addresses[0] + "&key=" + googleUrl)
        const data1 = await result1.json();
        obj.push(data1)
        const result2 = await fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + req.params.location + "&destinations=" + addresses[1] + "&key=" + googleUrl)
        const data2 = await result2.json();
        obj.push(data2)
        const result3 = await fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + req.params.location + "&destinations=" + addresses[2] + "&key=" + googleUrl)
        const data3 = await result3.json();
        obj.push(data3)
        const result4 = await fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + req.params.location + "&destinations=" + addresses[3] + "&key=" + googleUrl)
        const data4 = await result4.json();
        obj.push(data4)
        const result5 = await fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + req.params.location + "&destinations=" + addresses[4] + "&key=" + googleUrl)
        const data5 = await result5.json();
        obj.push(data5);
        
        res.json(obj)
    } catch (err) {
        res.json(err)
    }
})

const Port = 5000

app.listen( Port, () => {
    console.log("Server running on port " + Port);
})