import { useRouter } from "next/router";
// import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

import { useAuthsignal } from "../utils/authsignal";
// import {cookies} from "next/headers";

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

export default function Index() {
  // noinspection TypeScriptValidateTypes
  const userId = getCookie('1clickid');
  console.log("Payment UserID: ",userId);
  //useSession();

  const router = useRouter();

  const authsignal = useAuthsignal();
  console.log("Payment1");

  const enrollPasskey = async () => {
    if (!userId) {
      throw new Error("No user in session");
    }

    console.log("token5");
    // Get a short lived token by tracking an action
    const enrollPasskeyResponse = await fetch(
        `/api/auth/enroll-passkey/?userId=${userId}`
    );

    const token = await enrollPasskeyResponse.json();
    console.log("token6", token);
    // Initiate the passkey enroll flow
    const userName = userId;

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
  };
  return (
    <div className="container">
      <h3>Welcome, {userId}</h3>
      <p>Your PayTO Agreement is Authorised.</p>

      <button onclick={enrollPasskey}>Make Payment</button>
    </div>
  );


}
