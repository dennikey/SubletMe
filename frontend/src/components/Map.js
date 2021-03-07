import React, {useState} from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import Modal from 'react-modal'
import 'mdbreact/dist/css/mdb.css'

const MapContainer = ({lat, lng, name, handleClick, modalOpen}) => {
  const [ openMarker, handleMarker ] = useState({})

  const APIKey = 'process.env.apikey'

  const handleOpen = (key) => {
    handleMarker(key)
  }

  const locations = [
    {
      name: "University of Waterloo",
      location: { 
        lat: 43.469761,
        lng: -80.538811
      },
    },
    {
      name: "University Shops Plaza",
      location: { 
        lat: 43.472370, 
        lng: -80.538872
      },
    },
    {
      name: "Wilfred Laurier University",
      location: { 
        lat: 43.474041, 
        lng: -80.527809
      },
    },
    {
      name: "Waterloo Park",
      location: { 
        lat: 43.468170, 
        lng: -80.525630
      },
    },
    {
      name: "Davis Center",
      location: { 
        lat: 43.470631, 
        lng: -80.541382
      },
    }
  ];

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
            locations.map(item => {
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
              location: {lat: lat, lng: lng}
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
                <div>
                  <p><b>{openMarker.name}</b></p>
                </div>
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