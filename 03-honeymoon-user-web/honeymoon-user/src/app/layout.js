import './globals.css';
import { UserAuthProvider } from '../context/auth';

export const metadata = { title: 'HoneyMoon', description: 'Luxury Emirati Weddings' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserAuthProvider>{children}</UserAuthProvider>
      </body>
    </html>
  );
}
