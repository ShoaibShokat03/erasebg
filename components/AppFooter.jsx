import Link from 'next/link';
import { appConfig } from '../config';

export default function AppFooter() {
    return (
        <footer className="app-footer">
            <p style={{ marginBottom: '0.5rem' }}>Runs entirely locally. Privacy guaranteed. &copy; {appConfig.footerYear} {appConfig.name}.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', fontSize: '0.85rem', paddingTop: '0.5rem' }}>
                <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
                <Link href="/about" style={{ color: 'var(--primary)', textDecoration: 'none' }}>About</Link>
                <Link href="/faq" style={{ color: 'var(--primary)', textDecoration: 'none' }}>FAQ</Link>
                <Link href="/contact" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Contact</Link>
                <Link href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy Policy</Link>
                <Link href="/terms" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Terms of Service</Link>
            </div>
        </footer>
    );
}
