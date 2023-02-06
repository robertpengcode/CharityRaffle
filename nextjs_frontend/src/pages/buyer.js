import { contractAddresses, abi } from "../../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

const Buyer = () => {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const { runContractFunction } = useWeb3Contract();
  const chainId = parseInt(chainIdHex);
  //console.log(`ChainId is ${chainId}`);
  const charityRaffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const dispatch = useNotification();
  const ticketPrice = ethers.utils.parseEther("0.001");

  async function handleBuyRaffle() {
    //console.log("buy raffle...");
    const buyObject = {
      abi: abi,
      contractAddress: charityRaffleAddress,
      functionName: "buyRaffle",
      msgValue: ticketPrice,
      params: {},
    };
    await runContractFunction({
      params: buyObject,
      onSuccess: handleSuccess,
      onError: (error) => {
        console.log(error);
      },
    });
  }

  async function handleMakePayments() {
    //console.log("pay charity & winner...");
    const payObject = {
      abi: abi,
      contractAddress: charityRaffleAddress,
      functionName: "makePayments",
      params: {},
    };
    await runContractFunction({
      params: payObject,
      onSuccess: handleSuccess,
      onError: (error) => {
        console.log(error);
      },
    });
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      handleNewNotification(tx);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="mt-4 ml-4 font-bold text-2xl text-sky-700">
        Buyer's Menu
      </h1>

      <div className="mt-4 ml-4">Ticket Price (Ether): 0.001</div>
      <div>
        <button
          className="bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded ml-4 mt-4"
          onClick={handleBuyRaffle}
        >
          Buy Raffle
        </button>
      </div>
      <div>
        <button
          className="bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded ml-4 mt-4"
          onClick={handleMakePayments}
        >
          Pay Charity & Winner
        </button>
      </div>
    </div>
  );
};

export default Buyer;
