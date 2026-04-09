import './globals.css';
import { AdminAuthProvider } from '../context/auth';

export const metadata = { title: 'HoneyMoon — Admin', description: 'HoneyMoon Admin Control Panel' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </body>
    </html>
  );
}
