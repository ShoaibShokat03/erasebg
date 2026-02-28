import Link from 'next/link';
import { appConfig } from '../../config';

export const metadata = {
  title: `Frequently Asked Questions | ${appConfig.fullName}`,
  description: `FAQ for ${appConfig.name} - We answer your common questions about our AI background remover.`,
};

export default function FAQ() {
  return (
    <div className="app-container glass-panel content-card">
      <Link href="/" className="back-link">
        <i className="fa-solid fa-arrow-left"></i> Back to Tool
      </Link>
      
      <h1>Frequently Asked Questions</h1>
      <p>Find answers to common questions about {appConfig.name} below.</p>
      
      <div className="faq-item" style={{ marginTop: '2rem' }}>
        <h3>1. Is {appConfig.name} really free to use?</h3>
        <p>Yes, absolutely! Our background removal tool is 100% free with no hidden charges, subscriptions, or watermarks on your downloaded images.</p>
      </div>

      <div className="faq-item" style={{ marginTop: '1.5rem' }}>
        <h3>2. What happens to my photos after I upload them?</h3>
        <p>Your privacy is our top priority. We do not store, distribute, or sell your uploaded photos. The images are processed instantly on our isolated servers and are entirely discarded after the background is removed.</p>
      </div>

      <div className="faq-item" style={{ marginTop: '1.5rem' }}>
        <h3>3. Are there any image size or batch upload limits?</h3>
        <p>Yes. To maintain high-speed processing for all users, you can upload a maximum of {appConfig.maxImagesLimit} images per batch, and each individual image must be {appConfig.maxImageSizeMB}MB or smaller.</p>
      </div>

      <div className="faq-item" style={{ marginTop: '1.5rem' }}>
        <h3>4. What image formats do you support?</h3>
        <p>You can upload most standard image formats, including JPG, JPEG, PNG, and WEBP. Our tool optimally returns high-quality transparent PNG files so you don't lose any detail.</p>
      </div>

      <div className="faq-item" style={{ marginTop: '1.5rem' }}>
        <h3>5. How does the background removal AI work?</h3>
        <p>We use state-of-the-art neural networks (specifically briaai/RMBG-1.4 parameters) which have been trained to distinguish between foreground subjects (like people, pets, and products) and complex backgrounds with high precision.</p>
      </div>

      <div className="faq-item" style={{ marginTop: '1.5rem' }}>
        <h3>6. Can I use the resulting images for commercial purposes?</h3>
        <p>Yes! Once the background is removed, the resulting image is entirely yours to use for personal projects, e-commerce stores, social media marketing, and any other commercial purposes.</p>
      </div>

      <div className="faq-item" style={{ marginTop: '1.5rem' }}>
        <h3>7. What if the AI doesn't remove the background perfectly?</h3>
        <p>While our AI is highly accurate, extremely complex backgrounds with poor lighting or subjects that match the background color can sometimes be challenging. We continuously update our AI models behind the scenes to improve edge-handling (like hair and fur) over time.</p>
      </div>

      <br />
      <p>Still have questions? Feel free to <Link href="/contact" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>contact us</Link>.</p>
    </div>
  );
}
