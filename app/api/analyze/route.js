import Anthropic from "@anthropic-ai/sdk";

const ANALYSIS_PROMPT = `You are an expert brand strategist and voice analyst. Analyze the following website content and provide a comprehensive brand voice audit.

SCORING RUBRIC — use these definitions to score each dimension from 0-100:

CONSISTENCY (How uniform is the tone across all content?)
- 90-100: Every sentence feels like it was written by the same person with a clear voice. Zero tonal shifts.
- 70-89: Generally consistent with minor shifts between sections. A reader would still feel a cohesive voice.
- 50-69: Noticeable shifts in tone — some sections feel corporate, others casual. Inconsistent personality.
- Below 50: Feels like multiple writers with no style guide. Jarring shifts between sections.

CLARITY (Is the messaging easy to understand?)
- 90-100: Crystal clear. A 10th grader could understand the value prop in one read. No unnecessary jargon.
- 70-89: Clear overall, with a few sentences that require re-reading or assume insider knowledge.
- 50-69: Meaning is there but buried. Uses jargon, passive voice, or vague language regularly.
- Below 50: Confusing. The reader has to work hard to understand what this company does or offers.

DIFFERENTIATION (Does the voice stand apart from competitors?)
- 90-100: Unmistakable voice. You'd recognize this brand with the logo removed. Bold, ownable point of view.
- 70-89: Has personality that separates it from generic competitors. Some distinctive phrases or framing.
- 50-69: Could be swapped with 3-5 similar companies without anyone noticing. Safe and expected.
- Below 50: Completely generic. Reads like a template. No personality or distinctive framing.

AUDIENCE FIT (Does the voice match the target audience?)
- 90-100: Speaks directly to the target audience's language, pain points, and aspirations. Feels like an insider.
- 70-89: Good alignment with audience needs. Mostly hits the right register and references.
- 50-69: Somewhat aligned but occasionally misses — too formal, too casual, or wrong assumptions.
- Below 50: Misaligned. Talks over, under, or past the audience.

EMOTIONAL RESONANCE (Does the messaging create a feeling?)
- 90-100: Makes you feel something specific. Urgency, inspiration, trust, excitement. Moves people to act.
- 70-89: Creates some emotional connection. Has moments that land but doesn't sustain it throughout.
- 50-69: Mostly informational. Tells you what they do but doesn't make you feel anything about it.
- Below 50: Flat. No emotional hook. Reads like a product spec, not a brand.

Return your analysis as a JSON object with this exact structure (no markdown, no backticks, just pure JSON):
{
  "brand_name": "Best guess at the brand/company name",
  "scores": {
    "consistency": { "score": 82, "reasoning": "One sentence explaining why this score" },
    "clarity": { "score": 75, "reasoning": "One sentence explaining why this score" },
    "differentiation": { "score": 68, "reasoning": "One sentence explaining why this score" },
    "audience_fit": { "score": 80, "reasoning": "One sentence explaining why this score" },
    "emotional_resonance": { "score": 72, "reasoning": "One sentence explaining why this score" }
  },
  "voice_score": 76,
  "voice_score_reasoning": "One sentence explaining the overall voice score as a weighted average of the 5 dimensions",
  "voice_summary": "2-3 sentence summary of the overall brand voice",
  "personality": "One word that captures the brand personality",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "recommendations": ["actionable rec 1", "actionable rec 2", "actionable rec 3"],
  "comparable_company": {
    "name": "Name of a real, well-known competitor or comparable company in the same space",
    "url": "their actual website URL without https://",
    "comparison_note": "One sentence on how their voice compares"
  }
}`;

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    // Attempt 1: With web search
    try {
      const res = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: ANALYSIS_PROMPT + `\n\nURL: ${url}\n\nSearch for this website to understand its content, brand, and messaging. Then return ONLY the JSON analysis object. No markdown, no backticks, no explanation — just the raw JSON.`
        }]
      });

      const parsed = extractJSON(res);
      if (parsed) {
        return Response.json(normalize(parsed, url));
      }
    } catch (e) {
      console.error("Web search attempt failed:", e.message);
    }

    // Attempt 2: Without tools (fallback)
    const res = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: ANALYSIS_PROMPT + `\n\nURL: ${url}\n\nAnalyze this website's brand voice based on what you know about it. Return ONLY the JSON analysis object. No markdown, no backticks, no explanation — just the raw JSON.`
      }]
    });

    const parsed = extractJSON(res);
    if (parsed) {
      return Response.json(normalize(parsed, url));
    }

    return Response.json({ error: "Could not generate analysis" }, { status: 500 });

  } catch (err) {
    console.error("API route error:", err);
    return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

function extractJSON(response) {
  const textBlocks = (response.content || [])
    .filter(item => item.type === "text" && item.text)
    .map(item => item.text);
  const fullText = textBlocks.join("\n");
  if (!fullText.trim()) return null;
  const cleaned = fullText.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function normalize(parsed, url) {
  const displayUrl = url.replace(/^https?:\/\//, "");
  if (!parsed.brand_name) parsed.brand_name = displayUrl;
  if (!parsed.voice_score && parsed.scores) {
    const dims = ["consistency", "clarity", "differentiation", "audience_fit", "emotional_resonance"];
    const vals = dims.map(d => parsed.scores[d]?.score).filter(s => typeof s === "number");
    parsed.voice_score = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 50;
  }
  if (!parsed.scores) parsed.scores = {};
  if (!parsed.voice_score) parsed.voice_score = 50;
  if (!parsed.voice_score_reasoning) parsed.voice_score_reasoning = "";
  if (!parsed.voice_summary) parsed.voice_summary = "Analysis completed.";
  if (!parsed.personality) parsed.personality = "—";
  if (!parsed.strengths) parsed.strengths = [];
  if (!parsed.gaps) parsed.gaps = [];
  if (!parsed.recommendations) parsed.recommendations = [];
  return parsed;
}
