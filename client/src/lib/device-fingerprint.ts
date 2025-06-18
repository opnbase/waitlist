export interface IFingerPrint {
  user_agent: string;
  screen: string;
  timezone: string;
  language: string;
  platform?: string;
  ip_address?: string;
  fingerprint_hash?: string;
}

export const getFingerPrint = async () : Promise<IFingerPrint> => {
  const fingerprint: IFingerPrint = {
    user_agent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator?.platform || "unknown",
  };

  const ipRes = await fetch("https://api64.ipify.org?format=json");
  const ipData = await ipRes.json();
  fingerprint.ip_address = ipData.ip;

  const raw = Object.values(fingerprint).join("|");
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  fingerprint.fingerprint_hash = hashHex;
  return fingerprint;
};
