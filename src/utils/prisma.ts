import dbClient from "@/db";

export function prisma() {
  const client = dbClient.getInstance();
  if (!client) {
    throw new Error("Database client is not connected.");
  }
  return client;
}
