// lib/notifications.ts
import prisma from "./prisma";
export const NotificationTypes = {
  ORDER_UPDATE: 'ORDER_UPDATE',
  PRICE_DROP: 'PRICE_DROP',
  RESTOCK: 'RESTOCK',
  NEW_MESSAGE: 'NEW_MESSAGE',
  SYSTEM: 'SYSTEM',
} as const;

export async function sendNotification(userId: string, type: keyof typeof NotificationTypes, data: any) {
  // Store in database
  await prisma.notification.create({
    data: {
      userId,
      type,
      title: data.title,
      message: data.message,
      data: JSON.stringify(data),
      read: false,
    }
  });

  // Send real-time notification via WebSocket/Pusher (optional)
  // pusher.trigger(`user-${userId}`, 'notification', { type, data });
}