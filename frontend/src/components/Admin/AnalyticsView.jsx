import { useEffect, useState } from 'react';
import { getAnalyticsSummary } from '../../api';
import { SimpleGrid, Card, Text, Group, RingProgress, Loader, Alert } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await getAnalyticsSummary();
                setData(res.data);
            } catch (err) {
                setError('Failed to load analytics.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <Loader />;
    if (error) return <Alert color="red">{error}</Alert>;
    if (!data) return null;

    const readPercentage = data.deliveryVsRead.delivered > 0 ? (data.deliveryVsRead.read / data.deliveryVsRead.delivered) * 100 : 0;
    
    const severityData = Object.entries(data.severityBreakdown).map(([name, value]) => ({ name, value }));

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4}}>
            <Card withBorder p="md" radius="md">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Alerts</Text>
                <Text fz={36} fw={700}>{data.totalAlerts}</Text>
            </Card>
             <Card withBorder p="md" radius="md">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Currently Snoozed</Text>
                <Text fz={36} fw={700}>{data.totalSnoozedNow}</Text>
            </Card>
            <Card withBorder p="md" radius="md">
                <Group justify="space-between">
                    <div>
                        <Text c="dimmed" tt="uppercase" fw={700} fz="xs">Read Rate</Text>
                        <Text fw={700} fz="xl">{data.deliveryVsRead.read} / {data.deliveryVsRead.delivered}</Text>
                    </div>
                    <RingProgress
                        size={80}
                        roundCaps
                        thickness={8}
                        sections={[{ value: readPercentage, color: 'teal' }]}
                        label={<Text c="teal" fw={700} ta="center" size="sm">{readPercentage.toFixed(0)}%</Text>}
                    />
                </Group>
            </Card>
            
            <Card withBorder p="md" radius="md" style={{ gridColumn: '1 / -1' }}>
                <Text fw={500} mb="md">Severity Breakdown</Text>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                             {severityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

             <Card withBorder p="md" radius="md" style={{ gridColumn: '1 / -1' }}>
                <Text fw={500} mb="md">Top 5 Most Snoozed Alerts</Text>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topSnoozedAlerts} layout="vertical">
                         <XAxis type="number" />
                         <YAxis type="category" dataKey="title" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="snoozeCount" fill="#8884d8" name="Snooze Count" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </SimpleGrid>
    );
}