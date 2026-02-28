"use client";

import { useState } from 'react';
import { appConfig } from '../config';

export default function ContactForm() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    const text = `New Contact Form Submission:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`;

    try {
      const res = await fetch(appConfig.ntfyUrl, {
        method: 'POST',
        body: text,
      });

      if (res.ok) {
        setStatus('success');
        e.target.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      
      // Log to server-side errors.txt
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            error: err.message, 
            stack: err.stack, 
            context: 'CLIENT_CONTACT_FORM' 
        })
      }).catch(e => console.error('Failed to report error to server:', e));

      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {status === 'success' && <div style={{ color: 'limegreen', marginBottom: '1rem', fontWeight: 'bold' }}>Message sent successfully!</div>}
      {status === 'error' && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>Failed to send message. Please try again later.</div>}

      <div className="form-group">
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" name="name" className="form-control" placeholder="John Doe" required />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" className="form-control" placeholder="john@example.com" required />
      </div>
      
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <select id="subject" name="subject" className="form-control" required defaultValue="">
          <option value="" disabled>Select a topic...</option>
          <option value="support">Technical Support</option>
          <option value="feedback">Feature Feedback</option>
          <option value="business">Business Inquiry</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" className="form-control" placeholder="How can we help you?" required></textarea>
      </div>
      
      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} disabled={status === 'submitting'}>
        <i className="fa-solid fa-paper-plane"></i> {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
