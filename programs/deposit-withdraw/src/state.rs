use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace, Debug)]
pub struct Bank {
    pub authority: Pubkey,
    pub bank_balance: u64,
    pub bump: u8,
    pub initialize: bool,
}