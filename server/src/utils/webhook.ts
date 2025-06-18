export async function sendDiscordWebhook(
  webhookUrl: string,
  title: string,
  description: string,
  colorHex: string = "#5865F2"
) {

  const colorInt = parseInt(colorHex.replace("#", ""), 16);

  const payload = {
    embeds: [
      {
        title,
        description,
        color: colorInt,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Failed to send webhook:", await response.text());
  }
}
