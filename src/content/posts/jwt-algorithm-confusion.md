---
title: "Levitation: JWT Algorithm Confusion"
published: 2026-11-13
description: "A JWT verifier accepted an HMAC signature made with its public RSA key and trusted a forged role claim."
category: Web
tags: [Web Security, JWT, Authentication]
lang: en
---

## Summary

The application issued an RS256-signed session JWT with a low-privilege role. It also published the corresponding RSA public key. The verifier trusted the algorithm named in the JWT header, so changing the header to HS256 caused the same public key to be treated as an HMAC secret. The forged token was accepted with an elevated role.

![JWT algorithm confusion flow showing an RSA public key misused as an HMAC secret.](/assets/writeups/jwt-algorithm-confusion.svg)

## Reconnaissance

The challenge portal provided a short-lived team session exchange and a public register containing a JWKS endpoint and a PEM representation of the RSA public key. A valid session opened the application as a medium-privilege user. The transcript endpoint returned a restricted response for that role and indicated that a higher role was required.

The issued JWT header selected RS256 and identified the key with a `kid` value. Its payload contained the team, role, and time claims. The public key's modulus and exponent matched the JWKS entry.

## Exploitation

The verifier used the key identifier to select the RSA public key but did not pin the allowed signing algorithm to that key type. The test was to:

1. Open a valid session and decode its JWT locally.
2. Preserve the session's team and time claims, change the role claim to the challenge's privileged role, and change the header algorithm from RS256 to HS256.
3. Compute an HMAC-SHA256 signature over the encoded header and payload, using the published PEM bytes as the HMAC key.
4. Send the forged JWT as the session cookie to the transcript endpoint.

The server accepted the forged token and returned the privileged transcript. The session cookie and challenge marker are intentionally omitted.

## Root cause and remediation

The verifier allowed an untrusted token header to choose the verification algorithm. It then reused an RSA public key as a symmetric signing secret. Pin the permitted algorithm in server configuration, bind each key to its intended algorithm and type, and derive authorization from server-controlled state rather than accepting role claims without validation.
