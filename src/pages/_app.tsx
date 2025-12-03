import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GovAI Search</title>
        <meta
          name="description"
          content="AI-powered government contract search & proposal assistant"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
