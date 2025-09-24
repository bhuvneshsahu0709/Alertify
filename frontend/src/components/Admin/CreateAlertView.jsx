import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { TextInput, Textarea, Select, SegmentedControl, MultiSelect, Switch, Button, Box, Group } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useCallback, useEffect, useState } from 'react';
import { createAlert, getTargetUsersAndTeams } from '../../api';
import { notifications } from '@mantine/notifications';

export default function CreateAlertView() {
    const [targets, setTargets] = useState({ users: [], teams: [] });

    const fetchTargets = useCallback(async () => {
        const res = await getTargetUsersAndTeams();
        setTargets({
            users: (res.data.users || []).map(u => ({ value: u._id, label: u.name })),
            teams: (res.data.teams || []).map(t => ({ value: t._id, label: t.name })),
        });
    }, []);

    useEffect(() => {
        // Initial load
        fetchTargets();

        // Periodic refresh so new signups/teams show up without reload
        const interval = setInterval(fetchTargets, 10000);

        // Refresh when window refocuses or tab becomes visible
        const onFocus = () => fetchTargets();
        const onVisibility = () => { if (document.visibilityState === 'visible') fetchTargets(); };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [fetchTargets]);

    

    const form = useForm({
        initialValues: {
            title: '',
            message: '',
            severity: 'Info',
            visibilityType: 'Organization',
            targetUsers: [],
            targetTeams: [],
            expiryTime: dayjs().add(7, 'day').toDate(),
            remindersEnabled: true,
        },
        validate: {
            title: (value) => (value.length < 3 ? 'Title must be at least 3 characters long' : null),
            message: (value) => (value.length < 10 ? 'Message must be at least 10 characters long' : null),
            expiryTime: (value) => (dayjs(value).isBefore(dayjs()) ? 'Expiry time must be in the future' : null),
        },
    });

    const handleSubmit = async (values) => {
        const payload = {
            title: values.title,
            message: values.message,
            severity: values.severity,
            expiryTime: values.expiryTime,
            remindersEnabled: values.remindersEnabled,
            visibility: {
                type: values.visibilityType,
                targets: values.visibilityType === 'User' ? values.targetUsers : (values.visibilityType === 'Team' ? values.targetTeams : []),
            },
        };

        try {
            await createAlert(payload);
            notifications.show({
                title: 'Success!',
                message: 'Alert created and distributed successfully.',
                color: 'green'
            });
            form.reset();
        } catch (error) {
             notifications.show({
                title: 'Error!',
                message: 'Failed to create alert.',
                color: 'red'
            });
        }
    };
    
    return (
        <Box maw={700} mx="auto">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput withAsterisk label="Title" classNames={{ input: 'field-border' }} {...form.getInputProps('title')} />
                <Textarea withAsterisk label="Message" mt="md" classNames={{ input: 'field-border' }} {...form.getInputProps('message')} />
                <Select
                    label="Severity"
                    data={['Info', 'Warning', 'Critical']}
                    mt="md"
                    classNames={{ input: 'field-border' }}
                    {...form.getInputProps('severity')}
                />
                <SegmentedControl
                    data={[ { label: 'Entire Organization', value: 'Organization'}, { label: 'Specific Teams', value: 'Team' }, { label: 'Specific Users', value: 'User' } ]}
                    mt="md"
                    fullWidth
                    classNames={{ root: 'field-border' }}
                    {...form.getInputProps('visibilityType')}
                />

                {form.values.visibilityType === 'Team' && (
                     <MultiSelect
                        data={targets.teams}
                        label="Select Teams"
                        placeholder="Choose one or more teams"
                        mt="md"
                        classNames={{ input: 'field-border' }}
                        {...form.getInputProps('targetTeams')}
                     />
                )}
                {form.values.visibilityType === 'User' && (
                    <MultiSelect
                        data={targets.users}
                        label="Select Users"
                        placeholder="Choose one or more users"
                        mt="md"
                        classNames={{ input: 'field-border' }}
                        {...form.getInputProps('targetUsers')}
                    />
                )}

                <DateTimePicker
                    label="Expiry Time"
                    placeholder="Pick date and time"
                    mt="md"
                    withAsterisk
                    classNames={{ input: 'field-border' }}
                    {...form.getInputProps('expiryTime')}
                />
                
                <Switch label="Enable 2-hour reminders" mt="md" {...form.getInputProps('remindersEnabled', { type: 'checkbox' })} />

                <Group justify="flex-end" mt="xl">
                    <Button type="submit">Create Alert</Button>
                </Group>
            </form>
        </Box>
    );
}