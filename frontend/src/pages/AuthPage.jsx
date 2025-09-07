import GitHubCorner from "../components/GitHubCorner";
import "../styles/auth.css";
import { SignInButton } from "@clerk/clerk-react";

const AuthPage = () => {
  return (
    <div>
      {/* Github corner button */}
      <GitHubCorner
        repoUrl="https://github.com/AmanRai8/chat_app"
        target="_blank"
        position="left" // or "right"
      />
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-hero">
            <div className="brand-container">
              <img src="/logo.png" alt="WorkTalk Logo" className="brand-logo" />
              <span className="brand-name">WorkTalk</span>
            </div>

            <h1 className="hero-title">Where Work Happens ✨</h1>

            <p className="hero-subtitle">
              Connect with your team instantly through secure, real-time
              messaging. Experience seamless collaboration with powerful
              features designed for modern teams.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">💬</span>
                <span>Real-time messaging</span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🎥</span>
                <span>Video calls & meetings</span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure & private</span>
              </div>
            </div>

            <SignInButton mode="modal">
              <button className="cta-button">
                Get Started with WorkTalk
                <span className="button-arrow">→</span>
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
