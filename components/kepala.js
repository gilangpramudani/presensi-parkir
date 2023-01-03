import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

export default function Kepala({ title }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Tampan dan Pemberani" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NextNProgress color="#29D" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />

        </>
    )
}