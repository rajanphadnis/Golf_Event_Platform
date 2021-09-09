---
sidebar_position: 1
---

# Site Overview

## General Information

This is the site's hierarchy:

```
/
|
+ my-events
|   |
|   + edit (charity only)
|   |
|   + new-event (charity only)
|
+ event
|   |
|   + register
|   |
|   + refund
|
+ account
|
+ account-management
|
+ landing
|
+ onboarding
|
+ sign-in
|
+ sign-out
|
+ ethics.html
|
+ purchaseAgreement.html
|
+ terms.html
```

## Site Security

As a general rule, this site does not directly write to (or update) the database. However, there are three exceptions:

- Page view counter (site will increment event's [sharded counter](https://firebase.google.com/docs/firestore/solutions/counters))
- A charity's "Create New Event" page
- A charity's "Edit Event" page 

The rest of the database entries and creation takes place on the backend ([see backend documentation](/docs/backend/services-overview#firebase-cloud-functions))

