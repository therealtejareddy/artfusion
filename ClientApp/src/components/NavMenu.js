import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import authContext, { AuthConsumer } from '../context/authContext';

export default class NavMenu extends Component {
  static displayName = NavMenu.name;
  static contextType = authContext
  
  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({

    });
  }
  handleLogout() {
        localStorage.clear();

    }

  render() {
    return (
      <header className="z-100 h-[4rem] fixed w-screen px-24 w-full bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
        <nav className="z-100 flex h-full items-center justify-between">
          <h1 className="mb-0" tag={Link} to="/">ArtFusion</h1>
          {/* <NavbarToggler onClick={this.toggleNavbar} className="mr-2" /> */}
          <div className="d-sm-inline-flex flex-sm-row-reverse">
            <ul className="mb-0">
              <li className="inline-block ml-10">
                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
              </li>
              <li className="inline-block ml-10">
                <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
              </li>
              <li className="inline-block ml-10">
                <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
              </li>
              {
                localStorage.getItem("authToken")?
                <>
                  <AuthConsumer>
                    {
                      (props) => {
                        return (<li className="inline-block ml-10">
                                  <button  className="text-dark" onClick={props.handleLogout}>Logout</button>
                                </li>)
                      }
                    }
                  </AuthConsumer>
                </>:
                <>
                  <li className="inline-block ml-10">
                    <NavLink tag={Link} className="text-dark" to="/sign-in">Login</NavLink>
                  </li>
                  <li className="inline-block ml-10">
                    <NavLink tag={Link} className="text-dark" to="/sign-up">SignUp</NavLink>
                  </li>
                </>
              }
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
