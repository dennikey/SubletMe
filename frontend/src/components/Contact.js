import React from "react"
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon, MDBBtn, MDBInput } from "mdbreact"

const Contact = () => {
  return (
      <div>
          <br></br>
          <br></br>
      <MDBRow>
        <MDBCol md="2"></MDBCol>
        <MDBCol md="8" className="lg-0 mb-4">
          <MDBCard>
            <MDBCardBody>
                <h3 className="mt-2">
                  <MDBIcon icon="envelope" /> Contact Us 
                </h3>
              <p className="dark-grey-text">
              If there are any bugs with any of our features, please let us know!
              </p>
              <div className="md-form">
                <MDBInput
                  icon="user"
                  label="Your name"
                  iconClass="grey-text"
                  type="text"
                  id="form-name"
                />
              </div>
              <div className="md-form">
                <MDBInput
                  icon="envelope"
                  label="Your email"
                  iconClass="grey-text"
                  type="text"
                  id="form-email"
                />
              </div>
              <div className="md-form">
                <MDBInput
                  icon="tag"
                  label="Subject"
                  iconClass="grey-text"
                  type="text"
                  id="form-subject"
                />
              </div>
              <div className="md-form">
                <MDBInput
                  icon="pencil-alt"
                  label="Icon Prefix"
                  iconClass="grey-text"
                  type="textarea"
                  id="form-text"
                />
              </div>
              <div className="text-center">
                <MDBBtn color="light-blue">Submit</MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="2"></MDBCol>
      </MDBRow>
      </div>
  );
}

export default Contact;