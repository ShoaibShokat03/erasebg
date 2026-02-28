import Link from 'next/link';
import { appConfig } from '../config';

export default function AppHeader() {
    return (
        <header className="app-header" style={{ marginBottom: '1.5rem' }}>
            <div className="logo">
                <i className="fa-solid fa-shapes logo-icon"></i>
                <h1>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {appConfig.name.replace('BG', '')}<span className="accent-text">BG</span>
                    </Link>
                </h1>
            </div>
            <p className="subtitle">{appConfig.longDescription}</p>
        </header>
    );
}
