const User = require("../models/User");
const admin = require("firebase-admin");

async function createOrUpdateUserWithFirestore(decodedToken, provider) {
  const { uid, email, name, email_verified } = decodedToken;

  let user;

  if (provider === 'google') {
    user = await User.findOne({ googleId: uid });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: uid,
        role: "customer",
        authProvider: "google",
      });

      // Create Firestore user document if Firebase is initialized
      if (admin.apps.length > 0) {
        const db = admin.firestore();
        await db.collection('users').doc(user._id.toString()).set({
          name: user.name,
          email: user.email,
          role: user.role,
          authProvider: user.authProvider,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isVerified: false
        });
      }
    }
  } else if (provider === 'firebase') {
    user = await User.findOne({
      $or: [
        { firebaseUid: uid },
        { email: email }
      ]
    });

    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email,
        firebaseUid: uid,
        authProvider: "firebase",
        role: "customer",
        isVerified: email_verified || false
      });

      // Create Firestore user document if Firebase is initialized
      if (admin.apps.length > 0) {
        const db = admin.firestore();
        await db.collection('users').doc(user._id.toString()).set({
          name: user.name,
          email: user.email,
          role: user.role,
          authProvider: user.authProvider,
          firebaseUid: user.firebaseUid,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isVerified: user.isVerified
        });
        console.log("✅ New Firebase user created:", user._id);
      }
    } else {
      // Update existing user with Firebase UID if not set
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.authProvider = "firebase";
        user.isVerified = email_verified || user.isVerified;
        await user.save();

        // Update Firestore document if Firebase is initialized
        if (admin.apps.length > 0) {
          const db = admin.firestore();
          await db.collection('users').doc(user._id.toString()).update({
            firebaseUid: user.firebaseUid,
            authProvider: user.authProvider,
            isVerified: user.isVerified,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log("✅ Existing user updated with Firebase UID:", user._id);
        }
      }
    }
  }

  return user;
}

module.exports = { createOrUpdateUserWithFirestore };
