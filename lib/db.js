import firebase from './firebase';
import axios from 'axios';

export const registerNewUser = async (authUser) => {
  /*
  email: "fongyoong8@gmail.com"
  name: "Fong Chien Yoong"
  photoUrl: "https://lh3.googleusercontent.com/a-/AOh14GiZceMQw4o2k6UQpelNEeA-jxVA97pVRVY3BilkLw=s96-c"
  uid: "HPIK9SvZWMgqGF17sS1CHoTGxb73"
  token: null
  */
  firebase.database().ref('users/' + authUser.uid).set({
    username: authUser.name,
    email: authUser.email,
    profile_picture : authUser.photoUrl
  });
};

export const getUserProfile = async (auth, handler) => {
  firebase.database().ref('/users/' + auth.uid).once('value').then((snapshot) => {
    handler(snapshot.val());
  });
};

//////////////
// Cloudinary
//////////////

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
      /*
      for (let i in imageFiles) {
          const formData = new FormData();
          formData.append("api_key", credentials.api_key);
          formData.append("signature", credentials.signature);
          formData.append("timestamp", credentials.timestamp);
          formData.append("file", imageFiles[i]);
          axios.post(`http://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData, { headers: { 'content-type': 'multipart/form-data' } }
          ).then((response) => {
              console.log('Image ' + i, response);
              urls.push(response);
              if(i === imageFiles.length - 1) {
                finishHandler(urls);
              }
              else {
                progressHandler(i);
              }
          },
          (error) => {
              alert("Error");
              console.log("Cloudinary Image Error", error);
          });
      }
      */
      const requests = imageFiles.map((image) => {
        const formData = new FormData();
        formData.append("api_key", credentials.api_key);
        formData.append("signature", credentials.signature);
        formData.append("timestamp", credentials.timestamp);
        formData.append("file", image);
        return axios.post(`http://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData, {headers:{'content-type':'multipart/form-data'}});
      });
      axios.all(requests).then((responses) => {
        //const responseOne = responses[0];
        const urls = responses.map((r) => r.data.url);
        finishHandler(urls);
      }).catch(errors => {
        alert("Images Error");
        console.log("Cloudinary Images Error: ", errors);
      });
    }
    else {
      finishHandler([]);
    }
}
export const uploadVideo = (credentials, videoFile, finishHandler) => {
    if (videoFile) {
      console.log('Uploading Video');
      const formData = new FormData();
      formData.append("api_key", credentials.api_key);
      formData.append("signature", credentials.signature);
      formData.append("timestamp", credentials.timestamp);
      formData.append("file", videoFile);
      axios.post(`http://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/video/upload`, formData, {headers:{'content-type':'multipart/form-data'}}
      ).then((response) => {
          console.log('Video', response);
          const url = response.data.url;
          finishHandler(url);
      },
      (error) => {
          alert("Error");
          console.log("Cloudinary Video Error: ", error);
      });
    }
    else {
      finishHandler(null);
    }
}

/*
    .collection('users')
    .doc(authUser.uid)
    .set({ ...authUser }, { merge: true });
*/

/*
auth has the shape

email: "fongyoong8@gmail.com"
name: "Fong Chien Yoong"
photoUrl: "https://lh3.googleusercontent.com/a-/AOh14GiZceMQw4o2k6UQpelNEeA-jxVA97pVRVY3BilkLw=s96-c"
token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUzNmRhZWFiZjhkZDY1ZDRkZTIxZTgyNGI4OTlhMWYzZGEyZjg5NTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiRm9uZyBDaGllbiBZb29uZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaVpjZU1RdzRvMms2VVFwZWxORWVBLWp4VkE5N3BWUlZZM0JpbGtMdz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9jbG91ZC1yZXNlcnZhdGlvbi1kYjdiMyIsImF1ZCI6ImNsb3VkLXJlc2VydmF0aW9uLWRiN2IzIiwiYXV0aF90aW1lIjoxNjIxMjc3MzYyLCJ1c2VyX2lkIjoiRGZ4TThTWG1OdFhSdHcwRXFlUzBVQ1RpT1J3MSIsInN1YiI6IkRmeE04U1htTnRYUnR3MEVxZVMwVUNUaU9SdzEiLCJpYXQiOjE2MjEzMDc2NzcsImV4cCI6MTYyMTMxMTI3NywiZW1haWwiOiJmb25neW9vbmc4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTAwMTMyOTU2MTU0NDQwNjgzODU4Il0sImVtYWlsIjpbImZvbmd5b29uZzhAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.DRsQNsa50na-ew0DB_odOTp7NGgjZ215NUcoqCILpEomTUqGEdVLd3LCGGY5s-Cg-a37HFW40LXFTxneU9prsvZUMOYW8atzD5h_DfMiOcYCPiv-NQAAvgj2-g8KWCcfxktEbfzKF4383WaK1ZRrP-rhxN7S3aHRc_vbROkOSa9LF22yUdwT9HFZ51enGCTMeIbdg7-vVHXsfwXG5rMgz_bxlqqCdPMnKfcMliPMqGBFmPy5ztJ0oNX2AxlRsCdi0WXuzefnYEuGGlVld0_bd9IV1sU0tLxMNniMJeHrtchH64S8AO_hanfyhKG9r8kXBWMQXg9qLmFaLJwT2MTG5w"
uid: "DfxM8SXmNtXRtw0EqeS0UCTiORw1"
*/