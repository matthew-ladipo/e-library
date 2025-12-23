"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Library, Users, Star } from "lucide-react";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Invalid credentials");
        setLoading(false);
        return;
      }

      // On success, redirect to dashboard (or wherever appropriate)
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
      console.error(err);
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Hero Text */}
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Discover Your Next Great Read
            </h1>
            <p className={styles.heroSubtitle}>
              Access thousands of books, create collections, and share your favorite reads with our e-Library platform.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <Library className={styles.featureIcon} size={20} />
                <span>Extensive Collection</span>
              </div>
              <div className={styles.feature}>
                <Users className={styles.featureIcon} size={20} />
                <span>Community Driven</span>
              </div>
              <div className={styles.feature}>
                <Star className={styles.featureIcon} size={20} />
                <span>Curated Selections</span>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className={styles.loginCard}>
            <div className={styles.brand}>
              <div className={styles.logo}>
                <BookOpen className={styles.icon} />
              </div>
              <h2>e-Library</h2>
              <p className={styles.lead}>Sign in to your account</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className={styles.options}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Remember me</span>
                </label>
                <a href="#" className={styles.forgotLink}>Forgot password?</a>
              </div>

              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
              {error && <p className={styles.error}>{error}</p>}
            </form>

            <div className={styles.footer}>
              <p className={styles.footerText}>
                Don't have an account?{" "}
                <a className={styles.link} href="/auth/register">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

