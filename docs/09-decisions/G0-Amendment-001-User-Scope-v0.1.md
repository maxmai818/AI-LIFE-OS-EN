# G0 Amendment 001: User Scope and Independent Use by Friends

- **Status**: Approved
- **Decision maker**: Max
- **Date**: 2026-09-01
- **Change type**: G0 scope clarification
- **Affected decision**: `DEC-001`
- **Related document**: `Roadmap-Review-Decisions-v0.1.md`

## 1. Background

The original `DEC-001` defined the first users as being built for Max alone. After further clarification, Max wants to be able to invite friends to use the product in the future, but each friend uses it independently and none of them can see each other's data.

## 2. Formal decision

Adopt the following product and system boundary:

> AI Life OS is a "single-player private experience, supporting multiple independent users" system. Each user has their own account, goals, Capture, Review, and personal data, fully isolated by default.

Specific decisions:

1. POC-01 still takes Max as the primary validation user, to reduce the cost of validating the core loop.
2. Product and data design must not hard-code Max as the only user; core records belong to an explicit `user_id` from the design stage onward.
3. Before inviting friends to save real data, identity authentication, user data isolation, authorization checks, and personal data export and deletion must be verified.
4. Friends use their own independent accounts and cannot see Max's or other friends' data by default.
5. No friend relationships, leaderboards, shared goals, record sharing, social feeds, or collaborative spaces will be built at this time.
6. "Allowing multiple independent users" does not equal "multi-person collaboration". Any sharing feature must in the future come with its own requirements, privacy design, and authorization model.

## 3. Revision to DEC-001

`DEC-001` is revised to:

> The first POC takes Max as the primary validation user; the system is designed to be extensible to multiple independent private accounts. Once the core loop passes and data isolation is verified, a small number of friends may be invited for independent-account private beta.

This revision supersedes the absolute wording in the original `DEC-001` ("built for Max only; not premised on a multi-user general-purpose product for now"). All other G0 decisions remain unchanged.

## 4. Impact on the SDLC

### Additions to the G1 requirements baseline

- Phase boundaries for user registration/login
- Ownership definition for all personal data
- Users can only access their own data
- Personal export and deletion requirements
- Entry conditions for the friends' private beta
- Explicit exclusion of social and collaboration features

### Additions to the G2 design baseline

- `User` / `Profile` conceptual model
- `user_id` or equivalent ownership field on all core entities
- Server-side authorization checks
- Database-level isolation strategy
- Test account and test data isolation
- Threat model for privilege escalation / unauthorized access

### Must pass before the friends' private beta

1. Isolation tests for read, modify, and delete between two different test accounts.
2. Data export can only contain the current user's data.
3. Account deletion does not affect other users.
4. Logs and AI request chains do not incorrectly mix in other users' contexts.
5. Admin and debug tools do not expose users' raw sensitive records by default.

## 5. What does not change

- POC-01 still prioritizes validating Capture → AI structuring/correction → Review.
- No social features are built at this time.
- No shared goals or joint reviews are built at this time.
- Coding still does not begin; G1/G2 document reviews are completed first.
