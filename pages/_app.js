import { ChakraProvider } from "@chakra-ui/react"
import { customTheme } from "../styles/theme.js"
import { AuthProvider } from '../lib/auth';

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