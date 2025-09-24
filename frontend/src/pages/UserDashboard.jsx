import { useMemo } from 'react';
import { markAlertAsRead, snoozeUserAlert } from '../api';
import { Container, Title, Text, SimpleGrid, Loader, Alert, Stack } from '@mantine/core';
import AlertCard from '../components/User/AlertCard';
import { useAlerts } from '../context/AlertsContext';

export default function UserDashboard() {
  const { alerts, unreadAlerts, otherAlerts, refreshAlerts } = useAlerts() || { alerts: [], unreadAlerts: [], otherAlerts: [], refreshAlerts: () => {} };

  const loading = false; // AlertsProvider handles initial fetch
  const error = '';

  const handleAction = async (action, alertId) => {
    try {
        if(action === 'read') await markAlertAsRead(alertId);
        if(action === 'snooze') await snoozeUserAlert(alertId);
        refreshAlerts();
    } catch (error) {
        // Optionally show error
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red" title="Error">{error}</Alert>;

  return (
    <Container fluid>
      <Title order={1} mb="lg">Your Notifications</Title>
      
      <Stack gap="xl">
        <div>
            <Title order={3} mb="md">New & Reminding</Title>
            {unreadAlerts.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {unreadAlerts.map(alertState => (
                        <AlertCard key={alertState._id} alertState={alertState} onAction={handleAction} />
                    ))}
                </SimpleGrid>
            ) : (
                <Text c="dimmed">You are all caught up!</Text>
            )}
        </div>
        
        <div>
            <Title order={3} mb="md">Read & Snoozed History</Title>
             {otherAlerts.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {otherAlerts.map(alertState => (
                        <AlertCard key={alertState._id} alertState={alertState} onAction={handleAction} />
                    ))}
                </SimpleGrid>
            ) : (
                <Text c="dimmed">No past notifications.</Text>
            )}
        </div>
      </Stack>
    </Container>
  );
}