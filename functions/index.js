"use strict";
const functions = require("firebase-functions");
const path = require("path");
const os = require("os");
const admin = require("firebase-admin");
const fs = require("fs");
const inkjet = require("inkjet");
const express = require("express");
const stripe = require("stripe")(
    "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
);
const { promisify } = require("util");
const bodyParser = require("body-parser");
const {
    DocumentBuilder,
} = require("firebase-functions/lib/providers/firestore");
const sizeOf = promisify(require("image-size"));
const firebase_tools = require("firebase-tools");
admin.initializeApp();
const blurhash = (function(t) {
    const e = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "#",
            "$",
            "%",
            "*",
            "+",
            ",",
            "-",
            ".",
            ":",
            ";",
            "=",
            "?",
            "@",
            "[",
            "]",
            "^",
            "_",
            "{",
            "|",
            "}",
            "~",
        ],
        a = (t) => {
            let a = 0;
            for (let r = 0; r < t.length; r++) {
                const o = t[r];
                a = 83 * a + e.indexOf(o);
            }
            return a;
        },
        r = (t, a) => {
            var r = "";
            for (let o = 1; o <= a; o++) {
                let h = (Math.floor(t) / Math.pow(83, a - o)) % 83;
                r += e[Math.floor(h)];
            }
            return r;
        },
        o = (t) => {
            let e = t / 255;
            return e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
        },
        h = (t) => {
            let e = Math.max(0, Math.min(1, t));
            return e <= 0.0031308 ?
                Math.round(12.92 * e * 255 + 0.5) :
                Math.round(255 * (1.055 * Math.pow(e, 1 / 2.4) - 0.055) + 0.5);
        },
        n = (t, e) => ((t) => (t < 0 ? -1 : 1))(t) * Math.pow(Math.abs(t), e),
        l = (t) => {
            if (!t || t.length < 6)
                throw new Error("The blurhash string must be at least 6 characters");
            const e = a(t[0]),
                r = Math.floor(e / 9) + 1,
                o = (e % 9) + 1;
            if (t.length !== 4 + 2 * o * r)
                throw new Error(
                    `blurhash length mismatch: length is ${t.length} but it should be ${
            4 + 2 * o * r
          }`
                );
        },
        s = (t) => {
            const e = (t >> 8) & 255,
                a = 255 & t;
            return [o(t >> 16), o(e), o(a)];
        },
        m = (t, e) => {
            const a = Math.floor(t / 361),
                r = Math.floor(t / 19) % 19,
                o = t % 19;
            return [
                n((a - 9) / 9, 2) * e,
                n((r - 9) / 9, 2) * e,
                n((o - 9) / 9, 2) * e,
            ];
        },
        c = (t, e, a, r) => {
            let h = 0,
                n = 0,
                l = 0;
            const s = 4 * e;
            for (let m = 0; m < e; m++)
                for (let e = 0; e < a; e++) {
                    const a = r(m, e);
                    (h += a * o(t[4 * m + 0 + e * s])),
                    (n += a * o(t[4 * m + 1 + e * s])),
                    (l += a * o(t[4 * m + 2 + e * s]));
                }
            let m = 1 / (e * a);
            return [h * m, n * m, l * m];
        };
    return (
        (t.decodePromise = (e, a, r, o = 1) =>
            new Promise((h, n) => {
                h(t.decode(e, a, r, o));
            })),
        (t.decode = (t, e, r, o = 1) => {
            l(t), (o |= 1);
            const n = a(t[0]),
                c = Math.floor(n / 9) + 1,
                i = (n % 9) + 1,
                M = (a(t[1]) + 1) / 166,
                g = new Array(i * c);
            for (let e = 0; e < g.length; e++)
                if (0 === e) {
                    const r = a(t.substring(2, 6));
                    g[e] = s(r);
                } else {
                    const r = a(t.substring(4 + 2 * e, 6 + 2 * e));
                    g[e] = m(r, M * o);
                }
            const f = 4 * e,
                d = new Uint8ClampedArray(f * r);
            for (let t = 0; t < r; t++)
                for (let a = 0; a < e; a++) {
                    let o = 0,
                        n = 0,
                        l = 0;
                    for (let h = 0; h < c; h++)
                        for (let s = 0; s < i; s++) {
                            const m =
                                Math.cos((Math.PI * a * s) / e) *
                                Math.cos((Math.PI * t * h) / r);
                            let c = g[s + h * i];
                            (o += c[0] * m), (n += c[1] * m), (l += c[2] * m);
                        }
                    let s = h(o),
                        m = h(n),
                        M = h(l);
                    (d[4 * a + 0 + t * f] = s),
                    (d[4 * a + 1 + t * f] = m),
                    (d[4 * a + 2 + t * f] = M),
                    (d[4 * a + 3 + t * f] = 255);
                }
            return d;
        }),
        (t.encodePromise = (e, a, r, o, h) =>
            new Promise((n, l) => {
                n(t.encode(e, a, r, o, h));
            })),
        (t.encode = (t, e, a, o, l) => {
            if (o < 1 || o > 9 || l < 1 || l > 9)
                throw new Error("BlurHash must have between 1 and 9 components");
            if (e * a * 4 !== t.length)
                throw new Error("Width and height must match the pixels array");
            let s = [];
            for (let r = 0; r < l; r++)
                for (let h = 0; h < o; h++) {
                    const o = 0 == h && 0 == r ? 1 : 2,
                        n = c(
                            t,
                            e,
                            a,
                            (t, n) =>
                            o *
                            Math.cos((Math.PI * h * t) / e) *
                            Math.cos((Math.PI * r * n) / a)
                        );
                    s.push(n);
                }
            const m = s[0],
                i = s.slice(1);
            let M,
                g = "";
            if (((g += r(o - 1 + 9 * (l - 1), 1)), i.length > 0)) {
                let t = Math.max(...i.map((t) => Math.max(...t))),
                    e = Math.floor(Math.max(0, Math.min(82, Math.floor(166 * t - 0.5))));
                (M = (e + 1) / 166), (g += r(e, 1));
            } else(M = 1), (g += r(0, 1));
            return (
                (g += r(
                    ((t) => {
                        return (h(t[0]) << 16) + (h(t[1]) << 8) + h(t[2]);
                    })(m),
                    4
                )),
                i.forEach((t) => {
                    g += r(
                        ((t, e) => {
                            return (
                                19 *
                                Math.floor(
                                    Math.max(
                                        0,
                                        Math.min(18, Math.floor(9 * n(t[0] / e, 0.5) + 9.5))
                                    )
                                ) *
                                19 +
                                19 *
                                Math.floor(
                                    Math.max(
                                        0,
                                        Math.min(18, Math.floor(9 * n(t[1] / e, 0.5) + 9.5))
                                    )
                                ) +
                                Math.floor(
                                    Math.max(
                                        0,
                                        Math.min(18, Math.floor(9 * n(t[2] / e, 0.5) + 9.5))
                                    )
                                )
                            );
                        })(t, M),
                        2
                    );
                }),
                g
            );
        }),
        (t.getImageData = (t) => {
            const e = t.width,
                a = t.height,
                r = new Canvas(e, a),
                o = r.getContext("2d");
            return (
                (r.width = e),
                (r.height = a),
                (o.width = e),
                (o.height = a),
                o.drawImage(t, 0, 0),
                o.getImageData(0, 0, e, a).data
            );
        }),
        (t.drawImageDataOnNewCanvas = (t, e, a) => {
            const r = document.createElement("canvas"),
                o = r.getContext("2d");
            return (
                (r.width = e),
                (r.height = a),
                (o.width = e),
                (o.height = a),
                o.putImageData(new ImageData(t, e, a), 0, 0),
                r
            );
        }),
        (t.getImageDataAsImageWithOnloadPromise = (e, a, r) =>
            new Promise((o, h) => {
                t.getImageDataAsImage(e, a, r, (t, e) => {
                    o(e);
                });
            })),
        (t.getImageDataAsImage = (e, a, r, o) => {
            const h = t.drawImageDataOnNewCanvas(e, a, r).toDataURL(),
                n = new Image(a, r);
            return (
                (n.onload = (t) => o(t, n)),
                (n.width = a),
                (n.height = r),
                (n.src = h),
                n
            );
        }),
        t
    );
})({});

// Requires doc in firestore to already be present.
// When a new image is uploaded to cloud storage,
// it is converted a hash and the hash is written
// to the event with id of the uploaded file's name.
exports.autoGenerateHashFromImage = functions.storage
    .bucket("golf-event-platform")
    .object()
    .onFinalize(async(object) => {
        // console.log("file uploaded");
        const bucket = admin.storage().bucket("golf-event-platform");
        const tempFilePath = path.join(os.tmpdir(), object.name);
        var db = admin.firestore();
        var dbRef = db
            .collection("upcomingEvents")
            .doc(
                object.name.toString().substring(0, object.name.toString().length - 4)
            );
        var imgWidth;
        var imgHeight;
        var decodedDataV;
        return bucket
            .file(object.name)
            .download({ destination: tempFilePath, validation: false })
            .then(function(object) {
                return sizeOf(tempFilePath);
            })
            .then((dimensions) => {
                return new Promise(async(resolve, reject) => {
                    imgWidth = dimensions.width;
                    imgHeight = dimensions.height;
                    decodedDataV = decodedData(tempFilePath);
                    console.log(imgWidth);
                    console.log(imgHeight);
                    resolve(decodedDataV);
                });
            })
            .then((b) => {
                return blurhash.encodePromise(decodedDataV, imgWidth, imgHeight, 4, 3);
            })
            .then((hash) => {
                console.log(hash);
                return dbRef
                    .set({
                        MainHash: hash.toString(),
                        LastUpdated: new Date(Date.now()),
                        // To trigger client
                        // ImageURL: "client",
                        // ImageDim: parseFloat(imgHeight / imgWidth),
                    }, { merge: true })
                    .then(() => {
                        console.log("Document successfully updated!");
                        return true;
                    })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });
            });

        function decodedData(stempFilePath) {
            var tR;
            inkjet.decode(fs.readFileSync(stempFilePath), function(err, decoded) {
                tR = decoded.data;
            });
            return tR;
        }
    });

exports.deleteEvent = functions.firestore
    .document("upcomingEvents/{eventID}")
    .onDelete(async(snap, context) => {
        // Get an object representing the document prior to deletion
        // e.g. {'name': 'Marie', 'age': 66}
        const deletedValue = snap.data();
        var eID = context.params.eventID;

        var db = admin.firestore();
        const collectionRef = db.collection(
            `/upcomingEvents/${eID}/registeredUsers`
        );
        const query = collectionRef.orderBy("__name__").limit(5);

        return new Promise((resolve, reject) => {
            deleteQueryBatch(db, query, resolve).catch(reject);
        }).then((t) => {
            const bucket = admin.storage().bucket("golf-event-platform");
            return bucket
                .file(`${eID}.jpg`)
                .delete()
                .then(() => {
                    return true;
                })
                .catch((error) => {
                    // Uh-oh, an error occurred!
                });
        });
    });

exports.userCleanup = functions.auth.user().onDelete(async(user) => {
    console.log(user.uid);
    var stripeID;
    const sPromise = admin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then(async(docx) => {
            stripeID = docx.data().stripeCustomerID;
            await stripe.customers.del(stripeID);
        });
    const uPromise = admin.firestore().collection("users").doc(user.uid).delete();
    const cPromise = admin
        .firestore()
        .collection("charities")
        .doc(user.uid)
        .delete();
    const ePromise = admin
        .firestore()
        .collectionGroup("registeredUsers")
        .where("uid", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });

    return Promise.all([uPromise, cPromise, ePromise, sPromise]);
});

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        console.log("NO DOCS LEFT TO DELETE");
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        console.log(`DELETING DOC: ${doc.id}`);
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

exports.createTransaction = functions.https.onCall(async(data, context) => {
    const eventDoc = data.eventDoc;
    const eventName = data.eventName;
    const eventCost = data.eventCost;
    const userUID = context.auth.uid || data.uid;
    const backURL = data.backURL;
    const eventMaxParticipants = data.eventMaxParticipants;
    const checkoutImage = data.checkoutImage;
    const customerID = data.customerID.toString();
    const userEmail = data.userEmail;
    const connectAccountID = data.stripeUID.toString();
    const perPaymentFee = data.perPaymentFee;
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called " + "while authenticated."
        );
    }
    if (!(typeof eventDoc === "string") || eventDoc.length === 0) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with " +
            'one arguments "text" containing the message text to add.'
        );
    }
    const stripe = require("stripe")(
        "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
    );
    console.log(customerID);
    if (customerID == "null") {
        console.log("customer ID was blank");
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: userEmail,
            line_items: [{
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: eventCost,
                    product_data: { name: eventName, images: [checkoutImage] },
                },
                // adjustable_quantity: {
                //   enabled: true,
                //   minimum: 1,
                //   maximum: eventMaxParticipants,
                // },
            }, ],
            metadata: { eventID: eventDoc.toString(), uID: userUID.toString() },
            payment_intent_data: {
                application_fee_amount: perPaymentFee,
                transfer_data: {
                    destination: connectAccountID,
                },
                setup_future_usage: "on_session",
            },
            submit_type: "book",
            mode: "payment",
            success_url: "https://golf-event-platform--dev-u2suwtdi.web.app/my-events/",
            cancel_url: backURL,
        });

        // 303 redirect to session.url
        return {
            returnURL: session.url,
        };
    } else {
        console.log("customerID was not blank");
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer: customerID,
            line_items: [{
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: eventCost,
                    product_data: { name: eventName, images: [checkoutImage] },
                },
                // adjustable_quantity: {
                //   enabled: true,
                //   minimum: 1,
                //   maximum: eventMaxParticipants,
                // },
            }, ],
            metadata: { eventID: eventDoc.toString(), uID: userUID.toString() },
            payment_intent_data: {
                application_fee_amount: perPaymentFee,
                transfer_data: {
                    destination: connectAccountID,
                },
                setup_future_usage: "on_session",
            },
            submit_type: "book",
            mode: "payment",
            success_url: "https://golf-event-platform--dev-u2suwtdi.web.app/my-events/",
            cancel_url: backURL,
        });

        // 303 redirect to session.url
        return {
            returnURL: session.url,
        };
    }
});

exports.createSubscription = functions.https.onCall(async(data, context) => {
    const userName = data.userName;
    const userUID = data.uid;
    const backURL = data.backURL;
    const customerID = data.customerID.toString();
    const userEmail = data.userEmail;
    const trialPeriod = data.trial;
    var db = admin.firestore();
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called " + "while authenticated."
        );
    }
    // if (!(typeof eventDoc === "string") || eventDoc.length === 0) {
    //   // Throwing an HttpsError so that the client gets the error details.
    //   throw new functions.https.HttpsError(
    //     "invalid-argument",
    //     "The function must be called with " +
    //       'one arguments "text" containing the message text to add.'
    //   );
    // }
    const stripe = require("stripe")(
        "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
    );
    return db.collection("admin")
        .doc("general")
        .get()
        .then(async(adminDoc) => {
            return adminDoc.data().trialPeriod;
        })
        .then(async(trialLength) => {
            if (customerID == "null") {
                if (trialPeriod) {
                    // var trialLength = adminDoc.data().trialPeriod;
                    console.log("null customerID, yes trial");
                    const session = await stripe.checkout.sessions.create({
                        success_url: "https://golf-event-platform--dev-u2suwtdi.web.app/",
                        cancel_url: backURL,
                        payment_method_types: ["card"],
                        customer_email: userEmail,
                        line_items: [
                            { price: "price_1JHGlbB26mRwp60OMAeOZOnb", quantity: 1 },
                        ],
                        mode: "subscription",
                        metadata: {
                            userEmail: userEmail.toString(),
                            uID: userUID.toString(),
                            userName: userName.toString(),
                        },
                        subscription_data: {
                            trial_period_days: trialLength,
                        },
                    });
                    console.log(`session generated: ${session.toString()}`);
                    return {
                        returnURL: session.url,
                    };
                } else {
                    console.log("null customerID, no trial");
                    const session = await stripe.checkout.sessions.create({
                        success_url: "https://golf-event-platform--dev-u2suwtdi.web.app/",
                        cancel_url: backURL,
                        payment_method_types: ["card"],
                        customer_email: userEmail,
                        line_items: [
                            { price: "price_1JHGlbB26mRwp60OMAeOZOnb", quantity: 1 },
                        ],
                        mode: "subscription",
                        metadata: {
                            userEmail: userEmail.toString(),
                            uID: userUID.toString(),
                            userName: userName.toString(),
                        },
                    });
                    console.log(`session generated: ${session.toString()}`);
                    return {
                        returnURL: session.url,
                    };
                }
            } else {
                const session = await stripe.checkout.sessions.create({
                    success_url: "https://golf-event-platform--dev-u2suwtdi.web.app/",
                    cancel_url: backURL,
                    payment_method_types: ["card"],
                    customer: customerID,
                    line_items: [
                        { price: "price_1JHGlbB26mRwp60OMAeOZOnb", quantity: 1 },
                    ],
                    mode: "subscription",
                    metadata: {
                        userEmail: userEmail.toString(),
                        uID: userUID.toString(),
                        userName: userName.toString(),
                    },
                });
                return {
                    returnURL: session.url,
                };
            }
        });
});

const app = require("express")();
app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    (request, response) => {
        const stripe = require("stripe")(
            "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
        );
        const sig = request.headers["stripe-signature"];
        let event;
        const endpointSecret = "whsec_M1G6CIpLr2HsOehz5D8E0InfUv885nZT";
        try {
            event = stripe.webhooks.constructEvent(
                request.rawBody.toString(),
                sig,
                endpointSecret
            );
        } catch (err) {
            return response.status(400).send(`Webhook Error: ${err.message}`);
        }
        var userDocID;
        if (event.type === "checkout.session.completed") {
            if (event.data.object.mode == "payment") {
                const session = event.data.object;
                const eventDocID = event.data.object.metadata.eventID;
                const userID = event.data.object.metadata.uID;
                // console.log(session);
                var db = admin.firestore();
                const fulfill = db
                    .collection(`upcomingEvents/${eventDocID}/registeredUsers`)
                    .add({
                        uid: userID.toString(),
                        dt: new Date(Date.now()),
                        paymentIntent: event.data.object.payment_intent.toString(),
                        stripeID: event.data.object.id.toString(),
                        customerID: event.data.object.customer.toString(),
                        paidRegistration: true,
                    });
                const updateCustID = db.collection("users").doc(userID).set({
                    stripeCustomerID: event.data.object.customer.toString(),
                }, { merge: true });
                return Promise.all([fulfill, updateCustID])
                    .then((t) => {
                        return response.status(200).send({ done: true });
                    })
                    .catch((er) => {
                        // alert(er);
                        return response.status(400).send(`Webhook Error: ${err.message}`);
                    });
            } else {
                return response.status(200).send({ done: false });
            }
        }
    }
);
exports.stripePaymentDoneLetsFulfillTheOrder = functions.https.onRequest(app);

const app2 = express();
app2.post(
    "/webhook2",
    express.raw({ type: "application/json" }),
    (request, response) => {
        const sig = request.headers["stripe-signature"];
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                request.rawBody,
                sig,
                "whsec_h2UmGOY7AYPHMZqcOaEbmXxNxzCBo8pC"
            );
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
        }
        var userDocID;
        if (event.type === "checkout.session.completed") {
            if (event.data.object.mode == "subscription") {
                const session = event.data.object;
                const userEmail = event.data.object.metadata.userEmail;
                const userID = event.data.object.metadata.uID;
                const userName = event.data.object.metadata.userName;
                // console.log(session);
                var db = admin.firestore();
                const fulfill = db
                    .collection("users")
                    .doc(userID.toString())
                    .set({
                        accountCreated: new Date(Date.now()),
                        accountType: "standard",
                        stripeCustomerID: event.data.object.customer.toString(),
                        email: userEmail.toString(),
                        name: userName.toString(),
                    });
                const deleteee = db
                    .collection("deletedUsers")
                    .doc(userID.toString())
                    .delete();
                return Promise.all([fulfill, deleteee])
                    .then((t) => {
                        return response.status(200).send({ done: true });
                    })
                    .catch((er) => {
                        // alert(er);
                        return response
                            .status(400)
                            .send(`Webhook Processing Error: ${err.message}`);
                    });
            } else {
                return response.status(200).send({ done: false });
            }
        } else {
            return response.status(400).send({ done: false });
        }
    }
);
exports.stripeSubscriptionDoneLetsFulfill = functions.https.onRequest(app2);

exports.createNewStripeProductFromFirestore = functions.firestore
    .document("upcomingEvents/{eventID}")
    .onCreate((doc, context) => {
        const stripe = require("stripe")(
            "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
        );
        return stripe.products
            .create({
                name: doc.data().Name,
                images: [doc.data().ImageURL],
            })
            .then((f) => {
                stripe.prices.create({
                    unit_amount: doc.data().Cost,
                    currency: "usd",
                    product: f.id,
                });
            });
    });

exports.fetchUserPortal = functions.https.onCall(async(data, context) => {
    const redirURL = data.redir.toString();
    const customerID = data.customerID.toString();
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called " + "while authenticated."
        );
    }
    // if (!(typeof customerID === "string") || customerID.length === 0) {
    //   // Throwing an HttpsError so that the client gets the error details.
    //   throw new functions.https.HttpsError(
    //     "invalid-argument",
    //     "The function must be called with " +
    //       'one arguments "text" containing the message text to add.'
    //   );
    // }
    const stripe = require("stripe")(
        "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
    );
    const session = await stripe.billingPortal.sessions.create({
        customer: customerID,
        return_url: redirURL,
    });
    return {
        returnURL: session.url,
    };
});

const app3 = express();
app3.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (request, response) => {
        var db = admin.firestore();
        const sig = request.headers["stripe-signature"];
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                request.rawBody,
                sig,
                "whsec_iYJcbnIB2OlCkabsIKpdMxBk5FxtJpoN"
            );
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === "customer.subscription.updated") {
            console.log(`data: ${event.data.object.pause_collection}`);
            var stripeCustomerID = event.data.object.customer.toString();
            if (event.data.object.pause_collection != null) {
                if (event.data.object.status == "canceled") {
                    var stripeCustomerID = event.data.object.customer.toString();
                    db.collection("users")
                        .where("stripeCustomerID", "==", stripeCustomerID)
                        .get()
                        .then((querySnapshot) => {
                            var userData = querySnapshot.docs[0];
                            db.collection("deletedUsers")
                                .doc(userData.id)
                                .set(userData.data())
                                .then((f) => {
                                    db.collection("users")
                                        .doc(userData.id)
                                        .delete()
                                        .then((g) => {
                                            return response.status(200).send({ done: true });
                                        });
                                });
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                            return response.status(500).send({ done: false });
                        });
                } else {
                    db.collection("users")
                        .where("stripeCustomerID", "==", stripeCustomerID)
                        .get()
                        .then((querySnapshot) => {
                            var userData = querySnapshot.docs[0];
                            db.collection("archivedUsers")
                                .doc(userData.id)
                                .set(userData.data())
                                .then((f) => {
                                    db.collection("users")
                                        .doc(userData.id)
                                        .delete()
                                        .then((g) => {
                                            return response.status(200).send({ done: true });
                                        });
                                });
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                            return response.status(500).send({ done: false });
                        });
                }
            } else {
                db.collection("archivedUsers")
                    .where("stripeCustomerID", "==", stripeCustomerID)
                    .get()
                    .then((querySnapshot) => {
                        var userData = querySnapshot.docs[0];
                        try {
                            db.collection("users")
                                .doc(userData.id)
                                .set(userData.data())
                                .then((f) => {
                                    db.collection("archivedUsers")
                                        .doc(userData.id)
                                        .delete()
                                        .then((g) => {
                                            return response.status(200).send({ done: true });
                                        });
                                });
                        } catch (er) {
                            return response.status(200).send({ done: false });
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                        return response.status(500).send({ done: false });
                    });
            }
            // return response.status(200).send({ done: false });
        } else if (event.type === "customer.subscription.deleted") {
            var stripeCustomerID = event.data.object.customer.toString();
            db.collection("users")
                .where("stripeCustomerID", "==", stripeCustomerID)
                .get()
                .then((querySnapshot) => {
                    var userData = querySnapshot.docs[0];
                    try {
                        db.collection("deletedUsers")
                            .doc(userData.id)
                            .set(userData.data())
                            .then((f) => {
                                db.collection("users")
                                    .doc(userData.id)
                                    .delete()
                                    .then((g) => {
                                        return response.status(200).send({ done: true });
                                    });
                            });
                    } catch (e) {
                        return response.status(200).send({ done: false });
                    }
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                    return response.status(500).send({ done: false });
                });
        } else {
            return response.status(200).send({ done: false });
        }
    }
);
exports.subscriptionUpdate = functions.https.onRequest(app3);

exports.refundSingleTransaction = functions.https.onCall(
    async(data, context) => {
        const eventID = data.eventID.toString();
        const regID = data.regID.toString();
        const uid = data.uid.toString();
        const pID = data.paymentID.toString();
        var db = admin.firestore();
        if (!context.auth) {
            // Throwing an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError(
                "failed-precondition",
                "The function must be called " + "while authenticated."
            );
        }
        const stripe = require("stripe")(
            "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
        );
        return db
            .collection(`upcomingEvents/${eventID}/registeredUsers`)
            .doc(regID)
            .get()
            .then((confirmDoc) => {
                if (
                    confirmDoc.data().paidRegistration &&
                    confirmDoc.data().paymentIntent == pID &&
                    confirmDoc.data().uid == uid
                ) {
                    return stripe.refunds
                        .create({
                            payment_intent: pID,
                            refund_application_fee: true,
                            reverse_transfer: true,
                        })
                        .then((f) => {
                            return db
                                .collection(`upcomingEvents/${eventID}/registeredUsers`)
                                .doc(regID)
                                .delete()
                                .then((g) => {
                                    return { completed: true };
                                });
                        });
                } else {
                    throw new functions.https.HttpsError(
                        "failed-precondition",
                        "Arguments don't match up " + "with database entires."
                    );
                }
            });
    }
);

exports.documentWriteListener = functions.firestore
    .document("upcomingEvents/{documentUid}")
    .onWrite((change, context) => {
        var db = admin.firestore();
        var docRef = "admin/counters";
        if (!change.before.exists) {
            // New document Created : add one to count

            db.doc(docRef).update({
                upcomingEvents: admin.firestore.FieldValue.increment(1),
            });
        } else if (change.before.exists && change.after.exists) {
            // Updating existing document : Do nothing
        } else if (!change.after.exists) {
            // Deleting document : subtract one from count

            db.doc(docRef).update({
                upcomingEvents: admin.firestore.FieldValue.increment(-1),
            });
        }

        return true;
    });

exports.userWriteListener = functions.firestore
    .document("users/{documentUid}")
    .onWrite((change, context) => {
        var db = admin.firestore();
        var docRef = "admin/counters";
        if (!change.before.exists) {
            // New document Created : add one to count

            db.doc(docRef).update({ users: admin.firestore.FieldValue.increment(1) });
        } else if (change.before.exists && change.after.exists) {
            // Updating existing document : Do nothing
        } else if (!change.after.exists) {
            // Deleting document : subtract one from count

            db.doc(docRef).update({
                users: admin.firestore.FieldValue.increment(-1),
            });
        }

        return true;
    });

// 1 of jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec 00:00
exports.monthlyDelete = functions.pubsub.schedule("0 3 * * *").timeZone('America/New_York').onRun(async(context) => {
    const db = admin.firestore();
    const currentDate = new Date();
    const upcomingRef = db.collection("upcomingEvents");
    var uGet = await upcomingRef.get();
    const deleteOps = [];
    uGet.forEach(async(doc) => {
        const date = new Date(doc.data().DateTime.seconds * 1000);
        if (date < currentDate) {
            deleteOps.push(admin.firestore().collection("pastEvents").doc(doc.id).set(doc.data()));
            deleteOps.push(doc.ref.delete());
            console.log(`Tee: ${doc.id} - ${date}`);
        }
    });
    return Promise.all(deleteOps);
});

exports.createConnectPortalLink = functions.https.onCall(async(data, context) => {
    const uid = data.uid.toString();
    const stripe = require("stripe")(
        "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
    );
    const session = await stripe.accounts.create({
        type: 'express',
    });
    const dbUpdate = await admin.firestore().collection(`users/${uid}/stripeConnect`).doc("accountCreation").set(session);
    return {
        returnID: session.id,
        dbReturn: dbUpdate,
    };
});

exports.resumeConnectPortalCreation = functions.https.onCall(async(data, context) => {
  const uid = data.uid.toString();
  const userID = data.userID.toString();
  const stripe = require("stripe")(
      "sk_test_51J4urTB26mRwp60O5BbHIgEDfkczfRIK4xIrXYkwvVxTzheYbS02lEps3Y1sTlABA6q66i7WvwW3wFjeglJ7iXgq00ucGEKJPn"
  );
  const accountLink = await stripe.accountLinks.create({
      account: uid,
      refresh_url: 'https://golf-event-platform--dev-u2suwtdi.web.app/account/',
      return_url: 'https://golf-event-platform--dev-u2suwtdi.web.app/account/',
      type: 'account_onboarding',
  });
  const dbUpdate = await admin.firestore().collection(`users/${userID}/stripeConnect`).add(accountLink);
  return {
      URLCreated: accountLink.created,
      URLExpiration: accountLink.expires_at,
      returnURL: accountLink.url,
      dbReturn: dbUpdate,
  };
});