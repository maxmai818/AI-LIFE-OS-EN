# DQ-006: Product analytics instrumentation uses a self-built minimal solution (product analytics / instrumentation technical route)

- Date: 2026-11-17 (PR #24 merged 01:05 CST)
- Status: ✅ Approved (Max approved "Adopted" via Feishu, early morning 2026-11-17)
- Owner: lifeospm
- Related: `Commercialization-Validation-Design-v0.2.md` §4.3 (OQ-03 hard constraint), G2-Decision-003 Amendment ② (privacy as a top-tier selling point), v0.2 §4.1 (event list)
- Closed item: OQ-03 (instrumentation: third-party vs self-built) → resolved; this record is the conclusion

## Decision (DQ-006)

**Instrumentation uses a self-built minimal solution**, with no third-party analytics SDK integration (PostHog / Mixpanel / Amplitude cloud editions, etc.).

### Implementation points

- One anonymous event table (event name, timestamp, anonymous ID, necessary metadata) that **never contains content text** (inherited red line)
- **Statistics are local by default**; uploading aggregate statistics requires **opt-in and can be withdrawn at any time** (inherited v0.2 management policy: opt-in rate and withdrawal rate are tracked as separate line items)
- Event list = v0.2 §4.1 (approximately 10 items: open, capture, Review completion, payment flow, etc.)
- Reporting = aggregate SQL + a lightweight page (retention / active usage / conversion — three categories are sufficient); estimated development effort of about 1–3 days (estimate, not a commitment)

### Reasons for excluding third-party cloud editions (pricing data retrieved 2026-11)

- Cloud analytics SDKs report by default, which conflicts with the promise of "statistics local by default + opt-in + withdrawable"; cross-border data transfer adds further compliance burdens
- Privacy is a top-tier product selling point (G2-Decision-003 Amendment ②), so the instrumentation policy must do exactly what it says
- "Third parties are too expensive" is not a valid claim — but it is not the reason for our choice either: our volume is far below each vendor's free tier (PostHog 1M events/month free [1], Amplitude 2M events/month free [2], Mixpanel 1M events/month free [3]); they are excluded because of the privacy promise, not cost

### Cost

- Self-built: ¥0 license fees (one-off development time only)

### Escape hatch (left for a separate future decision)

- If user volume grows large and maintaining funnel/retention charts becomes burdensome, we may evaluate **self-hosted PostHog** (open-source edition deployed on our own servers, data never leaves our domain); a decision packet will be produced for separate approval at that time

## Approval boundary

This decision = selection of the instrumentation technical route; **it does not constitute approval to launch instrumentation** (instrumentation implementation and G3 kickoff still require Max's explicit approval; v0.2 residual conditions are inherited unchanged).
## Sources

[1] https://posthog.com/pricing — PostHog Pricing (Free: 1M events/month)
[2] https://amplitude.com/pricing — Amplitude Pricing (Free: 2M events/month)
[3] https://docs.mixpanel.com/docs/pricing — Mixpanel Pricing (Free: 1M events/month)
