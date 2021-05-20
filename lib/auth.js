import { Context, createContext, useContext, useEffect, useState } from 'react';
import { registerNewUser } from './db';
import firebase from './firebase';

import { useToast } from "@chakra-ui/react"

const authContext = createContext({
  auth: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

const formatAuthState = (user) => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
  photoUrl: user.photoURL,
  token: null,
});

function useProviderAuth() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const handleAuthChange = async (authState) => {
    if (!authState) {
      setLoading(false);
      return;
    }
    const formattedAuth = formatAuthState(authState);
    formattedAuth.token = await authState.getIdToken();
    setAuth(formattedAuth);
    setLoading(false);
  };

  const getProvider = (id) => {
    switch(id){
      case "google.com":
        return new firebase.auth.GoogleAuthProvider();
      case "facebook.com":
        return new firebase.auth.FacebookAuthProvider();
      default:
        console.error('Provider not found:', id);
    }
  }

  const handleSignInError = (error, handleLinkAccount) => {
    console.log("Error code: ", error.code);
    setLoading(false);
    if (error.code === 'auth/account-exists-with-different-credential') {
      // User's email already exists.
      var pendingCred = error.credential;
      var email = error.email; // The provider account's email address.
      firebase.auth().fetchSignInMethodsForEmail(email).then(function(methods) {
        // Get sign-in methods for this email.
        // If the user has several sign-in methods, the first method in the list will be the "recommended" method to use.
        if (methods[0] === 'password') {
          toast({
            title: `Email address ${email} already in use.`,
            description: "Login manually using the email and password instead.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
        // At this point, you should let the user know that they already has an account
        // but with a different provider, and let them validate the fact they want to
        // sign in with this provider.
        // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
        // so in real scenario you should ask the user to click on a "continue" button
        // that will trigger the signInWithPopup.
        const provider = getProvider(methods[0]);
        const linkAccountMethod = (handlerSuccess, handlerFailed) => {
          firebase.auth().signInWithPopup(provider).then(function(result) {
            // Remember that the user may have signed in with an account that has a different email
            // address than the first one. This can happen as Firebase doesn't control the provider's
            // sign in flow and the user is free to login using whichever account they own.
            // Link to Google credential.
            // As we have access to the pending credential, we can directly call the link method.
            result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function() {
              handlerSuccess();
              toast({
                title: "Linked Account",
                description: `Successfully linked to ${provider}`,
                status: "success",
                duration: 2000,
                isClosable: true,
              });
            });
          }).catch(()=>{
            handlerFailed();
          });
        }
        handleLinkAccount({linkAccountMethod, providerDomain: methods[0]});
      });
    }
  }

  const signedIn = async (userCredential, customName = '') => {
    console.log(userCredential);
    if (!userCredential.user) {
      throw new Error('No User');
    }
    const authUser = formatAuthState(userCredential.user);
    if (userCredential.additionalUserInfo.providerId === 'password') {
      console.log("Custom Name:", customName);
      authUser.name = customName;
    }
    if (userCredential.additionalUserInfo.isNewUser) {
      registerNewUser({ ...authUser });
      toast({
        title: "Welcome!",
        description: "Looks like this is your first time here. Have fun!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
    toast({
      title: "Signed In",
      description: "You're now signed in.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const signInWithAuthProvider = async (providerDomain, handleLinkAccount) => {
    setLoading(true);
    const provider = getProvider(providerDomain);
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(signedIn)
      .catch((error) => {
        console.log(providerDomain, error.message);
        handleSignInError(error, handleLinkAccount);
      });
  };

  const signUpWithEmail = async (name, email, password) => {
    console.log("Sign Up with Email");
    setLoading(true);
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {signedIn(userCredential, name)})
      .catch((error) => {
        setLoading(false);
        console.log("signUpWithEmailPassword: ", error.message);
        let toastMessage = '';
        switch (error.code) {
          case 'auth/email-already-in-use':
            toastMessage = `Email address ${email} already in use.`;
            break;
          case 'auth/invalid-email':
            toastMessage = `Email address ${email} is invalid.`;
            break;
          case 'auth/operation-not-allowed':
            toastMessage = `Error during sign up.`;
            break;
          case 'auth/weak-password':
            toastMessage = 'Password is not strong enough. Add additional characters including special characters and numbers.';
            break;
          default:
            toastMessage = error.message;
            break;
        }
        toast({
          title: "Sign-up Error!",
          description: toastMessage,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const signInWithEmail = async (email, password) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(signedIn)
      .catch((error) => {
        setLoading(false);
        console.log("signInWithEmailPassword", error.message);
        let toastMessage = '';
        switch (error.code) {
          case 'auth/user-disabled':
            toastMessage = `Ths user ${email} has been disabled.`;
            break;
          case 'auth/invalid-email':
            toastMessage = `Email address ${email} is invalid.`;
            break;
          case 'auth/user-not-found':
            toastMessage = `The user cannot be found.`;
            break;
          case 'auth/wrong-password':
            toastMessage = 'Wrong password.';
            break;
          default:
            toastMessage = error.message;
            break;
        }
        toast({
          title: "Login Error!",
          description: toastMessage,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const signOut = async () => {
    return firebase.auth().signOut().then(clear);
  };

  const clear = () => {
    setAuth(null);
    setLoading(true);
    toast({
      title: "Signed Out",
      description: "You're now signed out.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };


  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(handleAuthChange);
    return () => unsubscribe();
  }, []);

  return {
    auth,
    loading,
    signInWithAuthProvider,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}

export function AuthProvider({ children }) {
  const auth = useProviderAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);