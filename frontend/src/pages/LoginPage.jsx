import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Group, LoadingOverlay, Text, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com'); // Pre-fill for demo
  const [password, setPassword] = useState('password123'); // Pre-fill for demo
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in context
    } finally {
      setLoading(false);
    }
  };

  const coverUrl = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div
        style={{ flex: 1, display: 'none', position: 'relative' }}
        className="login-cover alert-hero"
      >
        <div className="alert-cards">
          <div className="alert-card">
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#f97316' }} />
            <div>
              <div style={{ fontWeight: 700 }}>System Maintenance</div>
              <div style={{ opacity: 0.85, fontSize: 12 }}>Tonight 11 PM - 12 AM UTC</div>
            </div>
          </div>
          <div className="alert-card">
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#ef4444' }} />
            <div>
              <div style={{ fontWeight: 700 }}>Critical: API Latency</div>
              <div style={{ opacity: 0.85, fontSize: 12 }}>Investigating increased response times</div>
            </div>
          </div>
          <div className="alert-card">
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#10b981' }} />
            <div>
              <div style={{ fontWeight: 700 }}>Resolved: Email Delivery</div>
              <div style={{ opacity: 0.85, fontSize: 12 }}>Queued messages sent successfully</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Container size={420} my={40}>
          <Title ta="center">Welcome Back!</Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Login to access your dashboard.
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
            <LoadingOverlay visible={loading} />
            <form onSubmit={handleSubmit}>
              <TextInput label="Email" placeholder="you@example.com" required classNames={{ input: 'field-border' }} value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
              <PasswordInput label="Password" placeholder="Your password" required mt="md" classNames={{ input: 'field-border' }} value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
              <Button fullWidth mt="xl" type="submit">Sign in</Button>
              <Text size="sm" ta="center" mt="md">
                New here?{' '}<Anchor component={Link} to="/signup">Create an account</Anchor>
              </Text>
            </form>
            
          </Paper>
        </Container>
      </div>
    </div>
  );
}