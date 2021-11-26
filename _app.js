import '../styles/globals.css';
import 'react-responsive-modal/styles.css'
import {Provider} from "next-auth/client"
function MyApp({ Component, pageProps }) {
  return (
    <Provider >
    <Component {...pageProps} />
      </Provider>
    )
}

export default MyApp
