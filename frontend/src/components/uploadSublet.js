import React from 'react'
import { MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact'

const UploadSublet = ({ message, handleForm, handleSubmit}) => {
    return (
        <MDBContainer>
            <div style={{padding: '20px'}}>
            </div>
            <MDBRow>
                <MDBCol md="3"></MDBCol>
                <MDBCol md="6">
                <MDBCard>
                <MDBCardBody>
                <form onSubmit={handleSubmit}>
                    <p className="h4 text-center py-4">Upload Your Sublet</p>
                        <label htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light">
                            Sublet Name
                        </label>
                        <input required type="text" id="defaultFormCardNameEx" className="form-control" name="name" onChange={handleForm} />
                    <br />
                        <label htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light">
                            Sublet Location
                        </label>
                        <input required type="text" id="defaultFormCardNameEx" className="form-control" name="location" onChange={handleForm}/>
                    <br />
                        <label htmlFor="defaultFormCardNumberEx" className="grey-text font-weight-light">
                            Lease Price
                        </label>
                        <input required type="number" id="defaultFormCardNumberEx" className="form-control" name="price" onChange={handleForm}/>
                    <br />
                        <label htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light">
                            Your Phone Number
                        </label>
                        <input required type="text" id="defaultFormCardNameEx" className="form-control" name="phone" onChange={handleForm} />
                    <div className="text-center py-4 mt-3">
                    <MDBBtn className="btn btn-outline-green" type="submit">
                        Submit
                    </MDBBtn>
                    </div>
                    { message
                    ? <p className="h4 text-center py-4">{message}</p>
                    : null}
                </form>
                </MDBCardBody>
                </MDBCard>
                </MDBCol>
                <MDBCol md="3"></MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}


/*
<form onSubmit={handleSubmit}>
            <div>
                name: <input required type="text" name="name" onChange={handleForm}/>
            </div>
            <div>
                location: <input required type="text" name="location" onChange={handleForm}/>
            </div>
            <div>
                price: <input required type="number" name="price" onChange={handleForm} />
            </div>
            <div>
                phone number: <input required type="text" name="phone" onChange={handleForm} />
            </div>
            <div>
                <button type="submit">submit</button>
            </div>
</form>
*/
export default UploadSublet