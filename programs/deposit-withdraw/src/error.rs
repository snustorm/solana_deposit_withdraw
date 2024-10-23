use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Insufficien Fund to Withdraw")]
    InsufficientFunds,
    #[msg("Bank already initialized")]
    BankAlreadyInitialized,
}