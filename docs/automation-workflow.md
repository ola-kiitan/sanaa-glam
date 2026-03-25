# Sanaa Glam — Automated Bug Fix Workflow

## Overview

This system connects Slack bug reports directly to automated code fixes using Claude AI. When a team member reacts to a Slack message with the :bug: emoji, the system automatically reads the conversation, triggers a GitHub Actions workflow, and Claude analyzes the codebase, implements a fix, and opens a pull request — all without manual intervention.

---

## Architecture

```
┌─────────────┐     :bug: reaction      ┌──────────────────────┐
│  Slack       │ ──────────────────────▶ │  Slack Event API     │
│  #bug-support│                         │  (webhook)           │
└─────────────┘                          └──────────┬───────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────────┐
                                         │  Vercel Serverless   │
                                         │  /api/slack/events   │
                                         │                      │
                                         │  1. Verify signature │
                                         │  2. Fetch thread     │
                                         │  3. Get reporter name│
                                         │  4. Dispatch workflow │
                                         └──────────┬───────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────────┐
                                         │  GitHub Actions      │
                                         │  bug-fix.yml         │
                                         │                      │
                                         │  Claude Code Action  │
                                         │  - Reads bug report  │
                                         │  - Searches codebase │
                                         │  - Implements fix    │
                                         │  - Runs tests        │
                                         │  - Opens PR          │
                                         └──────────┬───────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────────┐
                                         │  Pull Request        │
                                         │  with labels:        │
                                         │  bug, automated-fix, │
                                         │  slack-reported       │
                                         └──────────┬───────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────────┐
                                         │  Claude Code Review  │
                                         │  (auto-reviews PR)   │
                                         └──────────────────────┘
```

---

## Tools & Services

### 1. Slack App

**Purpose:** Listens for :bug: emoji reactions in the designated bug channel.

**Configuration required:**
- Event Subscriptions enabled with Request URL pointing to `https://<your-domain>/api/slack/events`
- Subscribed to `reaction_added` event
- Bot Token Scopes:
  - `channels:history` — read messages in the bug channel
  - `reactions:read` — detect emoji reactions
  - `users:read` — resolve user IDs to display names

### 2. Vercel (Next.js API Route)

**Purpose:** Webhook handler that bridges Slack events to GitHub Actions.

**File:** `src/app/api/slack/events/route.ts`

**Key behaviors:**
- Verifies Slack request signatures (HMAC-SHA256) to prevent spoofing
- Rejects requests older than 5 minutes (replay attack protection)
- Filters events to only :bug: reactions in the configured channel
- Fetches the full Slack thread for context
- Uses `waitUntil()` from `@vercel/functions` to keep the serverless function alive during async processing
- Returns 200 immediately so Slack doesn't retry

### 3. GitHub Actions — Bug Fix Workflow

**Purpose:** Runs Claude Code to autonomously fix the bug and open a PR.

**File:** `.github/workflows/bug-fix.yml`

**Trigger:** `workflow_dispatch` with inputs: `bug_summary`, `bug_context`, `slack_link`

**What Claude does:**
1. Reads the bug report and identifies reproduction steps
2. Searches the codebase for relevant files
3. Identifies the root cause
4. Implements a minimal, focused fix
5. Runs existing tests
6. Creates a fix branch, commits, pushes, and opens a PR with labels

### 4. GitHub Actions — Claude Code Review

**Purpose:** Automatically reviews every PR (including the automated bug fix PRs).

**File:** `.github/workflows/claude-code-review.yml`

**Trigger:** PR opened, synchronized, ready for review, or reopened

### 5. GitHub Actions — Claude Code (Interactive)

**Purpose:** Responds to `@claude` mentions in issues and PR comments.

**File:** `.github/workflows/claude.yml`

**Trigger:** Issue/PR comments or reviews containing `@claude`

---

## Environment Variables (Vercel)

| Variable | Description | Example |
|---|---|---|
| `SLACK_SIGNING_SECRET` | From Slack app → Basic Information → Signing Secret | `abc123...` |
| `SLACK_BOT_TOKEN` | From Slack app → OAuth & Permissions → Bot User OAuth Token | `xoxb-...` |
| `SLACK_BUG_CHANNEL_ID` | Channel ID for the bug channel (right-click channel → Copy link → extract ID) | `C0ANZ30041E` |
| `SLACK_BUG_CHANNEL_NAME` | Display name of the bug channel (used in PR title) | `bug-support` |
| `SLACK_WORKSPACE_URL` | Slack workspace URL (used to build thread links) | `https://your-team.slack.com` |
| `GITHUB_PAT` | GitHub Personal Access Token with `repo` and `actions` scopes | `ghp_...` |
| `GITHUB_REPO` | Repository in `owner/repo` format | `ola-kiitan/sanaa-glam` |

## GitHub Secrets (Repository)

| Secret | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key for the bug-fix workflow (Claude Sonnet) |
| `CLAUDE_CODE_OAUTH_TOKEN` | OAuth token for the code review and interactive Claude workflows |

---

## Requirements Checklist

### Slack App Setup
- [ ] Create a Slack app at https://api.slack.com/apps
- [ ] Enable Event Subscriptions
- [ ] Set Request URL to `https://<your-vercel-domain>/api/slack/events`
- [ ] Subscribe to `reaction_added` bot event
- [ ] Add bot scopes: `channels:history`, `reactions:read`, `users:read`
- [ ] Install the app to your workspace
- [ ] Invite the bot to the bug channel (`/invite @YourBotName`)

### Vercel Setup
- [ ] Deploy the Next.js app to Vercel
- [ ] Set all Slack-related env vars (see table above)
- [ ] Set `GITHUB_PAT` and `GITHUB_REPO` env vars
- [ ] Install `@vercel/functions` package (`npm install @vercel/functions`)

### GitHub Setup
- [ ] Add `ANTHROPIC_API_KEY` secret to the repository
- [ ] Add `CLAUDE_CODE_OAUTH_TOKEN` secret to the repository
- [ ] Create a GitHub PAT with `repo` + `actions` scopes
- [ ] Ensure all three workflow files exist in `.github/workflows/`
- [ ] Enable GitHub Actions on the repository

### Validation
- [ ] Verify the Slack webhook URL returns the `url_verification` challenge
- [ ] Verify the bot is a member of the bug channel
- [ ] Test by adding a :bug: reaction to a message in the channel
- [ ] Confirm a PR is created with the `bug`, `automated-fix`, and `slack-reported` labels

---

## Suggested Enhancement: Jira Ticket Integration

### Concept

When a Jira ticket URL is posted in the same Slack bug channel, the system can parse the ticket key, fetch details from the Jira API, and include that context in the bug fix workflow — linking the PR back to the Jira ticket.

### How It Would Work

```
┌─────────────────────┐
│  Slack message:     │
│  "PROJ-123 is       │
│  causing checkout   │     :bug: reaction
│  failures"          │ ─────────────────────▶  Existing flow +
│                     │                         Jira enrichment
│  https://company    │
│  .atlassian.net/    │
│  browse/PROJ-123    │
└─────────────────────┘
```

### Implementation Steps

**1. Detect Jira URLs/keys in the thread**

Add a utility to extract Jira references from Slack messages:

```typescript
function extractJiraReferences(messages: SlackMessage[]): {
  ticketKey: string | null;
  ticketUrl: string | null;
} {
  const jiraUrlPattern = /https?:\/\/[\w-]+\.atlassian\.net\/browse\/([\w]+-\d+)/;
  const jiraKeyPattern = /\b([A-Z][A-Z0-9]+-\d+)\b/;

  for (const msg of messages) {
    if (!msg.text) continue;

    const urlMatch = msg.text.match(jiraUrlPattern);
    if (urlMatch) {
      return { ticketKey: urlMatch[1], ticketUrl: urlMatch[0] };
    }

    const keyMatch = msg.text.match(jiraKeyPattern);
    if (keyMatch) {
      return {
        ticketKey: keyMatch[1],
        ticketUrl: `https://${process.env.JIRA_DOMAIN}/browse/${keyMatch[1]}`,
      };
    }
  }

  return { ticketKey: null, ticketUrl: null };
}
```

**2. Fetch Jira ticket details**

```typescript
async function fetchJiraTicket(ticketKey: string): Promise<{
  summary: string;
  description: string;
  priority: string;
  assignee: string;
} | null> {
  const domain = process.env.JIRA_DOMAIN;       // e.g. "company.atlassian.net"
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!domain || !email || !apiToken) return null;

  const res = await fetch(
    `https://${domain}/rest/api/3/issue/${ticketKey}?fields=summary,description,priority,assignee`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        Accept: 'application/json',
      },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return {
    summary: data.fields.summary,
    description: data.fields.description?.content?.[0]?.content?.[0]?.text ?? '',
    priority: data.fields.priority?.name ?? 'Unknown',
    assignee: data.fields.assignee?.displayName ?? 'Unassigned',
  };
}
```

**3. Enrich the bug context before dispatching**

In the async handler, after building the bug description:

```typescript
const jiraRef = extractJiraReferences(messages);
let enrichedContext = bugDescription;

if (jiraRef.ticketKey) {
  const ticket = await fetchJiraTicket(jiraRef.ticketKey);
  if (ticket) {
    enrichedContext += `\n\n---\n**Jira Ticket: ${jiraRef.ticketKey}**\n`;
    enrichedContext += `- Summary: ${ticket.summary}\n`;
    enrichedContext += `- Priority: ${ticket.priority}\n`;
    enrichedContext += `- Assignee: ${ticket.assignee}\n`;
    enrichedContext += `- Description: ${ticket.description}\n`;
    enrichedContext += `- URL: ${jiraRef.ticketUrl}\n`;
  }
}

await triggerGitHubWorkflow({
  bug_summary: `[${jiraRef.ticketKey ?? 'no-ticket'}] Bug reported by ${reporterName} in #${channelName}`,
  bug_context: enrichedContext,
  slack_link: threadUrl,
});
```

**4. Update the workflow to link the PR to Jira**

In `bug-fix.yml`, update Claude's prompt to instruct it to include the Jira ticket reference in the PR body and branch name (e.g., `fix/PROJ-123-checkout-failure`).

**5. Optional: Transition Jira ticket status**

After the PR is created, call the Jira API to transition the ticket to "In Progress" or add a comment with the PR link:

```typescript
async function commentOnJiraTicket(ticketKey: string, prUrl: string) {
  const domain = process.env.JIRA_DOMAIN;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  await fetch(`https://${domain}/rest/api/3/issue/${ticketKey}/comment`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      body: {
        type: 'doc',
        version: 1,
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: `Automated fix PR created: ${prUrl}`,
          }],
        }],
      },
    }),
  });
}
```

### Additional Environment Variables for Jira

| Variable | Description | Example |
|---|---|---|
| `JIRA_DOMAIN` | Atlassian domain | `company.atlassian.net` |
| `JIRA_EMAIL` | Service account email for API auth | `bot@company.com` |
| `JIRA_API_TOKEN` | API token from https://id.atlassian.com/manage/api-tokens | `ATATT3x...` |
