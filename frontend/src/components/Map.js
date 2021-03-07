import React, {useState} from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import Modal from 'react-modal'
import { MDBCard, MDBCardBody, MDBCardImage, MDBContainer, MDBRow, MDBCol, MDBBtn, MDBAlert, MDBIcon} from 'mdbreact';
import 'mdbreact/dist/css/mdb.css'
import '../css/image.css'

import davis from "../images/davis.jpg"
import waterloo from "../images/waterloo.jpg"
import park from "../images/park.jpg"
import laurier from "../images/laurier.jpg"
import plaza from "../images/plaza.jpg"
import sublet from "../images/sublet.jpg"
import Axios from 'axios';

const MapContainer = ({lat, lng, name, handleClick, modalOpen, location}) => {
  const [ openMarker, handleMarker ] = useState({})
  const [ mapData, setMapData ] = useState([]);

  const APIKey = 'AIzaSyA1dC4kG0MsKVdm0ZiTeFPIXf5LXM7XpFk'

  const handleOpen = (key) => {
    handleMarker(key)
  }

  React.useEffect(()=>{
    const getResult = async () => {
      let result = await Axios.get(`/api/map/${location}`);
      setMapData(result.data);
      console.log(result);
    }
    getResult();
  }, [])

  const locations = [
    {
      name: "University of Waterloo",
      address: "200 University Ave W, Waterloo, ON N2L 3G1",
      image: waterloo,
      location: { 
        lat: 43.469761,
        lng: -80.538811
      },
      index: 0
    },
    {
      name: "University Shops Plaza",
      address: "170 University Ave W, Waterloo, ON N2L 3E9",
      image: plaza,
      location: { 
        lat: 43.472370, 
        lng: -80.538872
      },
      index: 1
    },
    {
      name: "Wilfred Laurier University",
      address: "75 University Ave W, Waterloo, ON N2L 3C5",
      image: laurier,
      location: { 
        lat: 43.474041, 
        lng: -80.527809
      },
      index: 2
    },
    {
      name: "Waterloo Park",
      address: "50 Young St W, Waterloo, ON N2L 2Z4",
      image: park,
      location: { 
        lat: 43.468170, 
        lng: -80.525630
      },
      index: 3
    },
    {
      name: "Davis Center",
      address: "200 Ring Rd, Waterloo, ON N2L 3G1",
      image: davis,
      location: { 
        lat: 43.470631, 
        lng: -80.541382
      },
      index: 4
    }
  ];

  const distanceData = (value) => {
    console.log(value);
    console.log(value.address)
    console.log(location)
    if (mapData.length !== 0 && value.index !== -1 && value.address !== location){
      
      let distance = mapData[value.index].rows[0].elements[0].distance.text;
      let time = mapData[value.index].rows[0].elements[0].duration.text;
      return(
        <div>
          <p class="card-text"><b>Distance Away:</b> {distance}</p>
          <p class="card-text"><b>Time Away:</b> {time}</p>
        </div>
      )
    } else {
      return(
        <div></div>
      )
    }
  }

  const mapStyles = {        
    height: "100vh",
    width: "100%"
  }

  return (
    <div>
      <Modal isOpen={modalOpen} onRequestClose={handleClick}>
        <button class="btn btn-green" onClick={handleClick}>Close Map</button>
        <br></br>
        <br></br>
        <LoadScript
          googleMapsApiKey={APIKey}>
          <GoogleMap
            zoom={13}
            mapContainerStyle={mapStyles}
            center={{
              lat: 43.469761,
              lng: -80.538811
            }}
          >
          {
            locations.map((item, index)=> {
              return (
              <Marker key={item.name} 
                position={item.location}
                onClick={() => handleOpen(item)}
              />
              )
            })
          }
          <Marker
            key={name}
            position={{lat: lat, lng: lng}} 
            onClick={() => handleOpen({
              name: name,
              image: sublet,
              location: {lat: lat, lng: lng},
              address: location
            })}
          />
          {
            openMarker.location && 
            (
              <InfoWindow
                position={openMarker.location}
                clickable={true}
                onCloseClick={() => handleMarker({})}
              >
                <MDBCard>
                  <MDBCardBody>
                    <center>
                    <MDBCardImage className="photo" src={openMarker.image} waves />
                    </center>
                    <br></br>
                    <p className="h5 text-center">{openMarker.name}</p>
                    <hr></hr>
                    <p class="card-text"><b>Address:</b> {openMarker.address}</p>
                    {distanceData(openMarker)}
                  </MDBCardBody>
                </MDBCard>
              </InfoWindow>
            )
          }
          </GoogleMap>
        </LoadScript>
      </Modal>
    </div> 
  )
}

/*
export class MapContainer extends Component {
  render() {
    const [ openMarker, handleMarker ] = useState('')

    const handleOpen = (key) => {
      handleMarker(key)
    }

    return (
      <div>
        <Modal isOpen={this.props.modalOpen} onRequestClose={this.props.handleClick}>
          <button class="btn btn-green" onClick={this.props.handleClick}>Close Map</button>
          <Map google={this.props.google} initialCenter={{
            lat: 43.469761,
            lng: -80.538811
          }} zoom={14}>
            <Marker
              name={'University of Waterloo'}
              position={{lat: 43.469761, lng: -80.538811}} />
              {openMarker == this.name && (
              <InfoWindow onClick={() => handleOpen(this.name)}>
                <span>{this.name}</span>
              </InfoWindow>
              )}
            <Marker />
            <Marker
              name={'University Shops Plaza'}
              position={{lat: 43.472370, lng: -80.538872}} />
            <Marker />
            <Marker
              name={'Wilfrid Laurier University'}
              position={{lat: 43.474041, lng: -80.527809}} />
            <Marker />
            <Marker
              name={this.props.name}
              position={{lat: this.props.lat, lng: this.props.lng}} />
            <Marker />
          </Map>
        </Modal>
        
      </div>
      
    );
  }
}
*/

export default MapContainer