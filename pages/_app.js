import { SessionProvider } from "next-auth/react"; // Import ThemeProvider
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
                <Component {...pageProps} />
        </SessionProvider>
    );
}
