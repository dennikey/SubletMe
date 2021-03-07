import React from 'react'
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBIcon, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact"
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdbreact/dist/css/mdb.css'
import { useAuth0 } from "@auth0/auth0-react"
import '../css/Nav.css'

const Nav = ({open, handleOpen}) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { loginWithRedirect } = useAuth0();
    const { logout } = useAuth0();

    return (
        <MDBNavbar color="default-color" dark expand="md">
            <MDBNavbarBrand>
            <strong className="white-text">Sublet Me</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={handleOpen} />
            <MDBCollapse id="navbarCollapse3" isOpen={open} navbar>
            <MDBNavbarNav left>
                <MDBNavItem>
                <MDBNavLink to="/home">Home</MDBNavLink>
                </MDBNavItem>
                {isAuthenticated ? 
                    <MDBNavItem>
                        <MDBNavLink to="/uploadSublet">Upload Sublet</MDBNavLink>
                    </MDBNavItem> 
                : null}
                {isAuthenticated ? 
                    <MDBNavItem>
                        <MDBNavLink to="/listSublet">Sublet List</MDBNavLink>
                    </MDBNavItem>
                : null}
            </MDBNavbarNav>

            <MDBNavbarNav right>
                <MDBNavItem>
                <MDBNavLink className="waves-effect waves-light" to="#!">
                    <MDBIcon fab icon="twitter" />
                </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                <MDBNavLink className="waves-effect waves-light" to="#!">
                    <MDBIcon fab icon="google-plus-g" />
                </MDBNavLink>
                </MDBNavItem>
                {isAuthenticated ? 
                <MDBDropdown>
                <MDBDropdownToggle nav caret color="primary">
                  <MDBIcon icon="user" />
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default" right={true} basic>
                  <MDBDropdownItem onClick={() => logout({ returnTo: window.location.origin })}>Log out</MDBDropdownItem>
                  <MDBDropdownItem divider />
                  <MDBDropdownItem><MDBNavLink to="/profile" ><MDBIcon icon="user-circle" />  My Profile</MDBNavLink></MDBDropdownItem>
                  <MDBDropdownItem><MDBNavLink to="/contact" ><MDBIcon icon="phone-alt" />  Contact Us</MDBNavLink></MDBDropdownItem>
                </MDBDropdownMenu>
                </MDBDropdown>
                :
                <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <MDBIcon icon="user" />
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default" right={true} basic>
                  <MDBDropdownItem onClick={() => loginWithRedirect()} id="nav-item">Login</MDBDropdownItem>
                </MDBDropdownMenu>
                </MDBDropdown> }

            </MDBNavbarNav>
            </MDBCollapse>
        </MDBNavbar>
    )
}

export default Nav
