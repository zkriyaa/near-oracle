import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import { login, logout } from "../utils";
import ExplorePage from "./ExplorePage";
import ConnectTwitter from "./ConnectTwitter";
import Publish from "./Publish";

import "../global.css";

export default class NavComp extends Component {
  state = { uname: "", showModal: "none", ConnectTwitterOption: false };

  componentDidMount = async () => {
    console.log(window.contract);
    if (window.walletConnection.isSignedIn()) {
      let uname = await window.contract.getUserID({
        account_id: window.accountId,
      }).then(() => {
        if(parse(uname))
        this.setState({uname, ConnectTwitterOption: false})
      })
    }
  };

  handleShowModal() {
    this.setState({ showModal: "flex" });
  }

  handleCloseModal() {
    this.setState({ showModal: "none" });
  }

  render() {
    return (
      <div className="App">
        <nav
          className="navbar"
          role="navigation"
          aria-label="main navigation"
          style={{ backgroundColor: "#1923e3", color: "white" }}
        >
          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <a href="/" className="navbar-item" style={{ color: "white" }}>
                <strong>ShareNFT</strong>
              </a>
            </div>
            <div className="navbar-end">
              {!window.walletConnection.isSignedIn() && (
                <a
                  className="navbar-item"
                  style={{ color: "white", float: "right" }}
                  onClick={this.handleShowModal.bind(this)}
                >
                  Connect Wallet
                </a>
              )}

              <a className="navbar-item" style={{ color: "white" }} href="/explore">
                Explore
              </a>
              {this.state.ConnectTwitterOption && (
                <a
                  className="navbar-item"
                  style={{ float: "right", color: "white" }}
                  href="/signin"
                >
                  Start Publishing!
                </a>
              )}
              {!this.state.ConnectTwitterOption && (
                <a
                  className="navbar-item"
                  style={{ float: "right", color: "white" }}
                  href="/publish"
                >
                  Publish
                </a>
              )}

              {window.walletConnection.isSignedIn() && (
                <a
                  className="navbar-item"
                  style={{ float: "right", color: "white" }}
                  onClick={logout}
                >
                  Log Out({window.accountId})
                </a>
              )}
            </div>
          </div>
        </nav>

        <div class="modal" style={{ display: this.state.showModal }}>
          <div class="modal-background"></div>

          <div class="modal-card" style={{ backgroundColor: "white" }}>
            <header class="modal-card-head">
              <p class="modal-card-title">Welcome to NEAR!</p>
              <button
                class="delete"
                aria-label="close"
                onClick={this.handleCloseModal.bind(this)}
              ></button>
            </header>
            <section class="modal-card-body">
              <p>
                To make use of the NEAR blockchain, you need to sign in. The
                button below will sign you in using NEAR Wallet.
              </p>
              <p>
                By default, when your app runs in "development" mode, it
                connects to a test network ("testnet") wallet. This works just
                like the main network ("mainnet") wallet, but the NEAR Tokens on
                testnet aren't convertible to other currencies – they're just
                for testing!
              </p>
              <p>Go ahead and click the button below to try it out:</p>
            </section>
            <footer
              class="modal-card-foot"
              style={{ float: "center", display: "flex" }}
            >
              <button onClick={login}>Sign in</button>
            </footer>
          </div>
        </div>

        <Router>
          <Switch>
            <Route exact path="/explore" component={() => <ExplorePage />} />
            <Route exact path="/signin" component={() => <ConnectTwitter />} />
            <Route
              exact
              path="/nft/:id"
              component={() => <NFTPage id={id} />}
            />
            <Route exact path="/publish" component={() => <Publish />} />
          </Switch>
        </Router>
      </div>
    );
  }
}
