import React, { useState } from 'react';
import './LandingPage.css';
import logo from '../assets/moneymesh-logo.png';
import { useNavigate } from 'react-router-dom';
import heroLogo from '../assets/herologo.png';

function LandingPage() {
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
          <img src={heroLogo} alt="MoneyMesh Hero Logo" className="hero-logo" />
        </div>
      </section>

      {/* Show forms */}
      {showSignIn && <SignInForm />}
      {showSignUp && <SignUpForm setShowSignIn={setShowSignIn} setShowSignUp={setShowSignUp} />}

      {/* FEATURES */}
      <section id="features" className="features">
        <p className="section-label">FEATURES</p>
        <h2>Everything You Need to Master Your Money</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <img src="https://img.icons8.com/ios-filled/60/receipt.png" alt="Track Expenses" />
            <h3>Track Expenses</h3>
            <p>Log your daily expenses quickly and easily.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/ios-filled/60/budget.png" alt="Budget Planner" />
            <h3>Budget Planner</h3>
            <p>Plan monthly budgets and get alerts when you’re near limits.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/ios-filled/60/combo-chart.png" alt="Visual Reports" />
            <h3>Visual Reports</h3>
            <p>See where your money goes with clear charts.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/ios-filled/60/money-transfer.png" alt="Transactions" />
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
            <p>Log daily transactions to see where your money comes from and goes.</p>
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
            <p>Phone: +254758793305</p>
            <p>Location: Nairobi, Kenya</p>
          </div>
        </div>
        <p className="footer-note">© 2025 MoneyMesh. All rights reserved.</p>
      </footer>
    </div>
  );
}

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fetch users from db.json to validate
   fetch('https://moneymesh.onrender.com/users')

      
      .then(res => res.json())
      .then(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          // Store firstName in localStorage
          localStorage.setItem('user', JSON.stringify({ firstName: user.firstName }));
          alert('Sign in successful! Redirecting to dashboard...');
          navigate('/overview');
        } else {
          alert('Invalid email or password. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error signing in:', err);
        alert('An error occurred. Please try again.');
      });
  };

  return (
    <div className="auth-container">
      <h2>Sign In to MoneyMesh</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

function SignUpForm({ setShowSignIn, setShowSignUp }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract firstName from fullName (first word)
    const firstName = fullName.trim().split(' ')[0];

    const newUser = { firstName, email, password };

      fetch('https://moneymesh.onrender.com/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Account created:', data);
        // Store firstName in localStorage
        localStorage.setItem('user', JSON.stringify({ firstName }));
        alert('Account created! Redirecting to dashboard...');
        setShowSignUp(false);
        navigate('/overview');
      })
      .catch(err => {
        console.error('Error creating account:', err);
        alert('Error creating account. Please try again.');
      });
  };

  return (
    <div className="auth-container">
      <h2>Create Your MoneyMesh Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default LandingPage;