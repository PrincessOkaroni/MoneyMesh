import React, { useState } from 'react';
import './LandingPage.css';
import logo from '../assets/moneymesh-logo.png';

function LandingPage() {
  // NEW: Add state to track which form to show
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="MoneyMesh Logo" className="logo" />
          <span className="brand">MoneyMesh</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
          {/* Make these buttons actually show the forms */}
          <button onClick={() => { setShowSignIn(true); setShowSignUp(false); }} className="sign-in">Sign In</button>
          <button onClick={() => { setShowSignUp(true); setShowSignIn(false); }} className="get-started">Get Started</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>Manage Your Money with Confidence</h1>
          <p>Track expenses, set budgets, and see where your money goes — all in one app.</p>
          <div className="hero-buttons">
            <button onClick={() => { setShowSignUp(true); setShowSignIn(false); }} className="get-started">Join Us For Free</button>
            <button onClick={() => { setShowSignIn(true); setShowSignUp(false); }} className="sign-in">Sign In</button>
          </div>
          <p className="hero-note">Trusted by over 1M users</p>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/400x300" alt="pic" />
        </div>
      </section>

      {/* Show forms if buttons are clicked */}
      {showSignIn && <SignInForm />}
      {showSignUp && <SignUpForm />}

      {/* FEATURES SECTION */}
      <section id="features" className="features">
        <p className="section-label">FEATURES</p>
        <h2>Everything You Need to Master Your Money</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <img src="https://via.placeholder.com/60" alt="Track Expenses" />
            <h3>Track Expenses</h3>
            <p>Log your daily expenses quickly and easily.</p>
          </div>
          <div className="feature-card">
            <img src="https://via.placeholder.com/60" alt="Budget Planner" />
            <h3>Budget Planner</h3>
            <p>Plan monthly budgets and get alerts when you’re near limits.</p>
          </div>
          <div className="feature-card">
            <img src="https://via.placeholder.com/60" alt="Visual Reports" />
            <h3>Visual Reports</h3>
            <p>See where your money goes with clear charts.</p>
          </div>
          <div className="feature-card">
            <img src="https://via.placeholder.com/60" alt="Transactions" />
            <h3>Transactions</h3>
            <p>View and manage all your recent transactions in one place.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works">
        <p className="section-label">HOW IT WORKS</p>
        <h2 className="how-title">Get Started in 3 Easy Steps</h2>
        <div className="steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Your Account</h3>
            <p>Sign up securely with your email and start your financial journey in seconds.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Add Income & Expenses</h3>
            <p>Log daily transactions to see exactly where your money comes from and where it goes.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Set Budgets & See Warnings</h3>
            <p>Set a budget, and get warnings when you’re close to the limit.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about">
        <p className="section-label">ABOUT US</p>
        <h2 className="about-title">Why We Built MoneyMesh</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              MoneyMesh was created to help everyday people take control of their finances.
              We believe managing your money should be simple, empowering, and even a little fun.
              From tracking your daily expenses to setting budgets and getting helpful alerts,
              MoneyMesh is designed to guide you toward financial peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logo} alt="MoneyMesh Logo" className="footer-logo" />
            <span>MoneyMesh</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-contact">
            <p>Email: <a href="mailto:support@moneymesh.com">support@moneymesh.com</a></p>
            <p>Phone: <a href="tel:+254700000000">+254758793305</a></p>
            <p>Location: Nairobi, Kenya</p>
          </div>
        </div>
        <p className="footer-note">© 2025 MoneyMesh. All rights reserved.</p>
      </footer>
    </div>
  );
}

function SignInForm() {
  return (
    <div className="auth-container">
      <h2>Sign In to MoneyMesh</h2>
      <form className="auth-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

function SignUpForm() {
  return (
    <div className="auth-container">
      <h2>Create Your MoneyMesh Account</h2>
      <form className="auth-form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default LandingPage;
