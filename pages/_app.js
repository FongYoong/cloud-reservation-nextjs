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
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <AuthProvider>
        <Head>
        {/* Import CSS for nprogress */}
          <link rel="stylesheet" type="text/css" href="/nprogress/nprogress.css" />
        </Head>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp