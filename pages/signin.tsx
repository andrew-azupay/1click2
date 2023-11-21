//import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuthsignal } from "../utils/authsignal";

export default function SignInPage() {
  let status = "unauthenticated";
  //const router = useRouter()

  const authsignal = useAuthsignal();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const userCookie = getCookie('1clickid');

  //const [authAbortController, setAuthAbortController] = useState(
  //    new AbortController()
  //);

  useEffect(() => {
    const handlePasskeySignIn = async () => {
      if (status !== "unauthenticated") {
        return;
      }
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
          const callbackResponse = await fetch(
              `/api/auth/callback/?token=${signInToken}`
          );

          const { success, userId } = await callbackResponse.json();
          console.log("Username", userId);
          document.cookie = "1clickid="+userId;
          alert("Payment Authorised and Initiated");
        }
    };

    if (status === "unauthenticated") {
      handlePasskeySignIn();
    }
  }, [status, authsignal.passkey]);

  const enrollPasskey = async () => {
    if (!username) {
      throw new Error("No user in session");
    }
    status = "enrolling";
    console.log("token5");
    // Get a short lived token by tracking an action
    const enrollPasskeyResponse = await fetch(
        `/api/auth/enroll-passkey/?userId=${username}`
    );

    const token = await enrollPasskeyResponse.json();
    console.log("token6", token);
    // Initiate the passkey enroll flow
    const userName = username;

    const resultToken = await authsignal.passkey.signUp({
      userName,
      token,
    });

    // Check that the enrollment was successful
    const callbackResponse = await fetch(
        `/api/auth/callback/?token=${resultToken}`
    );

    const { success } = await callbackResponse.json();

    if (success) {
      alert("Successfully added passkey");
    } else {
      alert("Failed to add passkey");
    }
    return success;
  };

  const authCookieUser = async () => {
    if (!userCookie) {
      throw new Error("No userCookie in session");
    }
    status = "cookie-ing";
    console.log("In cookie");
    // Get a short lived token by tracking an action
    const enrollPasskeyResponse = await fetch(
        `/api/auth/cookie-auth/?userId=${userCookie}`
    );

    const token = await enrollPasskeyResponse.json();
    console.log("token6", token);
    // Initiate the passkey enroll flow
    const resultToken = await authsignal.passkey.signIn({ token });

    if (resultToken) {
      alert("Payment Authorised and Initiated");
    } else {
      alert("Payment Failed");
    }
    return resultToken;
  };

  const handleSubmit = async () => {
    console.log("un",username);
    if (!username) {
      return;
    }
    alert("PayID is registered. Click ok to Authorise PayTo Agreement");
    document.cookie = "1clickid="+username;
    const passkeyStatus = await enrollPasskey();
    if (passkeyStatus) {
      alert("Payment Authorised and Initiated");
    } else {
      alert("Payment Failed");
    }
  };

  function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }



  return (
      <div>
        <div className="spacer" />
        <div id="keydiv">
          <label htmlFor="username">Enter PayID to initiate payment:</label>
          <input
            id="username"
            type="text"
            onChange={(input) => setUsername(input.target.value)}
            autoComplete="username webauthn"
          />
          <button onClick={handleSubmit}>Check PayID</button>

        </div>
        <div className="spacer" />
        <div id="cookiediv">
          <input
              id="cookietext"
              type="text"
              value={userCookie}
              readOnly={true}
          />
          <button id="cookieButton" onClick={authCookieUser}>Make Payment via Cookie</button>
        </div>
      </div>

  );
}
