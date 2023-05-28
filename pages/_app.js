import App from "next/app";
import Head from "next/head";
import "@/assets/css/style.css";
import { createContext } from "react";
import { fetchAPI } from "@/lib/api";
import { getStrapiMedia } from "@/lib/media";


// Guarda objeto global do Strapi em um Context
export const GlobalContext = createContext({});

const MyApp = ({Component, pageProps}) => {
    const { global } = pageProps;

    return (
        <>
            <Head>
                <Link
                    rel="shortcut icon"
                    href={getStrapiMedia(global.attributes.favicon)}
                />    
            </Head>

            <GlobalContext.Provider value={global.attributes}>
                <Component {...pageProps} />
            </GlobalContext.Provider>

        </>
    );
};


    // getInitialProps desativa automaticamente a otimização para paginas que não tem getStaticProps
    // Então artigo, categoria e home pages ainda tem SSG.
    // Esperamos substituir isso por getStaticProps quando este issue for resolvido

    MyApp.getInitialProps = async (ctx) => {
        // chama o getInitialProps da pagina e preenche appProps.pageProps
        const appProps = await App.getInitialProps(ctx);

        // pega configurações globais do site de dentro do Strapi
        const globalRes = await fetchAPI("/global", {
            populate: {
                favicon: "*",
                defaultSeo: {
                    populate: "*",
                },
            },
        });

        // passa os dados para a pagina via props
        return { ...appProps, pageProps: {global: globalRes.data}};
    };

    export default MyApp;
