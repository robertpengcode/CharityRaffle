import { contractAddresses, abi } from "../../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Form, useNotification } from "web3uikit";

const Admin = () => {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const { runContractFunction } = useWeb3Contract();
  const chainId = parseInt(chainIdHex);
  //console.log(`ChainId is ${chainId}`);
  const charityRaffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const dispatch = useNotification();

  async function handleCreateRaffle(data) {
    //console.log("create raffle...", data);
    const charityAddr = data.data[0].inputResult;
    const description = data.data[1].inputResult;
    const interval = data.data[2].inputResult * 3600;
    const createObject = {
      abi: abi,
      contractAddress: charityRaffleAddress,
      functionName: "createRaffle",
      params: {
        charityAddr: charityAddr,
        description: description,
        interval: interval,
      },
    };
    await runContractFunction({
      params: createObject,
      onSuccess: handleSuccess,
      onError: (error) => {
        console.log(error);
      },
    });
  }

  async function handleDeleteRaffle() {
    //console.log("delete raffle...");
    const deleteObject = {
      abi: abi,
      contractAddress: charityRaffleAddress,
      functionName: "deleteRaffle",
      params: {},
    };
    await runContractFunction({
      params: deleteObject,
      onSuccess: handleSuccess,
      onError: (error) => {
        console.log(error);
      },
    });
  }

  async function handleWithdrawBalance() {
    //console.log("withdraw balance...");
    const withdrawObject = {
      abi: abi,
      contractAddress: charityRaffleAddress,
      functionName: "withdrawBalance",
      params: {},
    };
    await runContractFunction({
      params: withdrawObject,
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
        Admin's Menu
      </h1>
      <Form
        onSubmit={handleCreateRaffle}
        data={[
          {
            name: "Charity Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "charityAddr",
          },
          {
            name: "Description",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "description",
          },
          {
            name: "Interval in Hours",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "interval",
          },
        ]}
        title="Create Raffle"
        id="Main Form"
      />
      <div>
        <button
          className="bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded ml-4 mt-4"
          onClick={handleDeleteRaffle}
        >
          Delete Raffle
        </button>
      </div>
      <div>
        <button
          className="bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded ml-4 mt-4"
          onClick={handleWithdrawBalance}
        >
          Withdraw Balance
        </button>
      </div>
    </div>
  );
};

export default Admin;
