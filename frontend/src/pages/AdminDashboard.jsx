import { Tabs, Container } from '@mantine/core';
import { IconChartBar, IconPlaylistAdd, IconSettings } from '@tabler/icons-react';
import AnalyticsView from '../components/Admin/AnalyticsView';
import ManageAlertsView from '../components/Admin/ManageAlertsView';
import CreateAlertView from '../components/Admin/CreateAlertView';

export default function AdminDashboard() {
  return (
    <Container fluid>
      <Tabs defaultValue="analytics">
        <Tabs.List>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={14}/>}>
            Analytics
          </Tabs.Tab>
          <Tabs.Tab value="manage" leftSection={<IconSettings size={14}/>}>
            Manage Alerts
          </Tabs.Tab>
          <Tabs.Tab value="create" leftSection={<IconPlaylistAdd size={14}/>}>
            Create Alert
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="analytics" pt="md">
          <AnalyticsView />
        </Tabs.Panel>

        <Tabs.Panel value="manage" pt="md">
          <ManageAlertsView />
        </Tabs.Panel>
        
        <Tabs.Panel value="create" pt="md">
          <CreateAlertView />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}   