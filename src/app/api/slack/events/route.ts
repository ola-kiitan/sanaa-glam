import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SlackReactionEvent {
  type: "reaction_added";
  user: string;
  reaction: string;
  item: {
    type: string;
    channel: string;
    ts: string;
  };
  item_user: string;
  event_ts: string;
}

interface SlackMessage {
  user?: string;
  text?: string;
  ts: string;
  thread_ts?: string;
  username?: string;
}

interface SlackThreadResponse {
  ok: boolean;
  messages: SlackMessage[];
  error?: string;
}

interface SlackUserResponse {
  ok: boolean;
  user?: { name: string; real_name: string; profile?: { display_name: string } };
  error?: string;
}

// ─── Slack signature verification ────────────────────────────────────────────

async function verifySlackSignature(request: NextRequest, rawBody: string): Promise<boolean> {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) return false;

  const timestamp = request.headers.get("x-slack-request-timestamp");
  const slackSignature = request.headers.get("x-slack-signature");

  if (!timestamp || !slackSignature) return false;

  // Reject requests older than 5 minutes to prevent replay attacks
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) return false;

  const sigBasestring = `v0:${timestamp}:${rawBody}`;
  const hmac = crypto.createHmac("sha256", signingSecret);
  hmac.update(sigBasestring);
  const computedSig = `v0=${hmac.digest("hex")}`;

  return crypto.timingSafeEqual(Buffer.from(computedSig), Buffer.from(slackSignature));
}

// ─── Slack API helpers ────────────────────────────────────────────────────────

async function fetchThread(channel: string, threadTs: string): Promise<SlackMessage[]> {
  const token = process.env.SLACK_BOT_TOKEN;
  const url = `https://slack.com/api/conversations.replies?channel=${channel}&ts=${threadTs}&limit=50`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = (await res.json()) as SlackThreadResponse;
  if (!data.ok) {
    console.error("Failed to fetch Slack thread:", data.error);
    return [];
  }

  return data.messages;
}

async function fetchUserName(userId: string): Promise<string> {
  const token = process.env.SLACK_BOT_TOKEN;
  const res = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = (await res.json()) as SlackUserResponse;
  if (!data.ok || !data.user) return userId;

  return data.user.profile?.display_name || data.user.real_name || data.user.name || userId;
}

function buildBugDescription(messages: SlackMessage[], threadUrl: string): string {
  const lines = messages
    .filter((m) => m.text)
    .map((m, i) => {
      const prefix = i === 0 ? "**Original report:**" : `**Reply ${i}:**`;
      return `${prefix}\n${m.text}`;
    });

  return lines.join("\n\n");
}

// ─── GitHub Actions trigger ───────────────────────────────────────────────────

async function triggerGitHubWorkflow(inputs: {
  bug_summary: string;
  bug_context: string;
  slack_link: string;
}): Promise<boolean> {
  const token = process.env.GITHUB_PAT;
  const repo = process.env.GITHUB_REPO; // e.g. "your-org/sanaa-glam"

  if (!token || !repo) {
    console.error("Missing GITHUB_PAT or GITHUB_REPO env vars");
    return false;
  }

  const [owner, repoName] = repo.split("/");
  const url = `https://api.github.com/repos/${owner}/${repoName}/actions/workflows/bug-fix.yml/dispatches`;

  const dispatchRes = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: "main",
      inputs,
    }),
  });

  const dispatchStatus = dispatchRes.status;
  const dispatchBody = await dispatchRes.text();
  console.log(`GitHub dispatch: ${dispatchStatus} ${dispatchBody}`);

  if (!dispatchRes.ok) {
    console.error("GitHub workflow dispatch failed:", dispatchStatus, dispatchBody);
    return false;
  }

  return true;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const body = JSON.parse(rawBody);

  console.log("EVENT:", JSON.stringify(body, null, 2));

  // Handle URL verification challenge BEFORE signature check.
  // Slack sends this once when you first save the Request URL in the app config.
  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  // Verify Slack signature for all other requests
  const isValid = await verifySlackSignature(request, rawBody);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Only handle event callbacks
  if (body.type !== "event_callback") {
    return NextResponse.json({ ok: true });
  }

  const event = body.event as SlackReactionEvent;

  // Only act on 🐛 reactions on messages in #bug-support
  const bugChannel = process.env.SLACK_BUG_CHANNEL_ID;
  if (
    event.type !== "reaction_added" ||
    event.reaction !== "bug" ||
    event.item.type !== "message" ||
    (bugChannel && event.item.channel !== bugChannel)
  ) {
    return NextResponse.json({ ok: true });
  }

  // Process asynchronously — return 200 immediately so Slack doesn't retry
  void (async () => {
    try {
      const { channel, ts } = event.item;
      const threadTs = ts; // top-level message ts == thread_ts

      // Fetch the full thread
      const messages = await fetchThread(channel, threadTs);
      if (messages.length === 0) return;

      // Build context
      const reporterName = await fetchUserName(event.item_user || event.user);
      const workspaceUrl = process.env.SLACK_WORKSPACE_URL ?? "https://slack.com";
      const threadUrl = `${workspaceUrl}/archives/${channel}/p${threadTs.replace(".", "")}`;
      const bugDescription = buildBugDescription(messages, threadUrl);
      const channelName = process.env.SLACK_BUG_CHANNEL_NAME ?? "bug-support";

      // Trigger the GitHub Actions workflow
      const triggered = await triggerGitHubWorkflow({
        bug_summary: `Bug reported by ${reporterName} in #${channelName}`,
        bug_context: bugDescription,
        slack_link: threadUrl,
      });

      if (triggered) {
        console.log("Slack notified, workflow dispatched");
      }
    } catch (err) {
      console.error("Error processing Slack bug reaction:", err);
    }
  })();

  return NextResponse.json({ ok: true });
}
