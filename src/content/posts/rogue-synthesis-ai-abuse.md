---
title: "Rogue Synthesis: Tracking AI-Assisted Endpoint Abuse"
published: 2026-11-22
description: "A fake editor extension led to AI API traffic, payload staging, cloud credential access, and CI persistence."
category: Google SecOps
tags: [Google SecOps, Incident Response, Endpoint Security, AI Security]
lang: en
---

## Summary

This investigation followed a developer workstation after a suspicious code-editor extension launched an unexpected process. Correlated network, process, and file events showed the extension contacting an AI service, staging a compiled payload, accessing local cloud configuration, and sending data outside the environment. A service identity was then used to alter a script on a continuous integration runner.

The diagram summarizes the sequence without publishing hostnames, account names, file paths, domains, credentials, or challenge answers.

![Investigation flow from an untrusted editor extension to cloud credential access and CI persistence.](/assets/writeups/ai-assisted-abuse.svg)

## Investigation approach

I started with the developer endpoint's network events and looked for the AI API request. From that event, I pivoted backward to the extension download and process launch. This connected the otherwise ordinary API traffic to a newly installed extension rather than treating the destination alone as proof of compromise.

![Google SecOps raw event showing the AI service request.](/assets/writeups/screenshots/google-ai-request.png)

Next, I reviewed process creation and file events around the same activity. The compiler command line identified a newly created executable, while a later process event showed local cloud configuration being read. I then compared the subsequent outbound connections with that credential-access timeline.

Finally, I pivoted to the service identity and CI host. A file-creation event showed a script being replaced after the workstation activity. The ordered sequence tied endpoint compromise to a change on a separate runner.

## Evidence chain

The useful UDM event types were `NETWORK_HTTP`, `PROCESS_LAUNCH`, and `FILE_CREATION`. Each event supplied a different part of the chain: network records established communication, process records showed how the extension and payload ran, and file records confirmed staging and the later CI change.

The strongest conclusion came from correlation across those event types and systems. An AI API request by itself was not malicious evidence; its timing beside an untrusted extension, payload compilation, credential access, and unusual egress made the sequence suspicious.

## Lessons learned

- Restrict editor extensions to approved publishers and monitor new or changed installations.
- Prefer short-lived workload identity over long-lived credentials stored in developer profiles.
- Alert when a developer workstation reads cloud configuration and then makes unusual outbound connections.
- Keep CI runners disposable, restrict service identities, and alert on unexpected script changes.

This public version intentionally omits raw indicators and values that could identify a lab account or expose credentials.
