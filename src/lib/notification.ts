// lib/notification.ts
export async function sendMessage({ type, name }: { type: string, name: string }) {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      body: JSON.stringify({
        text: `${type} 🎉 Ny användare registrerad: ${name}`,
      }),
    })  
  }