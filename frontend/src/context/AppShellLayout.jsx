import { AppShell, Group, Text, Button, Indicator } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBellRinging, IconLogout } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from './AlertsContext';

export default function AppShellLayout({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const { user, logout } = useAuth();
  const { unreadCount } = useAlerts() || { unreadCount: 0 };

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header style={{
        background: 'linear-gradient(135deg, #0b1f3b 0%, #0e2a59 50%, #0a2342 100%)',
        color: '#e6eefc',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Indicator disabled={unreadCount === 0} label={unreadCount} size={18} color="red">
              <IconBellRinging size={28} color="#93c5fd" />
            </Indicator>
            <Text fw={800} size="xl" c="#eef6ff">Alertify</Text>
          </Group>
          {user && (
            <Group>
              <Text c="#e6eefc">Welcome, {user.name} ({user.role})</Text>
              <Button onClick={logout} variant="light" color="red" leftSection={<IconLogout size={14}/>}>Logout</Button>
            </Group>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {children}
        <div style={{ textAlign: 'center', marginTop: 24, opacity: 0.85, color: '#e6eefc' }}>
          Made by Bhuvnesh Sahu
        </div>
      </AppShell.Main>
    </AppShell>
  );
}