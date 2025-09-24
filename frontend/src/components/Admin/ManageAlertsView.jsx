import { useEffect, useState } from 'react';
import { getAdminAlerts, archiveAlert } from '../../api';
import { Table, Loader, Alert, Badge, Group, ActionIcon, Text } from '@mantine/core';
import { IconArchive, IconClock } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';

const severityColors = {
  Info: 'blue',
  Warning: 'orange',
  Critical: 'red',
};

export default function ManageAlertsView() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            const res = await getAdminAlerts();
            setAlerts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleArchive = async (id) => {
        try {
            await archiveAlert(id);
            notifications.show({ title: 'Success', message: 'Alert archived!', color: 'green' });
            fetchAlerts();
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to archive alert.', color: 'red' });
        }
    };

    if (loading) return <Loader />;
    
    const rows = alerts.map((alert) => {
        const isExpired = dayjs().isAfter(alert.expiryTime);
        return (
            <Table.Tr key={alert._id}>
                <Table.Td>
                    <Text fw={500}>{alert.title}</Text>
                    <Text size="xs" c="dimmed">{alert.message.substring(0, 50)}...</Text>
                </Table.Td>
                <Table.Td><Badge color={severityColors[alert.severity]}>{alert.severity}</Badge></Table.Td>
                <Table.Td><Badge color={isExpired ? 'gray' : 'green'} variant="light" leftSection={<IconClock size={14}/>}>{isExpired ? 'Expired' : 'Active'}</Badge></Table.Td>
                <Table.Td>{alert.visibility.type}</Table.Td>
                <Table.Td>{dayjs(alert.expiryTime).format('MMM D, YYYY h:mm A')}</Table.Td>
                <Table.Td>
                    <Group>
                        <ActionIcon variant="outline" color="red" onClick={() => handleArchive(alert._id)}>
                            <IconArchive size={16} />
                        </ActionIcon>
                    </Group>
                </Table.Td>
            </Table.Tr>
        )
    });

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Severity</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Visibility</Table.Th>
                        <Table.Th>Expires</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}