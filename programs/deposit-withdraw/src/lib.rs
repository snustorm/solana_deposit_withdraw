use anchor_lang::prelude::*;

declare_id!("CRzTxSDcpjSqimnSSi6jGhX3ZeKBJAUwUyfnK5ikWPz2");

use state::*;
mod state;
use constants::*;
mod constants;

#[program]
pub mod deposit_withdraw {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
       // msg!("Greetings from: {:?}", ctx.program_id);
       //let deposit = &mut ctx.accounts.deposit;
       Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(
        init,
        payer = depositor,
        space = 8 + Bank::INIT_SPACE,
        seeds = [SEEDS_DEPOSIT],
        bump,
    )]
    pub deposit_account: Account<'info, Bank>,
    pub system_program: Program<'info, System>,

}



