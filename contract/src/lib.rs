// mod types;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap};
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};

type TokenId = u64;

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NftContract {
    pub owner_id: AccountId,
    pub metadata: LookupMap<u64, Metadata>,
    pub tokens: LookupMap<TokenId, Token>,
    pub totalTokens: u64,
    pub userIDs: LookupMap<AccountId, u128>,
    pub userIDs_rev: LookupMap<u128, AccountId>,
    pub tweetURLs: LookupMap<TokenId, String>,
    pub tweetRewardees: LookupMap<TokenId, Vec<AccountId>>,
    pub reward_value: Balance 
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Metadata {
    pub name: String,
    pub creator: String,
    pub description: String,
    pub nft_type: String,
    pub external_link: String,
    pub date: String,
    pub category: String
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    pub owner_id: AccountId,
    pub metadata: u64,
    pub reward_value: Balance,
}

impl Default for NftContract {
    fn default() -> Self {
        panic!("NFT should be initialized before usage")
    }
}

#[near_bindgen]
impl NftContract
{
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        assert!(env::is_valid_account_id(owner_id.as_bytes()), "Owner's account ID is invalid.");
        assert!(!env::state_exists(), "Already initialized");
        
        Self {
            totalTokens: 0,
            owner_id,
            metadata: LookupMap::new(b"md".to_vec()),
            tokens: LookupMap::new(b"t".to_vec()),
            userIDs:  LookupMap::new(b"un".to_vec()),
            userIDs_rev:  LookupMap::new(b"ur".to_vec()),
            tweetURLs:  LookupMap::new(b"tu".to_vec()),
            tweetRewardees:  LookupMap::new(b"tr".to_vec()),
            reward_value: 10_000_000_000_000_000_000
        }
    }

    pub fn getTotalTokens(& self) -> u64{
        return self.totalTokens;
    }

    pub fn check_reward(&self, token_id: TokenId, account_id: AccountId) -> u64{
        let reward_vector: Vec<AccountId> = self.tweetRewardees.get(&token_id).unwrap() as Vec<AccountId>;
        if reward_vector.contains(&account_id)
            {return self.tokens.get(&token_id).unwrap().reward_value as u64}
        else
            {return 0;}
    }

    pub fn add_twitter(&mut self, account_id: AccountId, twitter_userID: String){
        let userID: u128 = twitter_userID.parse::<u128>().unwrap();
        self.userIDs.insert(&account_id, &userID as &u128);
        self.userIDs_rev.insert(&userID as &u128, &account_id);
    }

    pub fn getUserID(&mut self, account_id: AccountId) -> u128{
        match self.userIDs.get(&account_id) {
        Some(value) => {value}
        None => {0}
        }
    }

    pub fn getAccountId(&mut self, twitter_userID: String) -> AccountId{
        let userID: u128 = twitter_userID.parse::<u128>().unwrap();
        return self.userIDs_rev.get(&userID).unwrap();
    }

    pub fn saveTweetURL(&mut self, tweetURL: String, token_id: TokenId) {
        // assert!(env::predecessor_account_id()!=(self.tokens.get(&token_id)).unwrap().owner_id, "Only owner can save tweetURL");
        self.tweetURLs.insert(&token_id, &tweetURL);
    }   

    pub fn getTweetURL(&mut self, token_id: TokenId) -> String
    {
        return self.tweetURLs.get(&token_id).unwrap();
    }

    pub fn getExternLink(&mut self, token_id: TokenId) -> String {
        return self.metadata.get(&token_id).unwrap().external_link;
    }

    pub fn getName(&mut self, token_id: TokenId) -> String {
        return self.metadata.get(&token_id).unwrap().name;
    }

    pub fn isOwner(&mut self, token_id: TokenId) -> bool {
        return env::predecessor_account_id() == self.tokens.get(&token_id).unwrap().owner_id;
    }

    pub fn mint_token(&mut self, account_id: AccountId, _name: String, _description: String, _type: String, _link: String, _category: String ,reward: Balance, _date: String) -> u64{
        // assert!(env::attached_deposit() >= (self.mint_storage_fee + (self.edition_storage_fee * metadata.editions as u128)), "{} {}", DEPOSIT_NOT_ENOUGH, (self.mint_storage_fee + (self.edition_storage_fee * metadata.editions as u128)));

        let mut metadata = Metadata {
            name: _name,
            creator: env::predecessor_account_id(),
            description: _description,
            nft_type: _type,
            external_link: _link,
            category: _category,
            date: _date
        };

        let new_token_id: TokenId = self.totalTokens;
        self.totalTokens += 1;

        let new_token = Token {
            owner_id: account_id,
            metadata: new_token_id,
            reward_value: 10_000_000_000_000_000_000
        };

        self.tokens.insert(&new_token_id, &new_token);
        self.metadata.insert(&new_token_id, &metadata);

        return new_token_id;
    }

    #[payable]
    

    #[payable]
    pub fn set_rewards(&mut self, n: i32, likes: Vec<String>, token_id: TokenId)-> Vec<AccountId>{
        assert!(env::predecessor_account_id() == self.tokens.get(&token_id).unwrap().owner_id, "Only owner can send out rewards");

        let mut reward_vec = Vec::new();

        let userID: u128 = likingTwitterUserID.parse::<u128>().unwrap();

        // let account_id =  self.userIDs_rev.get(&userID).unwrap();
        // reward_vec.push(account_id);

        for x in 0..n {
            let twitter_username_: std::string::String = likes[x as usize].to_string();
            let account_id =  self.usernames_rev.get(&(twitter_username_ as std::string::String)).unwrap();
            reward_vec.push(account_id);
        }
        self.tweetRewardees.insert(&token_id, &reward_vec);

        Promise::new(self.userIDs_rev.get(&userID).unwrap()).transfer(env::attached_deposit());
        return reward_vec;
    }
}