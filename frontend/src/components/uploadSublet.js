import React, {useCallback, useMemo, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBCol, MDBBtn, MDBAlert, MDBIcon} from 'mdbreact';
import axios from 'axios';

const DropImage = ({images, handleForm}) => {
    const onDrop = useCallback(acceptedFiles => {
        handleForm(acceptedFiles);
    }, [])

    const {getRootProps, getInputProps, isDragOn} = useDropzone({onDrop})

    const [showResult, setShowResult] = React.useState(false); 

    useEffect(()=>{
    if(images.length === 0){
        setShowResult(false);
    }  else {
        setShowResult(true);
    }
   }, [images])

 

    const uploadPicture = () => {
      if(showResult){
          return(
            <div {...getRootProps()}>
            <input {...getInputProps()} />
           {
               images.map((image, index)=>{
                  console.log(image.name);
                  return(<div key={index} style={{display: "flex"}}>
                      <p>{image.name}</p>
                      <img style={{height: "20px", width:"20px", float:"right"}} src={"https://haisla.ca/wp-content/uploads/2019/09/garbage-icon.png"}></img>
                      <div style={{clear: "right"}}>
                    </div>
                      </div>)
               })
           }
           </div>
          )
        } else {
          return (
            <div {...getRootProps()}>
            <input {...getInputProps()} />
           {
               isDragOn ?
               <p>Drop the files here ...</p> :
               <p>Drag 'n' drop some files here, or click to select files</p>
           }
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

const UploadSublet = ({ message, handleInfo, formInfo, handleForm, handleSubmit, submitForm, images}) => {
  const [base64, setBase64] = useState('')
  const [imageinfo, setImageInfo] = useState({})
  

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

            setImageInfo(res.data.data)
            handleInfo(res.data.data.name, res.data.data.location)
            console.log(res.data.data)
        }
    }

    useEffect(() => {
        console.log(base64)
        handleImage()
    }, [base64])
  
  const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({onDrop})
  

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
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light">
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
export default UploadSublett