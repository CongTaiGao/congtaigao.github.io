---
title: "OAuth Heist: Hunting a Cloud Account Takeover"
published: 2026-11-22
description: "Workspace audit events connected phishing and MFA changes to OAuth abuse, database access, and data exfiltration."
category: Google SecOps
tags: [Google SecOps, Threat Hunting, OAuth, Cloud Security]
lang: en
---

## Summary

This investigation connected a cloud-account takeover to activity across identity, email, Drive, a database server, and outbound network traffic. A phishing sign-in was followed by an unexpected MFA change and an OAuth authorization. The application activity aligned with the disappearance of security alerts; a later Drive download preceded database access, a local export, and an outbound archive upload.

![Threat-hunting flow linking phishing, OAuth activity, a Drive download, database access, and outbound transfer.](/assets/writeups/oauth-heist.svg)

## Investigation approach

I used threat-intelligence reporting as a starting point, then validated each step in SIEM Search. Network and identity events established the suspicious sign-in and MFA change. I correlated those events with `EMAIL_TRANSACTION` and `USER_RESOURCE_ACCESS` records to check whether an unfamiliar OAuth application had access to the mailbox.

![Google SecOps network-event view from the phishing investigation.](/assets/writeups/screenshots/oauth-network-event.png)

For the data-access phase, I searched Workspace audit events for a Drive `item_download` action. I then pivoted to process events on the database system, looking for the export operation and the archive step. Finally, I compared the resulting file activity with `NETWORK_HTTP` events to confirm that an upload followed the local staging activity.

## Findings

The cross-product timeline was more useful than any single alert: the identity events explained how access changed, the email and OAuth events showed how alerts could be hidden, and the Drive and endpoint records connected document access to database activity. The outbound network event completed the chain by showing an archive transfer after the local export.

I used the threat-intelligence campaign and its detection rules to form search hypotheses, not as substitutes for direct evidence. This public version omits personal identifiers, email subjects, account names, document and archive names, IP addresses, URLs, and all challenge answers.

## Lessons learned

- Review MFA changes and OAuth grants together, especially when a sign-in is anomalous.
- Alert on mail applications that can delete or modify security notifications.
- Correlate Drive downloads with later database logons and export activity.
- Restrict database service identities and monitor archive creation followed by outbound transfers.
- Preserve a clear chain of event evidence while removing account and token values from shared reports.
