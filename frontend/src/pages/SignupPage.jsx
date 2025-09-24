import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Paper, Title, TextInput, PasswordInput, Button, LoadingOverlay, Select, Text, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('User');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return; // Basic guard; notification is shown in context on failure
    }
    setLoading(true);
    try {
      await signup({ name, email, password, role });
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
          <Title ta="center">Create your account</Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Sign up to start using the platform.
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
            <LoadingOverlay visible={loading} />
            <form onSubmit={handleSubmit}>
              <TextInput label="Name" placeholder="Your name" required classNames={{ input: 'field-border' }} value={name} onChange={(e) => setName(e.currentTarget.value)} />
              <TextInput mt="md" label="Email" placeholder="you@example.com" required classNames={{ input: 'field-border' }} value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
              <PasswordInput mt="md" label="Password" placeholder="Create a password" required classNames={{ input: 'field-border' }} value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
              <PasswordInput mt="md" label="Confirm password" placeholder="Re-enter password" required classNames={{ input: 'field-border' }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} />
              <Select mt="md" label="Role" data={[{ value: 'User', label: 'User' }, { value: 'Admin', label: 'Admin' }]} classNames={{ input: 'field-border' }} value={role} onChange={(v) => setRole(v || 'User')} />
              <Button fullWidth mt="xl" type="submit">Create account</Button>
            </form>
            <Text size="sm" ta="center" mt="md">
              Already have an account?{' '}<Anchor component={Link} to="/login">Sign in</Anchor>
            </Text>
          </Paper>
        </Container>
      </div>
    </div>
  );
}


