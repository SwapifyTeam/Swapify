import { Link } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react'

export default function Navbar() {
  const { isSignedIn } = useAuth()

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="swap-icon" aria-hidden="true">⇄</span>
          Swap<span className="brand-accent">ify</span>
        </Link>

        {/* Nav links */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>

          {isSignedIn && (
            <Link to="/listings/new" className="navbar-link">Sell Item</Link>
          )}

          {isSignedIn ? (
            <>
              <Link to="/listings/new" className="btn btn-primary btn-sm">
                + List Item
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn btn-ghost btn-sm">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-sm">Get Started</button>
              </SignUpButton>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
