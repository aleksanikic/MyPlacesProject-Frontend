import React, { useState } from "react";
import { Link } from "react-router-dom";

import NavLinks from "./NavLinks.js";
import "./MainNavigation.css";
import MainHeader from "./MainHeader.js";
import SideDrawer from "./SideDrawer.js";
import BackDrop from "../UIElement/Backdrop.js";

export default function MainNavigation(props) {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    function openDrawer() {
        setDrawerIsOpen(true);
    }
    function closeDrawer() {
        setDrawerIsOpen(false);
    }

    return (
        <React.Fragment>
            {drawerIsOpen && <BackDrop onClick={closeDrawer} />}
            {
                <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
                    <nav className="main-navigation__drawer-nav">
                        <NavLinks />
                    </nav>
                </SideDrawer>
            }
            <MainHeader>
                <button
                    className="main-navigation__menu-btn"
                    onClick={openDrawer}
                >
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">My places journal</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    );
}
