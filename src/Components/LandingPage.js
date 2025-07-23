import React from 'react';
import './LandingPage.css';
import logo from '../assets/moneymesh-logo.png';

function LandingPage() {
  return (
    <div className="landing">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="MoneyMesh Logo" className="logo" />
          <span className="brand">MoneyMesh</span>
        </div>
        <div className="nav-links">
          <a href="/features">Features</a>
          <a href="/how-it-works">How It Works</a>
          <a href="/about">About</a>
          <button className="sign-in">Sign In</button>
          <button className="get-started">Get Started</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>Manage Your Money with Confidence</h1>
          <p>Track expenses, set budgets, and see where your money goes  all in one a single app.</p>
          <div className="hero-buttons">
            <button className="get-started">Join Us For Free</button>
            <button className="sign-in">Sign In</button>
          </div>
          <p className="hero-note">Trusted by over 1M users</p>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/400x300" alt=" screenshot" />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
