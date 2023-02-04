import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "@/components/Header";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";

function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Charity Raffle</title>
        <meta
          name="description"
          content="Charity Raffle Smart Contract Frontend"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default App;
