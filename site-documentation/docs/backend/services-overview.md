---
sidebar_position: 1
---

# Services Overview

Golf4Bob uses the following services for proper site operation

## Paid Services

- Firebase:

    - Firebase Firestore Database
    - Firebase Storage
    - Firebase Cloud Functions
    - Firebase Hosting

- Algolia Search
- Stripe Payment Processing



## Firebase Services Overview

Firebase and Google Cloud products are billed on the [Blaze](https://firebase.google.com/pricing) (Pay as you go) Plan.

### Firestore Database

Firestore Database has just 6 main collections (or groups), and each collection serves a separate purpose.

:::danger Editing

Do not - under any circumstances - manually edit the contents of these collections. Do not change any permissions directly regarding these collections or its contents without consulting this documentation and the site's creator. Doing so can negatively impact both site's standard functions and performance.

:::
- `_firebase_ext_`
    - A collection that is automatically managed by Firebase Cloud Functions
- `admin`
    - A collection that stores general site information and admin settings
- `archivedUsers`
    - A collection that stores the profiles of users (charities and standard users) who are no longer subscribed to the MAIN SITE, but have not deleted their account
- `pastEvents`
    - A collection that stores details of past events created by charities
- `upcomingEvents`
    - A collection that stores details regarding upcoming events created by charities
- `users`
    - A collection that stores information about active users on the main site


### Firestore Storage

Firestore Storage is used solely for storing event "posters". However, Firebase Cloud Functions build artifacts are often automatically stored in Firebase Storage, and can be deleted.

### Firebase Cloud Functions

All instances of functions deployed via Firebase Cloud Functions use the latest supported Node.js version (Node.js 10).

Some functions are deployed and controlled via [Firebase Extensions](https://firebase.google.com/products/extensions), and cannot be individually configured beyond Firebase Extension Configuration. These functions include one Algolia Search Term scraper function, and three functions related to shard counting (counting really fast).


### Firebase Hosting

Firebase Hosting is the primary hosting platform used by Golf4Bob. It is expected to remain free until significant usage begins upon product launch.

Firebase Hosting has an automatically deployed (from GitHub Actions) [dev site](https://golf-event-platform--dev-u2suwtdi.web.app/) that is publically accessible through the default Firebase Project.

## Algolia Search

Algolia Search is to be implemented in the coming weeks

## Stripe Payment Processing

Using Stripe's "Connect" platform, Golf4Bob is able to set up charity portals and easily accept, manage, and transfer funds between accounts with few fees and low development time. 

Payment processing is always triggered from a Firebase Cloud Function, and can be tracked from the [Golf4Bob Stripe Dashboard](https://dashboard.stripe.com/dashboard).