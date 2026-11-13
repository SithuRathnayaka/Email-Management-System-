import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { setUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Enter a username and password to continue.');
      return;
    }
    setError('');
    setUser({
      name: username.trim().toLowerCase() === 'admin' ? 'CDCE Administrator' : username.trim(),
      role: username.trim().toLowerCase() === 'admin' ? 'Director' : 'Administrative Officer',
    });
  };

  return (
    <main className="login-page">
      <div className="login-decoration login-decoration-one" />
      <div className="login-decoration login-decoration-two" />
      <section className="login-layout">
        <aside className="login-showcase">
          <div className="login-showcase-brand">
            <img src="/assets/cdce-logo.png" alt="University of Peradeniya seal" />
            <span><strong>UNIVERSITY OF PERADENIYA</strong><small>Centre for Distance and Continuing Education</small></span>
          </div>
          <div className="login-showcase-content">
            <div className="login-showcase-copy">
              <span className="login-showcase-eyebrow"><i /> OFFICIAL <strong>CDCE</strong> COMMUNICATIONS</span>
              <h2>One community.<br /><span>Connected.</span></h2>
              <p>A dedicated space for official email updates from the Centre for Distance and Continuing Education.</p>
              <div className="login-audience-list"><span><Users size={14} /> Staff</span><span>Lecturers</span><span>Students</span></div>
            </div>
            <div className="login-showcase-seal"><img src="/assets/cdce-logo.png" alt="" /></div>
          </div>
          <div className="login-showcase-footer"><span className="showcase-footer-mark" /> CDCE <span className="showcase-footer-divider">·</span> University of Peradeniya</div>
        </aside>
        <section className="login-card">
          <div className="login-card-label"><span><Mail size={17} /></span> ADMINISTRATOR SIGN-IN</div>
          <div className="login-heading">
            <h1>Welcome back</h1>
            <p>Sign in to the CDCE Email Management System.</p>
          </div>
          <form className="login-form" onSubmit={submit}>
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-with-icon"><UserRound size={17} /><input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your username" /></div>
            <div className="password-label-row"><label className="form-label" htmlFor="password">Password</label><a href="#forgot-password" onClick={(event) => { event.preventDefault(); setError('Password recovery will be available when authentication is connected.'); }}>Forgot password?</a></div>
            <div className="input-with-icon"><LockKeyhole size={17} /><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            <label className="checkbox-label remember-label"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Remember me</label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary login-submit" type="submit">Sign in <ArrowRight size={16} /></button>
          </form>
          <div className="demo-note"><span className="demo-note-dot" /><span><strong>Frontend demo</strong> — use any non-empty username and password.</span></div>
          <p className="login-footer">Access for CDCE administrative users</p>
        </section>
      </section>
      <p className="login-copyright">© 2026 Centre for Distance and Continuing Education</p>
    </main>
  );
}
