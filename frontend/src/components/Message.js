import React, {useState} from 'react'
import 'mdbreact/dist/css/mdb.css'
import Modal from 'react-modal'
import { MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdbreact'

const MessageContainer = ({phone, handleClick, modalOpen}) => {
    const [body, setBody] = useState("")
    const [bodyMessage, setBodyMessage] = useState("")

    const onSubmit = async (e) => {
        await e.preventDefault();
      
        const res = await fetch("/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ to: phone, body: body }),
        });
      
        const data = await res.json();
      
        if (data.success) {
            await setBody("");
            setBodyMessage("Message sent successfully!")
            setTimeout(() => {
                setBodyMessage('')
            }, 5000)
        } else {
            await setBody("An error has occurred.")
            setBodyMessage("An error has occurred.")
            setTimeout(() => {
                setBodyMessage('')
            }, 5000)
        }
    }

    return(
        <div>
            <Modal isOpen={modalOpen} onRequestClose={handleClick}>
                <button class="btn btn-green" onClick={handleClick}>Close Message</button>
                <br></br>
                <br></br>
                <MDBContainer>
                    <form onSubmit={onSubmit}>
                        <label htmlFor="exampleFormControlTextarea1">
                        Type your message here
                        </label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="5" onChange={(e) => setBody(e.target.value)}/>
                        <br></br>
                        <MDBBtn className="btn btn-outline-green" type="submit">
                            Submit
                        </MDBBtn>
                        { bodyMessage
                        ? <p className="h4 text-center py-4">{bodyMessage}</p>
                        : null}
                    </form>
                </MDBContainer>
            </Modal>
        </div>
    )
}

export default MessageContainer