import { Navbar, Page } from "framework7-react";
import React from "react";

export default function (props) {
    return (
        <Page name="server">
            <Navbar title={props.serverName} backLink="Back" />


        </Page>
    )
}