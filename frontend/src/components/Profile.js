import React from 'react'
import {  MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact"
import { useAuth0 } from "@auth0/auth0-react"

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }
    
    console.log(user)

    return (
        isAuthenticated && (
            <div>
            <br></br>
            <br></br>
            <MDBRow>
                <MDBCol md="2"></MDBCol>
            <MDBCol md="8">
            <MDBCard>
            <MDBCardBody>
              <img
                tag="img"
                src={user.picture}
                className="rounded-circle z-depth-1 img-fluid"
                alt={user.name}
              />
              <h5 className="font-weight-bold mt-4 mb-3">{user.name}</h5>
              <p className="text-uppercase blue-text">{user.email}</p>
              <p className="grey-text">
                I love creating side projects!
              </p>
              <ul className="list-unstyled mb-0">
                <a href="#!" className="p-2 fa-lg">
                  <MDBIcon fab icon="facebook-f" className="blue-text" />
                </a>
                <a href="#!" className="p-2 fa-lg">
                  <MDBIcon fab icon="twitter" className="blue-text" />
                </a>
                <a href="#!" className="p-2 fa-lg">
                  <MDBIcon fab icon="instagram" className="blue-text" />
                </a>
              </ul>
              
            </MDBCardBody>
            </MDBCard>
            </MDBCol>
            <MDBCol md="2"></MDBCol>
            </MDBRow>
            </div>
        )
    )
}

export default Profile;