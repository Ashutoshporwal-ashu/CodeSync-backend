import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
            // Apni .env file se keys le rahe hain
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Testing ke liye hum check kar rahe hain ki Google kya laya hai
                console.log("Google se aaya data:", profile);

                // Yahan hum apna Controller wala logic baad mein add karenge (User find/create karna)
                
                // done(error, data) - Yeh Passport ko batata hai ki kaam ho gaya, data aage bhejo
                return done(null, profile);
            } catch (error) {
                console.log("Passport Error:", error);
                return done(error, null);
            }
        }
    )
);

export default passport;