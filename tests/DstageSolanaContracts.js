"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var anchor = require("@project-serum/anchor");
var spl_token_1 = require("@solana/spl-token"); // IGNORE THESE ERRORS IF ANY
var SystemProgram = anchor.web3.SystemProgram;
describe("DstageSolanaContracts", function () {
    // Configure the client to use the local cluster.
    var provider = anchor.AnchorProvider.env();
    var wallet = provider.wallet;
    anchor.setProvider(provider);
    var program = anchor.workspace.DstageSolanaContracts;
    it("Is initialized!", function () { return __awaiter(void 0, void 0, void 0, function () {
        var TOKEN_METADATA_PROGRAM_ID, lamports, getMetadata, getMasterEdition, mintKey, NftTokenAccount, mint_tx, res, _a, _b, metadataAddress, masterEdition, tx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
                    console.log("Token MetaData Account Key", TOKEN_METADATA_PROGRAM_ID);
                    return [4 /*yield*/, program.provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MINT_SIZE)];
                case 1:
                    lamports = _c.sent();
                    getMetadata = function (mint) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddress([
                                        Buffer.from("metadata"),
                                        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                                        mint.toBuffer(),
                                    ], TOKEN_METADATA_PROGRAM_ID)];
                                case 1: return [2 /*return*/, (_a.sent())[0]];
                            }
                        });
                    }); };
                    getMasterEdition = function (mint) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddress([
                                        Buffer.from("metadata"),
                                        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                                        mint.toBuffer(),
                                        Buffer.from("edition"),
                                    ], TOKEN_METADATA_PROGRAM_ID)];
                                case 1: return [2 /*return*/, (_a.sent())[0]];
                            }
                        });
                    }); };
                    mintKey = anchor.web3.Keypair.generate();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mintKey.publicKey, wallet.publicKey)];
                case 2:
                    NftTokenAccount = _c.sent();
                    console.log("NFT Account: ", NftTokenAccount.toBase58());
                    mint_tx = new anchor.web3.Transaction().add(anchor.web3.SystemProgram.createAccount({
                        fromPubkey: wallet.publicKey,
                        newAccountPubkey: mintKey.publicKey,
                        space: spl_token_1.MINT_SIZE,
                        programId: spl_token_1.TOKEN_PROGRAM_ID,
                        lamports: lamports
                    }), (0, spl_token_1.createInitializeMintInstruction)(mintKey.publicKey, 0, wallet.publicKey, wallet.publicKey), (0, spl_token_1.createAssociatedTokenAccountInstruction)(wallet.publicKey, NftTokenAccount, wallet.publicKey, mintKey.publicKey));
                    return [4 /*yield*/, program.provider.sendAndConfirm(mint_tx, [mintKey])];
                case 3:
                    res = _c.sent();
                    _b = (_a = console).log;
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(mintKey.publicKey)];
                case 4:
                    _b.apply(_a, [_c.sent()]);
                    console.log("Account: ", res);
                    console.log("Mint key: ", mintKey.publicKey.toString());
                    console.log("User: ", wallet.publicKey.toString());
                    return [4 /*yield*/, getMetadata(mintKey.publicKey)];
                case 5:
                    metadataAddress = _c.sent();
                    return [4 /*yield*/, getMasterEdition(mintKey.publicKey)];
                case 6:
                    masterEdition = _c.sent();
                    console.log("Metadata address: ", metadataAddress.toBase58());
                    console.log("MasterEdition: ", masterEdition.toBase58());
                    return [4 /*yield*/, program.methods.mintNft(mintKey.publicKey, "https://arweave.net/y5e5DJsiwH0s_ayfMwYk-SnrZtVZzHLQDSTZ5dNRUHA", "NFT Title")
                            .accounts({
                            mintAuthority: wallet.publicKey,
                            mint: mintKey.publicKey,
                            tokenAccount: NftTokenAccount,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            metadata: metadataAddress,
                            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                            payer: wallet.publicKey,
                            systemProgram: SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            masterEdition: masterEdition
                        })
                            .rpc()];
                case 7:
                    tx = _c.sent();
                    console.log("Your transaction signature", tx);
                    return [2 /*return*/];
            }
        });
    }); });
});
