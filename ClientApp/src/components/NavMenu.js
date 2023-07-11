import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import authContext, { AuthConsumer } from '../context/authContext';
import { AppConsumer } from '../context/appContext';

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
      <header className="z-50 h-[4rem] fixed w-screen px-24 w-full bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70">
        <nav className="flex h-full items-center justify-between">
          <NavLink to="/" tag={Link}>
            <img className="mb-0 md:max-w-[18rem]" to="/" src="https://res.cloudinary.com/dy5jbitxn/image/upload/v1688559962/logo/artfusion-light.png" alt="logo"/>
          </NavLink>
          {/* <NavbarToggler onClick={this.toggleNavbar} className="mr-2" /> */}
          <div className="d-sm-inline-flex flex-sm-row-reverse">
            <ul className="mb-0 flex items-center">
              <li className="inline-block ml-10">
                <NavLink tag={Link} className="text-white" to="/">Home</NavLink>
              </li>
              {
                localStorage.getItem("authToken")?
                <>
                  <AuthConsumer>
                    {
                      (props) => {
                        return (
                          <li className="inline-block ml-10">
                            <button id="dropdownInformationButton" data-dropdown-toggle="dropdownInformation" className="z-100 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Profile
                            </button>
                            <div id="dropdownInformation" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                  <div>{props.userData.name}</div>
                                  <div className="font-medium truncate">{props.userData.email}</div>
                                </div>
                                <ul className="py-2 pl-0 text-sm text-gray-700 dark:text-gray-200 text-center" aria-labelledby="dropdownInformationButton">
                                  <li className=" hover:bg-gray-200">
                                      <NavLink tag={Link} className="text-dark" to="/profile">Profile</NavLink>
                                  </li>
                                  <li className="hover:bg-gray-200">
                                      <NavLink tag={Link} className="text-dark" to="/my-orders">My Orders</NavLink>
                                  </li>
                                  <li className="hover:bg-gray-200">
                                      <NavLink tag={Link} className="text-dark" to="/profile/liked">Liked Arts</NavLink>
                                  </li>
                                </ul>
                                <div className="py-2 w-full mx-auto">
                                  <NavLink tag={Link} to="/profile/edit"  className="w-full text-center block px-4 py-2 text-sm text-dark hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit Profile</NavLink>
                                  <button onClick={props.handleLogout}  className="w-full text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</button>
                                </div>
                            </div>
                            </li>
                        )
                      }
                    }
                  </AuthConsumer>
                  <li className="inline-block ml-10">
                    <NavLink tag={Link} to="/checkout/cart" className="relative">
                      <AppConsumer>
                        {
                          (props) => {
                            return(<span className="absolute bg-red-500 text-white rounded-full text-sm px-1 top-0 right-1">{props.cartItemsCount}</span>)
                          }
                        }
                      </AppConsumer>
                      <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"/>
                      </svg>
                    </NavLink>
                  </li>
                </>:
                <>
                  <li className="inline-block ml-10">
                    <NavLink tag={Link} className="text-dark font-semibold" to="/sign-in">Login</NavLink>
                  </li>
                  <li className="inline-block ml-10">
                    <NavLink tag={Link} className="text-dark font-semibold" to="/sign-up">SignUp</NavLink>
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
