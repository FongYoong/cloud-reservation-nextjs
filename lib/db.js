import firebase from './firebase';
//import firebaseAdmin from './firebase-admin';
import axios from 'axios';

/*
auth has the shape
email: "fongyoong8@gmail.com"
name: "Fong Chien Yoong"
photoUrl: "https://lh3.googleusercontent.com/a-/AOh14GiZceMQw4o2k6UQpelNEeA-jxVA97pVRVY3BilkLw=s96-c"
token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUzNmRhZWFiZjhkZDY1ZDRkZTIxZTgyNGI4OTlhMWYzZGEyZjg5NTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiRm9uZyBDaGllbiBZb29uZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaVpjZU1RdzRvMms2VVFwZWxORWVBLWp4VkE5N3BWUlZZM0JpbGtMdz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9jbG91ZC1yZXNlcnZhdGlvbi1kYjdiMyIsImF1ZCI6ImNsb3VkLXJlc2VydmF0aW9uLWRiN2IzIiwiYXV0aF90aW1lIjoxNjIxMjc3MzYyLCJ1c2VyX2lkIjoiRGZ4TThTWG1OdFhSdHcwRXFlUzBVQ1RpT1J3MSIsInN1YiI6IkRmeE04U1htTnRYUnR3MEVxZVMwVUNUaU9SdzEiLCJpYXQiOjE2MjEzMDc2NzcsImV4cCI6MTYyMTMxMTI3NywiZW1haWwiOiJmb25neW9vbmc4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTAwMTMyOTU2MTU0NDQwNjgzODU4Il0sImVtYWlsIjpbImZvbmd5b29uZzhAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.DRsQNsa50na-ew0DB_odOTp7NGgjZ215NUcoqCILpEomTUqGEdVLd3LCGGY5s-Cg-a37HFW40LXFTxneU9prsvZUMOYW8atzD5h_DfMiOcYCPiv-NQAAvgj2-g8KWCcfxktEbfzKF4383WaK1ZRrP-rhxN7S3aHRc_vbROkOSa9LF22yUdwT9HFZ51enGCTMeIbdg7-vVHXsfwXG5rMgz_bxlqqCdPMnKfcMliPMqGBFmPy5ztJ0oNX2AxlRsCdi0WXuzefnYEuGGlVld0_bd9IV1sU0tLxMNniMJeHrtchH64S8AO_hanfyhKG9r8kXBWMQXg9qLmFaLJwT2MTG5w"
uid: "DfxM8SXmNtXRtw0EqeS0UCTiORw1"
*/

//////////////////////////////////////////////
// Get ///////////////////////////////////////
//////////////////////////////////////////////

export const getUserProfile = async (uid, handler) => {
  firebase.database().ref(`users/${uid}/profile`).once('value').then((snapshot) => {
    handler(snapshot.val());
  });
};

export const getServices = async (successHandler) => {
  firebase.database().ref(`publicServices/`).orderByChild('dateCreated').once('value').then((snapshot) => {
    successHandler(snapshot.val());
  });
};

export const getServicePublicDetails = async (serviceId, handler) => {
  firebase.database().ref(`services/${serviceId}/public`).once('value').then((snapshot) => {
    handler(snapshot.val());
  });
};

export const getServiceOrders = async (watch, serviceId, handler, errorHandler) => {
  const ref = firebase.database().ref(`services/${serviceId}/orders`);
  if (watch) {
    ref.on('value', (snapshot) => {
      handler(snapshot.val());
    }, errorHandler);
  }
  else{
    ref.once('value').then((snapshot) => {
      handler(snapshot.val());
    });
  }
};

export const getOrderDetails = async (watch, serviceId, orderId, handler, errorHandler) => {
  const ref = firebase.database().ref(`services/${serviceId}/orders/${orderId}`);
  if (watch) {
    ref.on('value', (snapshot) => {
      handler(snapshot.val());
    }, errorHandler);
  }
  else{
    ref.once('value').then((snapshot) => {
      handler(snapshot.val());
    }).catch(errorHandler);
  }
};

//////////////////////////////////////////////
// Add ///////////////////////////////////////
//////////////////////////////////////////////

export const registerNewUser = async (authUser) => {
  firebase.database().ref(`users/${authUser.uid}/profile`).set({
    username: authUser.name,
    email: authUser.email,
    profile_picture : authUser.photoUrl
  });
};

export const addNewService = async (authUser, data, successHandler, errorHandler) => {
  const currentTimeMillis = new Date().getTime();
  const newChildRef = firebase.database().ref('services/').push();
  const serviceId = newChildRef.key;
  const updateServices = newChildRef.set({
    public: {
      ...data,
      ownerId: authUser.uid,
    },
    dateCreated: currentTimeMillis,
  });
  // Update public registry
  const updateRegistry = firebase.database().ref(`publicServices/${serviceId}`).set({
    name: data.name,
    ownerId: authUser.uid,
    dateCreated: currentTimeMillis,
  });
  // Update user profile
  const updateProfile = firebase.database().ref(`users/${authUser.uid}/services/${serviceId}`).update({
      dateCreated: currentTimeMillis
  });
  Promise.all([updateServices, updateRegistry, updateProfile]).then(() => successHandler(serviceId)).catch(errorHandler);
};

export const addNewOrder = async (authUser, serviceId, data, successHandler, errorHandler) => {
  const currentTimeMillis = new Date().getTime();
  const newChildRef = firebase.database().ref(`services/${serviceId}/orders/`).push();
  const orderId = newChildRef.key;
  const updateServices = newChildRef.set({
    ...data,
    status: 'initial',
    userId: authUser.uid,
    dateCreated: currentTimeMillis,
  });
  // Update user profile
  const updateProfile = firebase.database().ref(`users/${authUser.uid}/orders/${orderId}`).update({
      serviceId,
      dateCreated: currentTimeMillis
  });
  Promise.all([updateServices, updateProfile]).then(() => successHandler(orderId)).catch(errorHandler);
};

export const addServiceReview = async (authUser, serviceId, orderId, data, successHandler, errorHandler) => {
  const updateService = firebase.database().ref(`services/${serviceId}/reviews`).push({
      ...data,
  });
  // Update order
  const updateOrder = firebase.database().ref(`services/${serviceId}/orders/${orderId}`).update({
      reviewGiven: true,
  });
  Promise.all([updateService, updateOrder]).then(successHandler).catch(errorHandler);
};


//////////////////////////////////////////////
// Update ////////////////////////////////////
//////////////////////////////////////////////

export const updateService = async (authUser, serviceId, data, successHandler, errorHandler) => {
  const updateServiceData = firebase.database().ref(`services/${serviceId}/public`).set({
      ...data,
      ownerId: authUser.uid,
  });
  // Update public registry
  const updateRegistry = firebase.database().ref(`publicServices/${serviceId}`).update({
    name: data.name,
  });
  Promise.all([updateServiceData, updateRegistry]).then(successHandler).catch(errorHandler);
};

export const updateOrder = async (authUser, serviceId, orderId, data, successHandler, errorHandler) => {
  firebase.database().ref(`services/${serviceId}/orders/${orderId}`).update({
      ...data,
  }).then(successHandler).catch(errorHandler);
};

//////////////////////////////////////////////
// Delete ////////////////////////////////////
//////////////////////////////////////////////

export const deleteService = async (authUser, serviceId, successHandler, errorHandler) => {
  const updateServices = firebase.database().ref(`services/${serviceId}`).remove();
  // Update public registry
  const updateRegistry = firebase.database().ref(`publicServices/${serviceId}`).remove();
  const updateProfile = firebase.database().ref(`users/${authUser.uid}/services/${serviceId}`).remove();
  Promise.all([updateServices, updateRegistry, updateProfile]).then(successHandler).catch(errorHandler);
};


//////////////////////////////////////////////
// Cloudinary ////////////////////////////////
//////////////////////////////////////////////

export const getSignature = (handler) => {
    const credentials = {api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, signature: '', timestamp: ''};
    axios.post('/api/getSignature', {}).then((response) => {
        credentials.signature = response.data.signature;
        credentials.timestamp = response.data.timestamp;
        handler(credentials);
    },
    (error) => {
        alert("Cloudinary Signature Error");
        console.log("Cloudinary Signature Error", error);
    });
}

export const uploadImages = (credentials, imageFiles, progressHandler, finishHandler) => {
    if (imageFiles.length > 0) {
      const urls = [];
      const requests = imageFiles.map((image) => {
        if (typeof image.source === 'string') {
          console.log("image already uploaded before");
          urls.push(image.source); // url already exists, so no need to reupload
          return null;
        }
        else {
          const formData = new FormData();
          formData.append("api_key", credentials.api_key);
          formData.append("signature", credentials.signature);
          formData.append("timestamp", credentials.timestamp);
          formData.append("file", image.file);
          return axios.post(`http://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData, {
            headers:{'content-type':'multipart/form-data'},
            onUploadProgress: (progressEvent) => {
              const progressValue = Math.round(progressEvent.loaded / progressEvent.total * 100 / imageFiles.length);
              progressHandler(progressValue);
            }
          });
        }
      }).filter((v) => v!== null);
      axios.all(requests).then((responses) => {
        urls.push(...responses.map((r) => r.data.url));
        finishHandler(urls);
      }).catch(errors => {
        alert("Images Error");
        console.log("Cloudinary Images Error: ", errors);
      });
    }
    else {
      progressHandler(100);
      finishHandler(null);
    }
}

export const uploadVideo = (credentials, videoFile, progressHandler, finishHandler) => {
    if (videoFile) {
      if (typeof videoFile.source === 'string') {
        // url already exists, so no need to reupload
        console.log("video already uploaded before");
        progressHandler(100);
        finishHandler(videoFile.source);
      }
      else {
        console.log('Uploading Video');
        const formData = new FormData();
        formData.append("api_key", credentials.api_key);
        formData.append("signature", credentials.signature);
        formData.append("timestamp", credentials.timestamp);
        formData.append("file", videoFile.file);
        axios.post(`http://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/video/upload`, formData, {
          headers:{'content-type':'multipart/form-data'},
          onUploadProgress: (progressEvent) => {
              const progressValue = Math.round(progressEvent.loaded / progressEvent.total * 100);
              progressHandler(progressValue);
            }
          }).then((response) => {
            const url = response.data.url;
            progressHandler(100);
            finishHandler(url);
        },
        (error) => {
            alert("Error");
            console.log("Cloudinary Video Error: ", error);
        });
      }
    }
    else {
      progressHandler(100);
      finishHandler(null);
    }
}