import { getMessages } from "./actions";
import MessageManagementClient from "./MessageManagementClient";

export default async function MessagesPage() {
  const messages = await getMessages();

  return <MessageManagementClient initialMessages={messages} />;
}