import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../styles/theme.js";
import { AuthProvider } from '../lib/auth';
import Router from 'next/router';
import Head from 'next/head';
import NProgress from 'nprogress';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', (url) => {
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => {
  NProgress.done();
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
})
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <AuthProvider>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" type="text/css" href="/nprogress/nprogress.css" /> {/* Import CSS for nprogress */}
        </Head>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp