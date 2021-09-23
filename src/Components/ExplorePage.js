import React from "react";
var axios = require('axios');

export default class ExplorePage extends React.Component {
  state = { totalTokens: 0, likingUsersIDs: [], cardsList: [] };

  //send rewards to verified Twitter users who have interacted with a tweet of NFT minted on the platform
  async sendReward(tokenID, tweetID) {
    let users, likingUsersIDs=[];
    await axios.get('http://localhost:3000/get_likes', { params: {
      tweetID,
    }}).then(response => {
      users = JSON.parse(response.data.likesJson);
      this.setState({ users });

      for(let i=0; i<users.length(); i++ ){
        likingUsersIDs.push(users[i].userId);
      }
    }
    await window.contract.set_rewards({ n: 1, likes: likingUsersIDs, token_id: tokenID})
  }

  async componentDidMount() {
    let cardsList=[];
    const totalTokens = await window.contract.getTotalTokens();
    this.setState({ totalTokens });
    console.log(this.state);

    for (let i = 0; i < this.state.totalTokens; i++) {
      const name = await window.contract.getName({ token_id: i });
      const externalLink = await window.contract.getExternLink({ token_id: i });
      const tweetID = await window.contract.getTweetURL({ token_id });
      const tweetURL = "https://www.twitter.com/anyuser/status/".concat(tweetID.toString());
      const isOwner = await window.contract.isOwner({ token_id: i });
      if (!isOwner) {
        const reward = await window.contract.checkReward({
          account_id: account_id,
          token_id: i,
        });
        this.setState({ isRewardee: true, reward });
      }

      let NFTCard = 
        <li>
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src={externalLink} alt="NFT image" />
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-left"></div>

              </div>

              <div class="content">
                <p>{name}</p>
                <br />
              </div>
            </div>
            <footer class="card-footer">
              <a href={externalLink} class="card-footer-item">
                View on IPFS
              </a>
              <a href={tweetURL} class="card-footer-item">
                View on Twitter
              </a>
              {isOwner && (
                <a
                  onClick={this.sendReward(token_id, tweetID)}
                  class="card-footer-item"
                >
                  Send Reward
                </a>
              )}
              {!isOwner && isRewardee && (
                <a class="card-footer-item">Reward: {this.state.reward}</a>
              )}
            </footer>
          </div>
        </li>
      
      cards.push(NFTCard);
    }
    this.setState({cardsList});
    this.sendReward.bind(this);
  }

  render() {
    return (
      <div>
        <ul>{this.state.cardsList}</ul>
      </div>
    );
  }
}
