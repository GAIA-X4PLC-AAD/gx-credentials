// "use client";

// import { useEffect, useState } from "react";
// import { SDK, useWallet } from "@/context/WalletContext";
// import { TezosToolkit } from "@taquito/taquito";
// import { BeaconWallet } from "@taquito/beacon-wallet";
// import { PermissionScopeMethods, WalletConnect } from "@taquito/wallet-connect";
// import { formatTokenAmount, shortenHash } from "@/lib/utils";
// import {
//   defaultMatrixNode,
//   getRpcUrl,
//   NetworkTypeBeacon,
//   NetworkTypeWc,
//   SupportedNetworks,
// } from "@/config";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { BeaconEvent } from "@airgap/beacon-dapp";
// import { Button } from "./button";

// export default function WalletButton() {
//   const { state, dispatch } = useWallet();
//   const [showDialog, setShowDialog] = useState(false);
//   const [connectedWallet, setConnectedWallet] = useState("");

//   const createNewBeaconWallet = (config: { networkType: string }) => {
//     const wallet = new BeaconWallet({
//       name: "Taquito Test Dapp",
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       matrixNodes: [defaultMatrixNode] as any,
//       network: {
//         type: config.networkType as NetworkTypeBeacon,
//         rpcUrl: getRpcUrl(config.networkType as SupportedNetworks),
//       },
//       walletConnectOptions: {
//         projectId: "ba97fd7d1e89eae02f7c330e14ce1f36",
//       },
//       enableMetrics: state.enableMetrics,
//     });
//     wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, () => {});
//     return wallet;
//   };

//   const createNewWalletConnect = async () => {
//     const wallet = await WalletConnect.init({
//       logger: "debug",
//       projectId: "ba97fd7d1e89eae02f7c330e14ce1f36",
//       metadata: {
//         name: "Taquito Test Dapp",
//         description: "Test Taquito with WalletConnect",
//         icons: [],
//         url: "",
//       },
//     });

//     wallet.signClient.on("session_ping", ({ id, topic }) => {
//       console.log("session_ping in test dapp", id, topic);
//       dispatch({ type: "ADD_EVENT", payload: "session_ping" });
//     });

//     wallet.signClient.on("session_delete", ({ topic }) => {
//       console.log("EVENT: session_delete", topic);
//       dispatch({ type: "ADD_EVENT", payload: "session_delete" });
//       if (!wallet.isActiveSession()) {
//         dispatch({ type: "RESET_APP" });
//       }
//     });

//     wallet.signClient.on("session_update", async ({ topic }) => {
//       console.log("EVENT: session_update", topic);
//       dispatch({ type: "ADD_EVENT", payload: "session_update" });
//       const allAccounts = wallet.getAccounts();
//       await updateStore(wallet, allAccounts);
//     });

//     return wallet;
//   };

//   const updateUserBalance = async (userAddress: string) => {
//     if (state.Tezos) {
//       const balance = await state.Tezos.tz.getBalance(userAddress);
//       if (balance) {
//         dispatch({
//           type: "SET_USER_BALANCE",
//           payload: balance.toNumber(),
//         });
//       }
//     }
//   };

//   const requestPermissionWc2 = async (
//     wallet: WalletConnect,
//     config: { networkType: string },
//     pairingTopic?: string
//   ) => {
//     await wallet.requestPermissions({
//       permissionScope: {
//         networks: [config.networkType as NetworkTypeWc],
//         events: [],
//         methods: [
//           PermissionScopeMethods.TEZOS_SEND,
//           PermissionScopeMethods.TEZOS_SIGN,
//           PermissionScopeMethods.TEZOS_GET_ACCOUNTS,
//         ],
//       },
//       registryUrl: `https://explorer-api.walletconnect.com/v3/wallets?projectId=ba97fd7d1e89eae02f7c330e14ce1f36`, // Project ID can be obtained from Reown(Walletconnect) Cloud (https://cloud.reown.com).
//       pairingTopic,
//     });
//     const allAccounts = wallet.getAccounts();
//     await updateStore(wallet, allAccounts);
//   };

//   const connectWalletWithExistingSession = async (sessionId: string) => {
//     const newWallet = await createNewWalletConnect();
//     newWallet.configureWithExistingSessionKey(sessionId);
//     const allAccounts = newWallet.getAccounts();
//     await updateStore(newWallet, allAccounts);
//   };

//   const updateStore = async (
//     wallet: BeaconWallet | WalletConnect,
//     allAccounts?: string[]
//   ) => {
//     try {
//       dispatch({ type: "SET_WALLET", payload: wallet });

//       let userAddress: string;
//       if (allAccounts) {
//         if (allAccounts.length > 1) {
//           userAddress = allAccounts.shift() as string;
//           dispatch({
//             type: "SET_AVAILABLE_ACCOUNTS",
//             payload: allAccounts,
//           });
//         } else {
//           dispatch({ type: "SET_AVAILABLE_ACCOUNTS", payload: [] });
//           userAddress = allAccounts[0];
//         }
//       } else {
//         userAddress = await wallet.getPKH();
//       }

//       dispatch({ type: "SET_USER_ADDRESS", payload: userAddress });

//       if (wallet instanceof WalletConnect) {
//         wallet.setActiveAccount(userAddress);
//         wallet.setActiveNetwork(state.networkType as NetworkTypeWc);
//       }

//       const Tezos = new TezosToolkit(
//         getRpcUrl(state.networkType as SupportedNetworks)
//       );
//       Tezos.setWalletProvider(wallet);
//       dispatch({ type: "SET_TEZOS", payload: Tezos });

//       await updateUserBalance(userAddress);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const connectWallet = async () => {
//     if (!state.wallet) {
//       if (state.sdk === SDK.BEACON) {
//         const newWallet = createNewBeaconWallet({
//           networkType: state.networkType,
//         });
//         await newWallet.requestPermissions({
//           network: {
//             type: state.networkType as NetworkTypeBeacon,
//             rpcUrl: getRpcUrl(state.networkType as SupportedNetworks),
//           },
//         });

//         const peers = await newWallet.client.getPeers();
//         setConnectedWallet(peers[0].name);
//         await updateStore(newWallet);
//       } else if (state.sdk === SDK.WC2) {
//         const newWallet = await createNewWalletConnect();
//         const existingPairing = newWallet.getAvailablePairing();
//         if (existingPairing.length > 0) {
//           // Handle existing pairing UI
//         } else {
//           await requestPermissionWc2(newWallet, {
//             networkType: state.networkType,
//           });
//         }
//       } else {
//         console.log("Unsupported SDK");
//       }
//     }
//   };

//   const disconnectWallet = async () => {
//     if (state.wallet instanceof BeaconWallet) {
//       await state.wallet.clearActiveAccount();
//     } else if (state.wallet instanceof WalletConnect) {
//       await state.wallet.disconnect();
//     }
//     dispatch({ type: "RESET_APP" });
//     setShowDialog(false);
//   };

//   const switchActiveAccount = (newActiveAccount: string) => {
//     if (!state.userAddress || !state.availableAccounts) return;

//     const currentPkh = state.userAddress;
//     const availablePkh = [...state.availableAccounts];
//     const index = availablePkh.indexOf(newActiveAccount);

//     if (index > -1) {
//       availablePkh.splice(index, 1);
//     }
//     availablePkh.push(currentPkh);

//     dispatch({
//       type: "SET_AVAILABLE_ACCOUNTS",
//       payload: availablePkh,
//     });
//     dispatch({
//       type: "SET_USER_ADDRESS",
//       payload: newActiveAccount,
//     });

//     if (state.wallet instanceof WalletConnect) {
//       state.wallet.setActiveAccount(newActiveAccount);
//     }
//     updateUserBalance(newActiveAccount);
//   };

//   useEffect(() => {
//     const checkExistingSession = async () => {
//       if (
//         typeof window !== "undefined" &&
//         window.localStorage["wc@2:client:0.3//session"] &&
//         window.localStorage["wc@2:client:0.3//session"] !== "[]"
//       ) {
//         const sessions = JSON.parse(
//           window.localStorage["wc@2:client:0.3//session"]
//         );
//         const lastSession = sessions[sessions.length - 1].topic;
//         dispatch({ type: "SET_SDK", payload: SDK.WC2 });
//         await connectWalletWithExistingSession(lastSession);
//       } else {
//         await connectWallet();
//       }
//     };

//     checkExistingSession();
//   }, []);

//   useEffect(() => {
//     const updateWalletInfo = async () => {
//       if (state.wallet instanceof BeaconWallet) {
//         const activeAccount = await state.wallet.client.getActiveAccount();
//         if (activeAccount) {
//           const peers = await state.wallet.client.getPeers();
//           if (peers && Array.isArray(peers) && peers.length > 0) {
//             setConnectedWallet(peers[0].name);
//           }
//         }
//       } else if (state.wallet instanceof WalletConnect) {
//         setConnectedWallet(state.wallet.getPeerMetadata().name);
//       }
//     };

//     updateWalletInfo();
//   }, [state.wallet]);

//   return (
//     <>
//       {state.userAddress ? (
//         <div className="relative">
//           <button
//             className="flex justify-between items-center p-3 my-2.5 rounded-lg bg-opacity-25 bg-[#50E3C2] backdrop-blur-sm border border-white/20 hover:text-white w-full"
//             onClick={() => setShowDialog(true)}
//           >
//             <span className="flex items-center">
//               <span className="material-icons-outlined">person_outline</span>
//               {shortenHash(state.userAddress)}
//             </span>
//             <span>
//               {state.userBalance
//                 ? `${formatTokenAmount(state.userBalance / 10 ** 6)} ꜩ`
//                 : "0 ꜩ"}
//             </span>
//           </button>

//           <Dialog open={showDialog} onOpenChange={setShowDialog}>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>My wallet</DialogTitle>
//               </DialogHeader>

//               <div className="space-y-4">
//                 <div>Address: {shortenHash(state.userAddress)}</div>
//                 <div>
//                   {state.userBalance && (
//                     <>
//                       Balance: {formatTokenAmount(state.userBalance / 10 ** 6)}{" "}
//                       ꜩ
//                     </>
//                   )}
//                 </div>
//                 <div>Connected to: {state.networkType}</div>
//                 {state.wallet instanceof BeaconWallet && (
//                   <div>Matrix node: {state.matrixNode}</div>
//                 )}
//                 <div>Wallet: {connectedWallet}</div>

//                 <div className="pt-4 border-t border-gray-200">
//                   <button
//                     className="w-full flex items-center justify-center space-x-2 p-2 bg-transparent hover:bg-gray-100 rounded-md"
//                     onClick={disconnectWallet}
//                   >
//                     <span className="material-icons-outlined">
//                       account_balance_wallet
//                     </span>
//                     <span>Disconnect</span>
//                   </button>
//                 </div>

//                 {state.availableAccounts &&
//                   state.availableAccounts.length > 0 && (
//                     <div className="pt-4 border-t border-gray-200">
//                       <h3 className="font-bold uppercase mb-4">
//                         Switch account
//                       </h3>
//                       <div className="space-y-2">
//                         {state.availableAccounts.map((pkh) => (
//                           <button
//                             key={pkh}
//                             className="w-full p-2 text-sm bg-transparent hover:bg-gray-100 rounded-md text-left truncate"
//                             onClick={() => switchActiveAccount(pkh)}
//                           >
//                             {pkh}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       ) : (
//         <Button
//           className="flex items-center p-3 my-2.5 rounded-lg bg-opacity-25 bg-[#50E3C2] backdrop-blur-sm border border-white/20 hover:text-white w-full"
//           onClick={connectWallet}
//         >
//           <span className="ml-2">No wallet connected</span>
//         </Button>
//       )}
//     </>
//   );
// }
