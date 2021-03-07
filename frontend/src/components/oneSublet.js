import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol, MDBCardFooter, MDBBtn, MDBIcon,  MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBView } from 'mdbreact'
import 'mdbreact/dist/css/mdb.css'
import MapContainer from './Map'
import MessageContainer from './Message'
import Geocode from "react-geocode"
import '../css/Home.css';

const OneSublet = ({allSublets}) => {
    const [ map, setMap ] = useState(false)
    const [ sms, setSms ] = useState(false)
    /* Default Address for Rez-One Hespeler */
    const [ latitude, setLat ] = useState(43.473520)
    const [ lngitude, setLng ] = useState(-80.535750)
    const [ images, setImages ] = useState([]);
    let params = useParams();

    const [subletinfo, setSubletInfo] = useState({});

    Geocode.setApiKey(process.env)

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

    useEffect(()=>{
        let tempResult = allSublets.find(sublet => sublet.phone == params.contact);
        console.log(tempResult);
        setSubletInfo(allSublets.find(sublet => sublet.phone == params.contact));
        console.log(tempResult);
        setImages(tempResult.image)
    }, [allSublets])

    let arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    const handleClick = () => {
        setMap(!map)
    }

    const handleClick2 = () => {
        setSms(!sms)
    }

    const showDetails = () => {
        if((subletinfo.parking==undefined) || (subletinfo.bathroom ==undefined)){
            return(
                <MDBCardText style={{marginBottom: "0px", paddingBottom: "0px"}}>No Information on Washroom or parking</MDBCardText>
            )
        } else {
            return(
                <MDBCardText style={{marginBottom: "0px", paddingBottom: "0px"}}>Bathrooms: {subletinfo.bathroom} &nbsp; Parking: {subletinfo.parking ? "Available" : "Not Available"} 
                &nbsp; Internet: {subletinfo.internet ? "Included" : "Not Included"}
                &nbsp; Utilities: {subletinfo.laundry ? "Included" : "Not Included"}
                </MDBCardText>
            )
        }
    }

    const showDescription = () => {
        return(
            <MDBCardText style={{marginBottom: "0px", paddingBottom: "0px"}}>Short Description: {subletinfo.description} </MDBCardText>
        )
    }

    const showTime = () => {
        if(subletinfo.date == undefined){
            return(
                <p>No Time Data Available</p>
            )
        } else if (subletinfo.userName != undefined){
            return(
                <p>Posted on {subletinfo.date} by {subletinfo.userName}</p>
            )
        } else {
            return(
                <p>Posted on {subletinfo.date}</p>
            )

        }
    }

    const showPictures = () => {
        return(
            <div>
            <MDBContainer>
      <MDBCarousel
        activeItem={1}
        length={images.length}
        showControls={true}
        showControls multi slide nav-class="red" indicatorClass="red"
      >
        <MDBCarouselInner>
        {images.map((image, index)=>{
            let base64Flag = 'data:imge/jpeg;base64,';
            let imgStr = arrayBufferToBase64(image.data.data);
            let imgInfo = base64Flag + imgStr;
            console.log(index);
            return(
                <MDBCarouselItem key={index} itemId={index+1}>
                    <MDBView>
                        <center>
                        <div style={{width: "500px", height: "400px", marginBottom: "20px"}}>
                            <center>
                        <img
                        className="d-block w-100"
                        src={imgInfo}
                        alt="First slide"
                        style={{maxHeight: "400px", maxWidth: "500px", height: "auto",
                                position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "0",
                            margin: "auto"}}
                        />
                        </center>
                     </div>
                     </center>
                    </MDBView>
                </MDBCarouselItem>
            )
        })}
        </MDBCarouselInner>
      </MDBCarousel>
    </MDBContainer>
    </div>
        )
    }

    return (
        <div style={{paddingBottom: "30px"}}>
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
                            {showDetails()}
                            {!(map || sms || images.length === 0) ? showPictures() : null}
                            {showDescription()}
                            <br></br>
                            <center>
                                <button class="btn btn-green" onClick={handleClick2}>Contact the Tenant</button>
                                <button class="btn btn-green" onClick={handleClick}>Show Map</button>
                                {(subletinfo.email !== undefined) && (<a href={"mailto:" + subletinfo.email}><button class="btn btn-green">Send Email</button></a>)}
                            </center>
                        </MDBCardBody>
                        <MDBCardFooter small muted>
                           {showTime()}
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="1"></MDBCol>
            </MDBRow>
        </MDBContainer>
        </div>
    )
}

export default OneSublet