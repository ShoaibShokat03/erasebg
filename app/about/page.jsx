import Link from 'next/link';
import { appConfig } from '../../config';

export const metadata = {
  title: `About Us | ${appConfig.fullName}`,
  description: appConfig.description,
};

export default function About() {
  return (
    <div className="app-container glass-panel content-card">
      <Link href="/" className="back-link">
        <i className="fa-solid fa-arrow-left"></i> Back to Tool
      </Link>
      
      <h1>About {appConfig.name}</h1>
      
      <p>Welcome to {appConfig.name}, your trusted destination for professional, fast, and completely secure image background removal. We believe that high-quality design tools should be accessible to everyone, from professional graphic designers and e-commerce entrepreneurs to everyday users looking to enhance their personal photos.</p>
      
      <h2>Our Mission</h2>
      <p>Our mission is simple: to provide a seamless, state-of-the-art AI-powered background removal experience that prioritizes user privacy and workflow efficiency. In a digital world where data privacy is paramount, we designed {appConfig.name} to operate by keeping your sensitive images isolated, ensuring your data remains entirely yours.</p>
      
      <h2>Why Choose {appConfig.name}?</h2>
      <ul>
        <li><strong>Uncompromised Privacy:</strong> Your images are processed securely. We do not store, distribute, or sell your uploaded photos to third parties.</li>
        <li><strong>High-Precision AI:</strong> Powered by robust neural networks, our tool accurately distinguishes between complex foregrounds (like hair and fur) and their backgrounds in milliseconds.</li>
        <li><strong>Batch Processing Efficiency:</strong> We know your time is valuable. Our platform supports lightning-fast multi-image uploads, allowing you to optimize your workflow with dynamic ZIP downloads.</li>
        <li><strong>Optimized File Sizes:</strong> Output transparency shouldn't mean bloated files. Our dynamic resizing engine allows you to download perfectly compressed PNGs and WEBPs.</li>
      </ul>

      <h2>Committed to Excellence</h2>
      <p>We are constantly evolving and refining our AI models to bring you the sharpest, cleanest cutouts possible. Whether you are creating marketing materials, removing backgrounds for your online store, or designing social media posts, {appConfig.name} is built to accelerate your creativity.</p>
      
      <p>Thank you for choosing {appConfig.name}. We look forward to being a part of your creative journey.</p>
    </div>
  );
}
