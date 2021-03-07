import React from 'react'
import { MDBMask, MDBRow, MDBCol, MDBBtn, MDBView, MDBContainer, MDBAnimation } from "mdbreact";
import laptop from '../laptop.png'
import '../css/Home.css'

const Home = () => {
    return (
        <div id="apppage">
        <MDBView>
          <MDBMask className="d-flex justify-content-center align-items-center gradient">
            <MDBContainer>
              <MDBRow>
                <MDBCol
                  md="6"
                  className="white-text text-center text-md-left mt-xl-5 mb-5"
                >
                  <MDBAnimation type="fadeInLeft" delay=".3s">
                    <h1 className="h1-responsive font-weight-bold mt-sm-5">
                      Buy and Sell Sublets.
                    </h1>
                    <hr className="hr-light" />
                    <h6 className="mb-4">
                      Sublet Me provides an avenue for students to advertise their sublets and filter through a list of available rooms.
                      With interactive features such as anonymous SMS to message tenants and Google Maps to visualize nearby locations, we strive to speed up the subletting process.
                    </h6>
                    <MDBBtn color="white">Check Demo</MDBBtn>
                    <MDBBtn outline color="white">
                      Learn More
                    </MDBBtn>
                  </MDBAnimation>
                </MDBCol>

                <MDBCol md="6" xl="5" className="mt-xl-5">
                  <MDBAnimation type="fadeInRight" delay=".3s">
                    <img
                      src={laptop}
                      alt=""
                      className="img-fluid"
                    />
                  </MDBAnimation>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBMask>
        </MDBView>
      </div>
    )
}

export default Home
