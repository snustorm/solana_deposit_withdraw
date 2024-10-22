use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace, Debug)]
pub struct Bank {
    pub authority: Pubkey,
    pub deposit: u64,
    pub withdraw: u64,
}