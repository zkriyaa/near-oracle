import React from "react";
import { NFTStorage, File } from "nft.storage";
import { Contract } from "near-api-js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const client = new NFTStorage({
  token: process.env.NFTStorageAPIKey,
});

export default class Publish extends React.Component {
  state = { name: "", description: "", category: "" };

  componentDidMount = async () => {
    const MySwal = withReactContent(Swal);
    this.setState({ MySwal });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCloseModal() {
    this.setState({});
  }

  //upload NFT metadata to IPFS using NFT.Storage
  async handleUploadImg(e) {
    var file = e.target.files[0];
    console.log(file);
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer.from(reader.result) });
    };

    const metadata = await client.store({
      name: this.state.name,
      description: this.state.description,
      category: this.state.category,
      creator: window.accountID,
      // nft_type: this.state.nft_type,
      date: Date.now(),

      image: new File([this.state.buffer], "nftimg.jpg", {
        type: "image/jpg",
      }),
    });

    this.setState({url: metadata.url});
    console.log(metadata);

    reader.onerror = function (error) {
      console.log("Error: ", error);

    };
  }

  //mint a new token and save Tweet URL
  async handleStoreNFT() {
    console.log(this.state);
    const apiKey = await process.env.NFTStorageAPIKey;
    console.log(apiKey);
    const client = new NFTStorage({ token: apiKey });
    const account_id = await window.accountID;

    const token_id = await window.contract.mint_token({
      account_id: "funyun.testnet",
      _name: this.state.name,
      _description: this.state.description,
      _type: "image",
      _link: this.state.url,
      _category: this.state.category,
      reward: 10,
      _date: Date.now().toString(),
    });

    console.log(token_id);

    const tweetText = "Check out my NFT ".concat(
      this.state.name,
      " on ",
      this.state.NFTURL,
      " !!🎉 #NFT"
    );
    if (token_id) {
      await this.state.MySwal.fire({
        title: <strong>Token minted!</strong>,
        html: <p>You can now share it to Twitter: {tweetText}</p>,
        icon: "success",
        confirmButtonText: "Done!",
      }).then(() => {
        this.state.MySwal.fire({
          title: <strong>Share Tweet URL</strong>,
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
          },
          confirmButtonText: "Done!",
          showCloseButton: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            await window.contract
              .saveTweetURL({
                tweetURL: result.value,
                token_id: token_id,
              })
              .then(() => {
                this.state.MySwal.fire({
                  title: "Verified!",
                  icon: "success",
                });
              });
          }
        });
      });
    }
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
              <div class="box">
                <div class="field">
                  <label class="label">Name</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      name="name"
                      placeholder="MyNFT"
                      onChange={this.handleChange.bind(this)}
                    />
                  </div>
                </div>

                <div class="file">
                  <label class="file-label">
                    <input
                      class="file-input"
                      type="file"
                      accept=".jpeg"
                      name="image"
                      onChange={this.handleUploadImg.bind(this)}
                    />
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">Choose a file…</span>
                    </span>
                  </label>
                </div>
                <div class="field">
                  <label class="label">Description</label>
                  <div class="control">
                    <input
                      class="input"
                      name="description"
                      type="text"
                      onChange={this.handleChange.bind(this)}
                    />
                  </div>
                </div>
                <div class="field">
                  <label class="label">Category</label>
                  <div class="control">
                    <input
                      class="input"
                      name="category"
                      type="text"
                      onChange={this.handleChange.bind(this)}
                    />
                  </div>
                </div>
                <button onClick={this.handleStoreNFT.bind(this)}>Mint</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
