import { getActivityLogs } from "./actions";
import ActivityLogsClient from "./ActivityLogsClient";

export default async function ActivityLogsPage() {
  const logs = await getActivityLogs();

  return <ActivityLogsClient initialLogs={logs} />;
}