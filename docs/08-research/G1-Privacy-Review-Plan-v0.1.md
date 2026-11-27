# AI Life OS G1 Privacy Specialist Review Plan v0.1

- **Status**: In Review
- **Stage**: G1 Requirements / Specialist Review
- **Review nature**: non-legal privacy and data-governance product boundary review
- **Scope**: POC-01 Adaptive Review product principles, requirements, Data/AI semantics, and proposed acceptance criteria
- **Authorization source**: Max has authorized an independent privacy specialist review
- **Does not constitute**: legal opinion, regulatory compliance certification, DPIA, vendor due diligence, penetration testing, proof of actual deletion, implementation/testing, real data processing, merge, release, or Gate clearance authorization

## 1. Purpose and boundaries

This review confirms whether the current G1 documents express the principles of user data control, minimization, purpose limitation, same-user isolation, and deletion-first completely and without contradiction, and checks whether these principles form an auditable triplet across [Product](../02-requirements/POC-01-Product-UX-Spec-v0.6.md), [Data/AI](../04-data-ai/Capture-Data-AI-Output-Contract-v0.6.md), [Test](../06-testing/POC-01-Test-Acceptance-Spec-v0.6.md), [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md), and [Delta](G1-v0.6-Adaptive-Review-Delta-v0.1.md).

### 1.1 Confirmed G1 product principles

| Decision | Confirmed principle | Review checkpoints |
|---|---|---|
| P6-02 | Only long-term patterns whose content and applicable context the user has explicitly confirmed may be used across Reviews; one feedback item by default affects only the current Review; users can view, correct, revoke, and delete. | Unconfirmed inferences, silence, one feedback item, or one accepted suggestion must not be long-termized, extended to new purposes, or bypass revocation. |
| P6-03 | Users can correct the AI; AI conclusions are traceable to user records; say "don't know" when evidence is insufficient; users can stop or refuse suggestions; data must not be used across users. | Ownership, least context, stop/deletion propagation, and cross-user isolation must have falsifiable G1 acceptance semantics. |
| Confirmed boundary | "Continuous learning" means only licensed contextual memory, retrieval, and rule use; no authorization for training, fine-tuning, online RL, or covert psychological profiling. | Reviews, feedback, patterns, or model requests must not be silently extended to training, behavioral profiling, or new sensitive uses. |

### 1.2 G1 versus G2/G3 layering

G1 reviews only user-visible purposes, control rights, purpose limitations, and minimum acceptance principles. The following can only be marked as G2/G3 preconditions and must not be misclaimed as completed by this review: fields/state/API/database; authentication and authorization mechanisms; retrieval, storage, caching, backup, deletion, and cross-device implementation; encryption and security testing; vendor contracts, data regions, retention and deletion capabilities; legal applicability, risk acceptance, DPIA; real data or real user validation.

## 2. Review checklist and hard criteria

| Item | Pass criteria | Blocking-level issue examples |
|---|---|---|
| User control and transparency | Users can view, correct, revoke, delete their feedback and confirmed patterns; revocation/stop immediately affects future use; unsaved state must not be described as cross-device persistence. | Exit, revocation, or deletion still requires justification, or subsequent retrieval cannot be stopped. |
| Explicit confirmation and purpose limitation | Across Reviews use only explicitly confirmed content with contextual scope; one feedback item defaults to the current Review; no expansion to training or new sensitive uses. | Silence, one accepted suggestion, or an AI inference becomes a long-term profile, or all history is read by default. |
| Least necessary context | Use only necessary valid content when the user actively Reviews, same user, purpose, and scope; admit "don't know" when there is no match. | Automatically fetching more history, irrelevant sensitive records, or other users' data due to insufficient evidence. |
| User isolation | All objects, references, retrieval, exports, and deletion are limited to the same user; no cross-user learning, aggregation, or display. | User A's context can enter User B's Review, export, or inference. |
| Deletion, revocation, and derived data | Deletion/revocation stops use first and covers references, summaries, guidance, feedback revisions, patterns, and restorable copies; nothing may be kept permanently for the sake of traceability. | Only IDs are detached; referenced text, snapshots, caches, or new outputs can still reconstruct deleted content. |
| Export and traceability boundaries | Exports contain only the current user's content still lawfully retained; explanation snapshots contain no hidden chains of thought and do not resurrect deleted text. | Exporting other users' content, deleted text, or unnecessary internal reasoning. |
| Model and vendor purpose boundaries | No sending real data to vendors, training/fine-tuning/online RL, or expanding sensitive uses without approval; no claim of deletability when vendor capabilities are unknown. | Presuming consent for training, vendor retention, or new sensitive inference from "AI consent" or product usage consent. |
| Honesty and uncertainty | Logical proposals or static checks must not be presented as physical deletion, vendor purge, cross-device sync, or compliance already achieved. | Writing G2/G3 technical commitments as proven user guarantees. |

**Decision rule**: cross-user use, long-termizing unconfirmed content or expanding sensitive uses, deletion/revocation items still being retrieved or regenerated, or handing real data to unapproved vendors/training uses are all blocking. Any confirmed G1 principle lacking a falsifiable Product → Data/AI → Test triplet is at least `REVISE`.

## 3. Review method

### 3.1 Document triplet walkthrough

Check item by item whether Product states user-visible rights and limitations, whether Data/AI expresses least-necessary and purpose-limitation semantics, and whether Test contains observable failure oracles. Mark P6-02/P6-03 as "propagated / missing / contradictory / G2/G3 pending". Technical or legal questions that cannot be proven by documents must be marked `INSUFFICIENT_EVIDENCE` or `DEFER TO G2/G3`, never pass.

### 3.2 Synthetic scenario walkthrough

Without using real data, cover at least:

1. User A's current Review mixed with User B's ID/records;
2. One "good", silence, or accepted suggestion, without explicit long-term confirmation;
3. User confirms a pattern scoped only to context X, then goals change, the user revokes, or it expires;
4. User deletes a Capture, feedback, pattern, Review/account, with references, summaries, caches, and backup recovery present;
5. User revokes AI use, but model requests already exist or vendor retention capability is unknown;
6. User exports data containing valid versions, deleted text, unusable evidence, and other users' objects;
7. No records or insufficient context, and the system attempts to query full history or generate conclusions;
8. After a storage failure the user stops guidance; does the system falsely claim it was saved or continue cross-Review use?

For each scenario record allowed outcomes, prohibited outcomes, document basis, and G2/G3 dependencies.

### 3.3 Red-team questions

- Will AI inferences, one feedback item, silence, or one accepted suggestion be frozen into a personality/long-term pattern?
- After revocation or deletion, will snapshots, references, summaries, caches, indexes, backups, or newly generated text continue to leak?
- Will "traceability" become an excuse for permanent retention of deleted personal text?
- Is there any retrieval, export, evaluation, or model-learning path from A to B?
- Are vendors, training, fine-tuning, online RL, logs, or new sensitive uses allowed by default?
- Will the system pass off proposed 30/90-day, cache, or backup parameters as Max's approval or as already implemented?

### 3.4 Materials that cannot serve as passing evidence

Author self-assessments, Markdown/link checks, JSON parsing, absence of complaints, one favorable review, product usage rates, vendor marketing, unrun tests, or the absence of real data cannot alone prove actual isolation, deletion, vendor purge, cross-device consistency, legal compliance, or real user privacy protection.

## 4. Deliverables and conclusion vocabulary

The reviewer delivers: a review record; an eight-item checklist results table; a P6 propagation matrix; synthetic scenario results; blocking items with minimal revision/closure evidence; a G1 privacy recommendation memo for Max.

Permitted conclusions: `PASS`, `PASS_WITH_CONDITIONS`, `REVISE`, `BLOCK`, `INSUFFICIENT_EVIDENCE`, `DEFER TO G2/G3`. `PASS_WITH_CONDITIONS` applies only to clearly non-blocking G2/G3 preconditions; G1 document boundaries that are not yet falsifiable must not be classified as conditional pass.

## 5. Responsibilities and G1 Gate usage

- **Privacy reviewer**: non-author, independent, read-only; reviews product and data-governance document boundaries, making no legal or engineering guarantees.
- **Max**: product owner, final decision-maker for privacy risk, and G1 Gate decision-maker; does not substitute author opinion for independent review.
- **G2 design and security owner**: implements passed G1 principles as access control, lifecycle, vendor and cross-device design, with verifiable evidence.

Only when the privacy specialist review has no open G1 document blocking items, the psychological safety specialist review conclusion remains valid, and the remaining Gate materials are complete may Max consider final approval at the G1 document level. No conclusion authorizes real data, vendor integration, training, coding, merge, release, or real user trials.

## 6. Current status

This document defines the independent review method; **it is not a review conclusion**. The review will be performed by a non-author within a read-only, synthetic-scenario scope.
