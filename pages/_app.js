import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../styles/theme.js";
import { AuthProvider } from '../lib/auth';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp