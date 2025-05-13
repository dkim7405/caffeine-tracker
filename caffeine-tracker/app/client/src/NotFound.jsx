import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div style={{
            fontFamily: 'sans-serif',
            textAlign: 'center',
            marginTop: '100px'
        }}>
            <h1 style={{ fontSize: '48px' }}>404</h1>
            <p style={{ fontSize: '18px' }}>
                Page not found.
            </p>
            <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                Go back home
            </Link>
        </div>
    );
}

export default NotFound;
