---
title: "Deceptive Click: Reconstructing a Multi-Stage Intrusion"
published: 2026-11-22
description: "A proxy, process, Kerberos, and file-event timeline linked a fake update lure to data staging."
category: Google SecOps
tags: [Google SecOps, Threat Hunting, Incident Response, Windows]
lang: en
---

## Summary

This lab investigation reconstructed an intrusion that began with a malicious update lure. A workstation downloaded and ran a PowerShell payload; later events showed process injection, Kerberos service discovery, lateral movement to a file server, and creation of an archive. Threat-intelligence material helped explain the suspected lure, but endpoint and proxy logs provided the evidence for this specific sequence.

![Investigation flow from a fake update lure through endpoint activity to an archive on a file server.](/assets/writeups/deceptive-click.svg)

## Investigation approach

I began with the security case and used its asset context to pivot into SIEM Search. Proxy events around the download exposed both a referring site and a payload host. These values serve different roles, so I treated the referrer field separately from the destination that supplied the payload.

For process injection, I filtered `PROCESS_MODULE_LOAD` events around the suspicious activity and inspected the target process fields. The event contained both a source process and a target process; distinguishing their identifiers avoided reporting the injector's process ID as the hollowed process.

I then searched Windows Security events for Kerberos service-ticket activity and read the service principal name from the event fields. From that service, I followed process and logon activity on the file server, then checked `FILE_CREATION` events for the archive created during the same sequence.

## Findings and confidence

The evidence formed a consistent timeline: a browser-related lure preceded script execution; process and module events showed injection; Kerberos activity pointed to a database service; and later file-server events showed a service identity creating an archive.

One endpoint-hostname answer in the original notes had not been confirmed by the lab's answer checker. I therefore leave that value out and do not present it as a verified result. The remaining narrative is based on the event pivots described above, not on the threat-intelligence profile alone.

## Lessons learned

- Separate a download's referrer from its actual payload host when reading proxy logs.
- Verify process-injection fields and distinguish source from target process identifiers.
- Use Kerberos service-ticket events to guide lateral-movement pivots, then confirm with endpoint logs.
- Treat threat intelligence as a lead and confirm each claim in the affected environment's telemetry.
- Alert on script-driven downloads, suspicious process injection, unusual service-account logons, and archive creation on file servers.

Raw host, account, network, and archive identifiers are omitted from this public write-up.
