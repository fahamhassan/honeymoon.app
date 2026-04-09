import './globals.css';
import { VendorAuthProvider } from '../context/auth';

export const metadata = { title: 'HoneyMoon Vendor', description: 'Vendor Dashboard' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VendorAuthProvider>{children}</VendorAuthProvider>
      </body>
    </html>
  );
}
