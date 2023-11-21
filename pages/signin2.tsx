//import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuthsignal } from "../utils/authsignal";

export default function SignInPage() {
  let status = "unauthenticated";
  const router = useRouter()

  const authsignal = useAuthsignal();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [authAbortController, setAuthAbortController] = useState(
      new AbortController()
  );

  useEffect(() => {
    const handlePasskeySignIn = async () => {
      console.log("handlePasskeySignIn");
      // Initialize the input for passkey autofill
      // setAuthAbortController(new AbortController());
      let signInToken;
      try {
         signInToken = await authsignal.passkey.signIn({
          autofill: true,
        });
      } catch (error) {
        console.log(error);
        // await authAbortController.abort();
      }

      // Run NextAuth's sign in flow. This will run if the user selects one of their passkeys
      // from the Webauthn dropdown.
      if (signInToken) {
       /* const result = await signIn("credentials", {
          signInToken,
          redirect: false,
        });
*/

        alert("Token: " + signInToken);

        router.replace("/")
      }
    };

    if (status === "unauthenticated") {
      handlePasskeySignIn();
    }
  }, [ authsignal.passkey, router]);

  const handleSubmit = async () => {
    console.log("un",username);
    if (!username) {
      return;
    }
    // alert("PayID is registered. Click ok to Authorise PayTo Agreement");
    // document.cookie = "1clickid="+username;
    //window.location.href = "/";
    router.replace("/");
/*const enrollPasskeyResponse = await fetch(
        `/api/auth/enroll-passkey/?userId=${email}`
    );
    alert(enrollPasskeyResponse);
    console.log("enrol",enrollPasskeyResponse);
    const token = await enrollPasskeyResponse.json();
    alert(token);
    setLoading(true);
    */

    //const resultToken = await authsignal.passkey.signUp({ email, token });

    //if (resultToken) {
      // Pass this short-lived result token to your backend to validate that passkey registration succeeded
    //}
    /* await signIn("email", {
      email,
      callbackUrl: "/",
    }); */
  };



  return (
    <form onSubmit={handleSubmit}>
      <div className="spacer" />
      <label htmlFor="username">Enter PayID to initiate payment:</label>
      <input
        id="username"
        type="text"
        onChange={(input) => setUsername(input.target.value)}
        autoComplete="username webauthn"
      />
      <button type="submit">Continue</button>
    </form>
  );
}
