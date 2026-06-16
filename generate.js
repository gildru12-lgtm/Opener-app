export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bio, tone, outputLang } = req.body;

  if (!bio || !tone) {
    return res.status(400).json({ error: "Missing bio or tone" });
  }

  const langInstruction =
    outputLang === "auto"
      ? `Detect the language of the bio and write ALL openers in that exact same language.`
      : `Write ALL openers in the language with code "${outputLang}", regardless of the bio's language.`;

  const prompt = `You are an expert at crafting personalized dating app openers in any language.

Based on this person's profile bio, generate exactly 3 opening messages in a "${tone}" tone.

Profile bio:
"""
${bio}
"""

Language instruction: ${langInstruction}

Rules:
- Each opener must feel personal and specific to THEIR bio (mention something concrete from it)
- Keep each opener to 1-2 sentences max
- Tone: ${tone === "witty" ? "clever, playful, light humor — not cringe" : tone === "sweet" ? "warm, genuine, slightly vulnerable — not cheesy" : "confident, direct, a little daring — not aggressive"}
- No generic compliments
- Make them feel like a real person wrote it, not a bot
- Respect cultural nuances of the language

Also detect the language of the bio.

Respond ONLY with a JSON object. No preamble, no markdown, no explanation:
{"detectedLanguage": "English", "openers": ["opener 1", "opener 2", "opener 3"]}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.map((b) => b.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.status(200).json(parsed);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Generation failed" });
  }
}
