// client id generation
export function generateClientID() {
  const clientid = Math.random().toString(26).substring(2, 9);
  return clientid;
}
