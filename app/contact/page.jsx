import Link from 'next/link';
import { appConfig } from '../../config';
import ContactForm from '../../components/ContactForm';

export const metadata = {
  title: `Contact Us | ${appConfig.name}`,
  description: `Reach out to the ${appConfig.name} support team with any questions or issues regarding our AI background removal tool.`,
};

export default function Contact() {
  return (
    <div className="app-container glass-panel content-card">
      <Link href="/" className="back-link">
        <i className="fa-solid fa-arrow-left"></i> Back to Tool
      </Link>
      
      <h1>Contact Us</h1>
      
      <p>We're here to help. If you're experiencing technical difficulties, have suggestions for new features, or wish to report a bug with our AI model or website, please do not hesitate to reach out.</p>
      
      <p><strong>Email Address:</strong> {appConfig.contactEmail}</p>

      <ContactForm />
    </div>
  );
}
