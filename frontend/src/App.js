import React, { useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import axios from 'axios';
import FormData from 'form-data';

import "bootstrap/dist/css/bootstrap.min.css"

import Home from './components/Home'
import Nav from './components/Nav'
import UploadSublet from './components/uploadSublet'
import ListSublet from './components/listSublet'
import OneSublet from './components/oneSublet'
import Profile from './components/Profile'
import Contact from './components/Contact'

const App = () => {
  const [ open, setOpen ] = useState(false)
  const [ message, setMessage ] = useState('')
  const [ formInfo, setFormInfo ] = useState({
    name: '',
    location: '',
    price: 0,
    phone: '',
    image: [],
    parking: false,
    bathroom: 0,
    internet: false,
    utilities: false,
    description: ""
  })
  const [ sublets, setSublets ] = useState([])
  const [ map, setMap ] = useState(false);
  const [submitForm, setSubmitForm] = React.useState(false);
  const [refreshFetch, setRefreshFetch] = React.useState(0);
  const [images, setImages] = React.useState([]);

  const getSublets = async () => {
    const res = await axios.get('/api/getSublet');
    if(res.data.sublets.length == 0){
      setSublets([5])
    } else{ 
      setSublets(res.data.sublets)
    }
  }

  useEffect( () => {
    getSublets();
  }, [refreshFetch])

  /*
  const allSublets = sublets.length > 0 && sublets.map( (sublet, index) => {
    return <li key={index}>Sublet Name: {sublet.name} Price: {sublet.price} </li>
  })
  */

  const handleSubmit = user => async event => {
    console.log(user);
    event.preventDefault()
    let data = new FormData();
    console.log(images);
    console.log(formInfo);
    images.map((pic)=>{
      data.append("image", pic);
    })

    data.append("name", formInfo.name);
    data.append("location", formInfo.location);
    data.append("price", formInfo.price);
    data.append("phone", formInfo.phone);
    data.append("userName", user.name);
    data.append("email", user.email);
    data.append("parking", formInfo.parking);
    data.append("bathroom", formInfo.bathroom);
    data.append("internet", formInfo.internet);
    data.append("utilities", formInfo.utilities);
    data.append("description", formInfo.description);
    try {
      const response = await axios.post("/api/uploadSublet", data, {
        header: {
          "Content-Type": "multipart/form-data"
        }
      })
      setMessage(response.data.message)
      setSubmitForm(true);
      window.scrollTo(0, 0);
      setRefreshFetch(refreshFetch+1);

      setTimeout(() => {
        setMessage('')
      }, 5000)
      setTimeout(()=>{
        setSubmitForm(false);
      }, 10000)
    } catch (error){
      console.log(error.message);
    }

  }

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleMap = () => {
    setMap(!map)
  }

  const handleForm = (event) => {
    console.log(formInfo);
    if(event.target == undefined){
      console.log("got here");
      setImages(images => images.concat(event));
    } else if (event.target.value == "on"){
      setFormInfo({
        ...formInfo,
        [event.target.name]: event.target.checked
      })
    } else {
    setFormInfo({
      ...formInfo,
      [event.target.name]: event.target.value
    })
  }
  }

  const handleInfo = (name, location, parking, internet, utilities) => {
    setFormInfo({
      ...formInfo,
      name: name, 
      location: location,
      parking: parking,
      internet: internet,
      utilities: utilities
    })
  }

  return (
    <Router>
      <div>
        <Nav open={open} handleOpen={handleOpen} />
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/home">
            <Home/>
          </Route>
          <Route path="/uploadSublet">
            <UploadSublet message={message} handleForm={handleForm} handleSubmit={handleSubmit} submitForm={submitForm} images={images} formInfo={formInfo} handleInfo={handleInfo}/>
          </Route>
          <Route path="/listSublet">
            <ListSublet allSublets={sublets} />
          </Route>
          <Route path="/oneSublet/:contact">
            <OneSublet allSublets={sublets} />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
