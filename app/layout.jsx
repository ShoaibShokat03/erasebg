import './globals.css';
import AppBlobs from '@/components/AppBlobs';
import AppFooter from '@/components/AppFooter';
import AppHeader from '@/components/AppHeader';
import { appConfig } from '../config';

export const metadata = {
  title: `${appConfig.name} | High Quality & Free`,
  description: appConfig.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" async></script>
      </head>
      <body>
        <AppBlobs />
        <main className="page-wrapper">
          <AppHeader />
          {children}
          <AppFooter />
        </main>
      </body>
    </html>
  );
}
