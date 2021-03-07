import React, {useCallback, useMemo, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBCol, MDBBtn, MDBAlert, MDBInput} from 'mdbreact';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react"
import "../css/Home.css"

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};
  
const activeStyle = {
    borderColor: '#2196f3'
};
  
const acceptStyle = {
    borderColor: '#00e676'
};
  
const rejectStyle = {
    borderColor: '#ff1744'
};

const DropImage = ({images, handleForm}) => {


    const onDrop = useCallback(acceptedFiles => {
        handleForm(acceptedFiles);
    }, [])

    const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({onDrop})

    const [showResult, setShowResult] = React.useState(false); 

    useEffect(()=>{
    if(images.length === 0){
        setShowResult(false);
    }  else {
        setShowResult(true);
    }
   }, [images])

   const style = useMemo(() => ({
        ...baseStyle,
    }));

    const uploadPicture = () => {
      if(showResult){
          return(
              <div className="container">
            <div {...getRootProps(style)}>
            <input {...getInputProps()} />
           {
               images.map((image, index)=>{
                  console.log(image.name);
                  return(
                  <div key={index}>
                      <p>{image.name}</p>
                    </div>
                   )
               })
           }
           </div>
           </div>
          )
        } else {
          return (
                <div className="container">
                    <div {...getRootProps({style})}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                    </div>
                </div>
          )
      }
    }

    return(
        <React.Fragment>
            {uploadPicture()}
        </React.Fragment>
    )
}

const UploadSublet = ({ message, handleInfo, formInfo, handleForm, handleSubmit, submitForm, images}) => {
  const { user, isAuthenticated} = useAuth0();
  const [base64, setBase64] = useState('')
  const [imageinfo, setImageInfo] = useState({})
  const [parkingResult, setParkingResult] = useState(false);
  const [internetResult, setInternetResult] = useState(false);
  const [utilitiesResult, setUtilitesResult] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                setBase64(reader.result.replace("data:image/png;base64,", ""))
            }
            reader.readAsDataURL(file)
        })
    }, [])

    const handleImage = async () => {
        if (base64 != '') {
            const body = JSON.parse(JSON.stringify({
                imageURL: base64
            }))

            const res = await axios.post("/api/uploadSublettest", body)
            if(res.data.data.parking == true){
                setParkingResult(true);
            }

            setImageInfo(res.data.data)
            handleInfo(res.data.data.name, res.data.data.location, res.data.data.parking, res.data.data.internet, res.data.data.utilities)
            console.log(res.data.data)
        }
    }

    useEffect(() => {
        console.log(base64)
        handleImage()
    }, [base64])
  
    const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({onDrop})
  
  useEffect(()=>{
      setParkingResult(formInfo.parking);
      setInternetResult(formInfo.internet);
      setUtilitesResult(formInfo.utilities);
  }, [formInfo])
  
    useEffect(()=>{
        console.log(user);
    }, [])

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    if(isAuthenticated) {

    return (
        <MDBContainer>
            {submitForm && <MDBAlert color="success" dismiss>
                Form Successfully Submitted
            </MDBAlert>}
            <div style={{padding: '20px'}}>
            </div>
            <MDBRow>
                <MDBCol md="3"></MDBCol>
                <MDBCol md="6">
                <MDBCard>
                <MDBCardBody>
                <p className="h4 text-center py-4">Upload Your Facebook Post</p>
                <div className="container">
                    <div {...getRootProps({style})}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                    </div>
                </div>
                </MDBCardBody>
                </MDBCard>
                <div style={{padding: '20px'}}>
                </div>
                <MDBCard>
                <MDBCardBody>
                <form onSubmit={handleSubmit(user)}>
                    <p className="h4 text-center py-4">Upload Your Sublet</p>
                        <label htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light">
                            Sublet Name
                        </label>
                        <input required type="text" value={formInfo.name} id="defaultFormCardNameEx" className="form-control" name="name" onChange={handleForm} />
                    <br />
                        <label htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light">
                            Sublet Location
                        </label>
                        <input required type="text" value={formInfo.location} id="defaultFormCardNameEx" className="form-control" name="location" onChange={handleForm}/>
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
                    <br />
                        <label htmlFor="defaultFormCardNumberEx" className="grey-text font-weight-light">
                            Number of Bedrooms
                        </label>
                        <input required type="number" id="defaultFormCardNumberEx" className="form-control" name="bathroom" onChange={handleForm}/>
                    <br />
                    <div style={{display: "inline-block"}}>
                        <label class="special">
                            <p style={{fontSize: "17px", textAlign: "center"}} className="grey-text font-weight-light">&nbsp; Parking Offered &nbsp;</p>
                        <input type="checkbox" checked={parkingResult} name="parking" onChange={handleForm}/>
                        <span class="checkmark"></span>
                        </label>
                     </div>
                     <div style={{display: "inline-block"}}>
                        <label class="special">
                            <p style={{fontSize: "17px", textAlign: "left"}} className="grey-text font-weight-light">&nbsp; Internet Included &nbsp;</p>
                        <input type="checkbox" checked={internetResult} name="internet" onChange={handleForm}/>
                        <span class="checkmark"></span>
                        </label>
                    </div>
                    <div style={{display: "inline-block"}}>
                        <label class="special">
                            <p style={{fontSize: "17px", textAlign: "left"}} className="grey-text font-weight-light">&nbsp; Utilities Included</p>
                        <input type="checkbox" checked={utilitiesResult} name="utilities" onChange={handleForm}/>
                        <span class="checkmark"></span>
                        </label>
                    </div>
                    <label htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light" style={{display: "block"}}>
                        Short Description
                    </label>
                    <textarea id="defaultFormCardNameEx" className="form-control" name="description" cols="58" rows="5" value={formInfo.description} onChange={handleForm}></textarea>
                    <br></br>
                    <label style={{display: "block"}} htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light">
                        Upload Pictures
                    </label>
                    <DropImage images={images} handleForm={handleForm}/>
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
                <div style={{padding: '20px'}}>
                </div>
                </MDBCol>
                <MDBCol md="3"></MDBCol>
            </MDBRow>
        </MDBContainer>
    )
                    } else{
                        return(
                            <MDBContainer style={{marginTop: "100px"}}>
                                 <MDBCard>
                <MDBCardBody >
                <h3>ERROR: Please Authenticate as A User Before Uploading a Sublet</h3>
                </MDBCardBody>
                </MDBCard>
                            </MDBContainer>
                        )
                    }
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
