import { contractAddresses, abi } from "../../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { Form, useNotification, Button } from "web3uikit";
import { ethers } from "ethers";

const Admin = () => {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const { runContractFunction } = useWeb3Contract();
  const chainId = parseInt(chainIdHex);
  console.log(`ChainId is ${chainId}`);
  const charityRaffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const dispatch = useNotification();

  async function handleCreateRaffle(data) {
    console.log("create raffle...", data);
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
      onSuccess: handleCreateSuccess,
      onError: (error) => {
        console.log(error);
      },
    });
  }

  //   async function updateUIValues() {
  //     //const raffleInfoFromCall = (await getRaffleInfo()).toString();
  //     const raffleInfoFromCall = await getRaffleInfo();
  //     console.log(raffleInfoFromCall);
  //   }

  //   useEffect(() => {
  //     if (isWeb3Enabled) {
  //       updateUIValues();
  //     }
  //   }, [isWeb3Enabled]);

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const handleCreateSuccess = async (tx) => {
    try {
      await tx.wait(1);
      //updateUIValues();
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
    </div>
  );
};

export default Admin;
