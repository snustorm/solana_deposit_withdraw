use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("2tcNuRhcHymgmbjbRPHBkDgXjEHg3W6Dv5ehw83126xw");

use state::*;
mod state;
use constants::*;
mod constants;
use error::*;
mod error;

#[program]
pub mod deposit_withdraw {

    use super::*;

     pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        
        if ctx.accounts.bank.initialize {
            //return Err(CustomError::BankAlreadyInitialized.into());
            ctx.accounts.bank.bank_balance += amount;
            msg!("Bank already initialized, just do deposit");
        } else {
            *ctx.accounts.bank = Bank {
                authority: ctx.accounts.depositor.key(),
                bank_balance: ctx.accounts.bank.bank_balance + amount,
                bump: ctx.bumps.bank,
                initialize: true,
            };
        }
        msg!("{:#?}", ctx.accounts.bank);

        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.depositor.to_account_info(),
                    to: ctx.accounts.bank.to_account_info(),
                },
            ),
            amount,
        )?;
        Ok(())
    }


    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {

        let bank = &mut ctx.accounts.bank;

        require!(bank.bank_balance >= amount, CustomError::InsufficientFunds);

        **bank.to_account_info().try_borrow_mut_lamports()? -= amount;
        **bank.to_account_info().try_borrow_mut_lamports()? += amount;

        bank.bank_balance -= amount;

        Ok(())
    }



}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(
        init_if_needed,
        payer = depositor,
        space = 8 + Bank::INIT_SPACE,
        seeds = [SEEDS_DEPOSIT],
        bump,
    )]
    pub bank: Account<'info, Bank>,
    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
pub struct Withdraw<'info> {

    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        has_one = authority,
        seeds = [SEEDS_DEPOSIT],
        bump = bank.bump,
    )]
    pub bank: Account<'info, Bank>,
}

