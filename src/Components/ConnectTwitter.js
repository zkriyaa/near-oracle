import React from "react";
const axios = require('axios');
import { UnencryptedFileSystemKeyStore } from "near-api-js/lib/key_stores";
import { keyStores } from "near-api-js";

import Loader from "react-loader-spinner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const path = require("path");

export default class ConnectTwitter extends React.Component {
  state = {
    buttonText: "",
    showSpinner: "none",
    twitterUname: "",
  };

  componentDidMount = async () => {
    const MySwal = withReactContent(Swal);
    this.setState({ MySwal });

    const ACCOUNT_ID = "sanguini.testnet";
    const CREDENTIALS_DIR = ".near-credentials";

    const credentialsPath = path.join(process.env.HOME, CREDENTIALS_DIR);
    const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

    const config = {
      keyStore,
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
    };
    console.log(keyStore.getKey);

    const keyPair = await keyStore.getKey(config.networkId, ACCOUNT_ID);

    console.log("keypair " + keyPair);
  };

  //handleSign function connects user's Twitter account to their near wallet account. User tweets signature of username and the tweet is then verified.
  async handleSign(e) {
    e.preventDefault();
    const msg = Buffer.from(this.state.twitterUname.concat(window.accountId));
    const { signature } = keyPair.sign(msg);
    var string = new TextDecoder().decode(signature);

    // var string =
    //   "0x4db8a049579e27774cdffec59a38f260857201be0ee5659e77894ec82b37f16b80317a23741352d9dec82ddc678275e3059ae794ca186bcf41a19c06faf871b";
    const tweetText = "Verifying ShareNFT Account.\n" + string;

    await this.state.MySwal.fire({
      title: <strong>Share the signature on Twitter</strong>,
      html: <p>Tweet text: {tweetText}</p>,
      confirmButtonText: "Verify tweet!",
    }).then(async (result) => {
      //verify tweet code
      //get twitter id from username

      if (result.isConfirmed) {
        await window.contract
          .add_twitter({
            account_id: window.accountId,
            // twitter_userID: this.state.twitter_userID,
            twitter_userID: "1210502021314314241",
          })
          .then(() => {
            this.state.MySwal.fire({
              title: "Verified!",
              html: <p>Added Twitter account!</p>,
              icon: "success",
            });
          });
      }
    });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <br />
        <div
          className="sections"
          style={{ maxWidth: "1000px", margin: "auto" }}
        >
          <div className="columns">
            <div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
              <form class="box">
                <div class="field">
                  <label class="label">Twitter Username</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="e.g. User123"
                      name="twitterUname"
                      onChange={this.handleChange.bind(this)}
                    />
                  </div>
                </div>
                <button
                  class="button is-primary"
                  onClick={this.handleSign.bind(this)}
                  style={{backgroundColor: "#1923e3", color: "white"}}
                >
                  Verify
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
