import Link from 'next/link';
import { appConfig } from '../../config';

export const metadata = {
  title: `Privacy Policy | ${appConfig.name}`,
  description: `Read the ${appConfig.name} Privacy Policy. Learn how we protect your personal information and uploaded images when using our AI background removal service.`,
};

export default function Privacy() {
  return (
    <div className="app-container glass-panel content-card">
      <Link href="/" className="back-link">
        <i className="fa-solid fa-arrow-left"></i> Back to Tool
      </Link>

      <h1>Privacy Policy</h1>
      <span className="last-updated">Last Updated: February 22, 2026</span>

      <p>At {appConfig.name}, accessible from our web platform, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {appConfig.name} and how we use it.</p>

      <h2>1. Image Processing & Data Storage</h2>
      <p>Our core service involves modifying digital images using our Artificial Intelligence model. <strong>Your privacy is mathematically guaranteed by our architecture:</strong></p>
      <ul>
        <li><strong>No Image Retention:</strong> All uploaded images are processed entirely in server memory (RAM). We do NOT permanently save, back up, or store your uploaded image files or the resulting output files to any database or hard drive.</li>
        <li><strong>Instant Deletion:</strong> As soon as the background removal process completes and the file is streamed back to your browser, all memory associated with your image is permanently erased from our servers in milliseconds.</li>
        <li><strong>No Third Party APIs:</strong> The AI model runs entirely on our proprietary local hardware. Your images are never forwarded, sent, or analyzed by external third-party companies.</li>
      </ul>

      <h2>2. Log Files & Analytics</h2>
      <p>{appConfig.name} follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

      <h2>5. Children's Information</h2>
      <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. {appConfig.name} does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>

      <h2>6. Consent</h2>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
    </div>
  );
}
