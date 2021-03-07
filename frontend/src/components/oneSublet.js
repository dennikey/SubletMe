import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol, MDBCardFooter, MDBBtn, MDBIcon } from 'mdbreact'
import 'mdbreact/dist/css/mdb.css'
import MapContainer from './Map'
import MessageContainer from './Message'
import Geocode from "react-geocode"

const OneSublet = ({allSublets}) => {
    const [ map, setMap ] = useState(false)
    const [ sms, setSms ] = useState(false)
    /* Default Address for Rez-One Hespeler */
    const [ latitude, setLat ] = useState(43.473520)
    const [ lngitude, setLng ] = useState(-80.535750)

    let params = useParams();

    const subletinfo = allSublets.find(sublet => sublet.phone == params.contact)

    Geocode.setApiKey('AIzaSyA1dC4kG0MsKVdm0ZiTeFPIXf5LXM7XpFk')

    useEffect(() => {
        Geocode.fromAddress(subletinfo.location).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location
                setLat(lat)
                setLng(lng)
            },
            error => {
                console.error(error)
            }
        )
    }, [])

    const handleClick = () => {
        setMap(!map)
    }

    const handleClick2 = () => {
        setSms(!sms)
    }

    return (
        <MDBContainer>
            <div style={{padding: '20px'}}>
            </div>
            <MDBRow>
                <MDBCol md="1"></MDBCol>
                <MDBCol md="10">
                    <MDBCard>
                        <MDBCardBody>
                            {map ? <MapContainer lat={latitude} lng={lngitude} name={subletinfo.name} handleClick={handleClick} modalOpen={map}/> : null} 
                            {sms ? <MessageContainer phone={subletinfo.phone} handleClick={handleClick2} modalOpen={sms}/> : null}
                            <p className="h4 text-center py-4">Sublet Information</p>
                            <MDBCardTitle>{subletinfo.name} (${subletinfo.price})</MDBCardTitle>
                            <hr></hr>
                            <p className="lead">Address: {subletinfo.location}</p>
                            <br></br>
                            <button class="btn btn-green" onClick={handleClick2}>Contact the Tenant</button>
                            <button class="btn btn-green" onClick={handleClick}>Show Map</button>
                        </MDBCardBody>
                        <MDBCardFooter small muted>
                            Updated 1 hour ago
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="1"></MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}

export default OneSublett