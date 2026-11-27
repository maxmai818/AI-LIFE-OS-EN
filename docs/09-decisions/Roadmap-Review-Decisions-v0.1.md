# AI Life OS Roadmap Review Decision Record v0.1

- **Status**: Approved
- **Decision maker / final acceptance authority**: Max
- **Date**: 2026-09-01
- **Applicable document**: `AI-Life-OS-SDLC-Roadmap-v0.1.md`
- **Effect**: this record is the formal review conclusion for Roadmap v0.1; where it conflicts with the original Roadmap, this record prevails. To be merged into Roadmap v0.2 later.

## 1. Confirmed decisions

| ID | Topic | Decision |
|---|---|---|
| DEC-001 | First users | Built for Max only; not premised on a multi-user general-purpose product for now. |
| DEC-002 | First client | Mobile-first responsive Web; the current Roadmap no longer treats the WeChat Mini Program as the default MVP target. |
| DEC-003 | Project cadence | Single-user rapid iteration. Max can provide simulated test data, so the original Roadmap's week counts or mandatory 7–14 days of real usage are not hard gates for entering the next step. |
| DEC-004 | Concurrent goals | At most 3 core goals pursued simultaneously. |
| DEC-005 | Life total score | No single aggregate Life Score is built. State, goal progress, trends, deviations, and data confidence are displayed per domain. |
| DEC-006 | First loop | The first version prioritizes Capture → AI structuring/correction → Review; the full Life OS is not built first. |
| DEC-007 | Model strategy | Primarily cloud LLM APIs, with no plan for locally deployed models. Model vendor, data retention, and privacy terms must be clarified during the design phase. |
| DEC-008 | First-round focus | The first round organizes goals and test data around three focus directions: health, primary job, and side project. |
| DEC-009 | Acceptance responsibility | Max simultaneously serves as product owner, requirements approver, privacy risk acceptor, and final UAT/release acceptance authority. Hermes is responsible for proposing standards, evidence, and risks, and does not make final product decisions in Max's place. |

## 2. Correction regarding RAG

The original Roadmap understood retrieval-augmented generation (RAG) as a "personal knowledge base / personal semantic memory" — this is a misunderstanding, now formally corrected:

> RAG in AI Life OS is mainly used to retrieve lawfully obtained e-books, papers, or other trusted materials, so that when analyzing problems and proposing suggestions the system can cite explicit scholars, theories, and sources as support.

Therefore:

- The core object of retrieval-augmented generation (RAG) is **external theory and authoritative materials**, not turning the user's diary into a personal vector knowledge base.
- User records still need to be saved, queried, and traceable, but structured data, time ranges, and goal-linked queries are preferred; whether vector retrieval over personal records is needed will be validated separately in the future and is not a settled architecture.
- Theoretical citations must not override personal facts: first state "what your records show", then state "which theories may help explain or design actions".
- The system must display author/theory, material name, citation location or verifiable source, and distinguish the original viewpoint, AI interpretation, and advice aimed at Max.
- Famous authorities' views must not be packaged as deterministic conclusions; evidence strength, applicability boundaries, controversies, and uncertainties should be stated.
- Materials must have lawful access and use rights; full e-book texts are not distributed externally.

### Place in the first version

The first loop is still Capture and Review. To keep RAG from slowing down core validation:

1. POC-01 first validates whether capture, structuring, correction, and Review are valuable.
2. The Review product and data structures reserve `theory_reference` / `source_reference` from the start.
3. The first round uses only a small set of manually curated, verifiable theoretical materials as citation samples; no massive e-book ingestion, OCR, or complex vector retrieval pipeline is built first.
4. After the core loop passes, separately validate "whether theory retrieval is more reliable and helpful than ordinary cloud LLM answers".

## 3. Domain model clarification

Describing "health, primary job, side project" as the first-round focus is accurate, but they need not be forcibly equated with the five fixed life dimensions.

A three-layer model is recommended:

```text
Life Area (long-term domain)
→ Goal / Project (phase goal or project)
→ Metric / Action / Capture (metrics, actions, and records)
```

The first round can directly set up three Focus Areas:

1. **Health**: sleep, exercise, diet, energy, or specific health goals.
2. **Primary job**: responsibilities, key results, capability growth, workload, and satisfaction.
3. **Side project**: tracked as an independent project for investment, milestones, revenue validation, and opportunity cost.

If the side project's focus is revenue, it can also be associated with "Wealth"; if the focus is career transition, it can be associated with "Career/Work". The system allows associations and does not require Max to first decide that it can only belong to one dimension.

## 4. Rapid Roadmap (replacing the original week estimates)

The original Roadmap's timelines were team-development estimates only. Under single-user, self-testing, and simulated-data conditions, deliverable gates are used instead of fixed week counts to control progress:

| Phase | Suggested cadence | Completion criteria |
|---|---:|---|
| Scope Baseline | 1–2 concentrated review rounds | Capture inputs, Review outputs, the three focus areas, and Won't Do are clarified |
| UX / Data / AI Contract | 2–4 concentrated review rounds | Mobile flows, structured schemas, and fact/speculation/citation rules approved by Max |
| POC-01 | About 1–2 weeks of development effort, allowed to compress further | Simulated dataset passes; Max can complete Capture-to-Review on mobile Web |
| Self-use MVP | Continuous iteration after the POC passes | Max finds the capture cost acceptable in real scenarios, and Review useful and traceable |
| V1 Baseline | Decided by Max | Must Have passes; key privacy and data risks are explicitly accepted or resolved |

These times are not waiting periods. Once the previous phase's deliverables meet the standard and are approved by Max, the next phase may begin.

## 5. Interpretation and revision of "success criteria"

Item 9 of the original review questions refers to the POC acceptance metrics in Roadmap §6.8; it does not require Max to find some unknown document. Values like `85%`, `4/5`, and `60 seconds` in the original table were only candidate thresholds and are not yet approved.

The first round is recommended to use acceptance criteria better suited to a single user:

### A. Deterministic criteria that must pass

- The saved raw Capture is not overwritten by AI results.
- Max's manual revisions are saved and re-displayed with 100% consistency.
- Numbers, units, times, negation semantics, and goal associations are verifiable item by item.
- Every Review fact can be traced back to a specific Capture or structured record.
- The AI explicitly distinguishes facts, speculation, theoretical citations, and suggestions.
- When data is insufficient, it explicitly states that no judgment can be made, without generating pseudo-precise conclusions.
- Max can export and delete all personal data.

### B. Evaluated by the test set without arbitrary pre-set thresholds

- Structured field accuracy.
- The proportion requiring Max's edits and the cost of those edits.
- Rate of unsupported conclusions.
- Correctness, relevance, and verifiability of theoretical citations.
- Time required for Capture and confirmation.

The first round establishes a baseline; if errors concentrate in ranges fixable through schemas, prompts, or interaction, continue iterating rather than condemning on the basis of a single average score.

### C. Max's final product judgment

Whether the POC passes is ultimately judged by Max:

1. Am I willing to keep using it?
2. Is Review more trustworthy and helpful than simply sending my records to a general chat model?
3. Does the system make my next step clearer, rather than adding burden or inducing self-blame?
4. Are errors easy to spot and correct?
5. Do theoretical citations genuinely improve understanding and action quality, rather than serving as decoration?

## 6. This round's Gate conclusion

- **G0: Passed.** The target user is clarified as Max himself; the first problem space and delivery form are confirmed.
- **Next phase: G1/G2 requirements and design baselines.** Still only requirements, interaction, data, AI, and privacy design — no coding yet.
- The next batch of documents need not be ten at once; prioritize consolidating into three:
  1. `POC-01 Product & UX Spec`
  2. `Capture Data + AI Output Contract`
  3. `POC-01 Test & Acceptance Spec`

After the three are reviewed by Max, decide whether to enter implementation.
