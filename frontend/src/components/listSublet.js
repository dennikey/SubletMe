import React, {useState} from 'react'
import 'mdbreact/dist/css/mdb.css'
import { MDBContainer, MDBRow, MDBCol, MDBFormInline, MDBIcon, MDBInput } from 'mdbreact'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios'

const OneSublet = ({name, location, price, phone, image}) => {
    let [imgData, setImgData] = React.useState([]);
  

    let arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    React.useEffect(()=>{
        image.map((image)=>{
            if(image != undefined){
                let base64Flag = 'data:imge/jpeg;base64,';
                let imgStr = arrayBufferToBase64(image.data.data);
                let imgInfo = base64Flag + imgStr;
                setImgData(imgData => [...imgData, imgInfo]);
            }
        })
    }, [])



    return (
        <div>
            <div class="card">
                <div class="card-header">
                    {name}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${price}</h5>
                    <p class="card-text">{location}</p>
                   <center style={{display: "block"}}>
                {
                imgData.map((img, index)=>{
                    if(index < 2) {
                        return(
                            <img key={index} src={img} style={{maxHeight: "400px", maxWidth: "400px"}}/>    
                        )
                    } else {
                        return(<div></div>)
                    }
                    })}
             </center>
             <center>
                    <Link 
                        class="btn btn-green"
                        to={{
                            pathname: `/oneSublet/${phone}`
                        }}>
                        View Details
                        
                    </Link>
                    </center>
                </div>
            </div>
            <div style={{padding: '15px'}}>
            </div>
        </div>
    )
}


const ListSublet = ({allSublets}) => {
    const [filter, setFilter] = useState('')
    const [filterSublets, setFilterSublets] = useState(allSublets)
    const [filterName, setFilterName] = useState(false)
    const [filterPrice, setFilterPrice] = useState(false)
    const [buffer, setBuffer] = useState(0);

    React.useEffect(()=>{
        setFilterSublets(allSublets);
        if(allSublets.length === 0){
            setBuffer(0);
        } else if (allSublets[0] == 5){
            setBuffer(1)
        } else {
            setBuffer(2);
        }
    }, [allSublets])

    const original = allSublets

    const handleClick = () => {
        if (filter == '') {
            setFilterSublets(allSublets)
        } else {
            setFilterSublets(filterSublets.filter(sublet => sublet.name == filter))
        }
    }

    const displayResult = () => {
        if(buffer == 0){
            return(
                <h3>Loading Results ...</h3>
            )
        } else if (buffer == 1) {
            return(
                <h3>No Results Are Currently Available</h3>
            )
        } else {
            return(
            <ul>
                {filterSublets.map(sublet => <OneSublet name={sublet.name} location={sublet.location} price={sublet.price} phone={sublet.phone} image={sublet.image}/>) }
            </ul>
            )
        }
    }

    const handleName = () => {
        if (!filterPrice) { 
            setFilterName(!filterName)
        }

        if (filterName) {
            setFilterSublets(original)
        } else {
            setFilterSublets(filterSublets.sort((a, b) => a.name.localeCompare(b.name)))
        }
    }

    const handlePrice = () => {
        if (!filterName) { 
            setFilterPrice(!filterPrice)
        }
        
        if (filterPrice) {
            setFilterSublets(original)
        } else  {
            setFilterSublets(filterSublets.sort((a, b) => a.price - b.price))
        }
    }

    return (
        <MDBContainer>
            <div style={{padding: '20px'}}>
            </div>
            <div>
                <p className="h4 text-center py-4">Available Sublets</p>
                <MDBCol md="6">
                    <MDBFormInline className="md-form">
                        <MDBIcon icon="search" onClick={handleClick}/>
                        <input className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" aria-label="Search" onChange={(e) => setFilter(e.target.value)}/>
                        
                    </MDBFormInline>
                    <MDBFormInline>
                        <MDBInput
                            gap
                            onClick={handleName}
                            checked={filterName}
                            name="action"
                            label='Filter by Name'
                            type='radio'
                            id='radio1'
                            containerClass='mr-5'
                        />
                        <MDBInput
                            gap
                            onClick={handlePrice}
                            checked={filterPrice}
                            name="action"
                            label='Filter by Price'
                            type='radio'
                            id='radio2'
                            containerClass='mr-5'
                        />
                    </MDBFormInline>
                </MDBCol>
                <br></br>
                {displayResult()}
            </div>
        </MDBContainer>
    )
}

export default ListSublett