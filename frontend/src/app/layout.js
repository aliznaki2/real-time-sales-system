import { Inter } from 'next/font/google';

import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Real-Time Sales Monitor',
  description: 'E-commerce sales monitoring system',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className='min-h-screen bg-gray-50'>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
