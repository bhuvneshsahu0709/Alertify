import { Card, Text, Badge, Button, Group, Stack } from '@mantine/core';
import { IconBellRinging, IconBellZ, IconCircleCheck } from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const severityColors = {
  Info: 'blue',
  Warning: 'orange',
  Critical: 'red',
};

export default function AlertCard({ alertState, onAction }) {
    const { alertId: alert, status, snoozedUntil } = alertState;
    const isSnoozed = snoozedUntil && dayjs(snoozedUntil).isAfter(dayjs());
    const isRead = status === 'Read';

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack justify="space-between" h="100%">
                <div>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>{alert.title}</Text>
                        <Badge color={severityColors[alert.severity]} variant="light">
                            {alert.severity}
                        </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{alert.message}</Text>
                    <Text size="xs" c="dimmed" mt="sm">Received {dayjs(alert.createdAt).fromNow()}</Text>
                     {isSnoozed && (
                        <Badge color="gray" mt="sm" variant="outline" leftSection={<IconBellZ size={14}/>}>
                            Snoozed until end of day
                        </Badge>
                    )}
                    {isRead && (
                         <Badge color="green" mt="sm" variant="outline" leftSection={<IconCircleCheck size={14}/>}>
                            Read
                        </Badge>
                    )}
                </div>

                <Group mt="md">
                    <Button 
                        variant="light" 
                        color="blue" 
                        fullWidth 
                        onClick={() => onAction('read', alert._id)}
                        disabled={isRead}
                    >
                        Mark as Read
                    </Button>
                    <Button 
                        variant="outline" 
                        color="gray" 
                        fullWidth 
                        onClick={() => onAction('snooze', alert._id)}
                        disabled={isSnoozed || isRead}
                    >
                        Snooze for Today
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}