---
title: "The State of Trust: Predictable OAuth State"
published: 2026-11-16
description: "A timestamp-derived OAuth state and an unbound user identifier allowed an administrator callback to be forged."
category: Web
tags: [Web Security, OAuth, Authentication]
lang: en
---

## Summary

The application generated OAuth `state` from the current Unix timestamp and a user ID. Its callback accepted a user ID from the query string and did not bind that identity to a login flow initiated by the user's session. Because the state formula was predictable and the administrator ID was exposed in the application source, a valid administrator callback could be forged.

## Investigation

The challenge exchanged a team session for an application session, then presented a lobby with several selectable identities. The administrator was not available in the lobby. A publicly accessible backup copy of the application source revealed the administrator ID and the state-generation formula:

```python
hashlib.md5(f"{int(time.time())}:{user_id}".encode()).hexdigest()
```

The callback accepted timestamps within a five-minute window. It trusted the `user_id` query parameter and wrote that identity into the session without checking that the state belonged to a login transaction previously started by the same user.

## Exploitation

After exchanging a current team session for an application session, the test was to compute the expected state for the administrator ID and request the OAuth callback with that state and ID. The callback accepted it, the administrator dashboard became available, and the challenge endpoint returned its answer.

No session token, cookie value, or challenge answer is included here. The challenge application's result was verified directly. The separate scoreboard submission could not be verified because its endpoint required a POCTF login session.

## Root cause and remediation

OAuth `state` should be unpredictable, single-use, and bound server-side to the browser session and the specific authorization request. The callback should not accept an identity supplied by the client as proof of authentication. Validate the provider's response, bind the returned identity to the initiated flow, and use PKCE where appropriate.
