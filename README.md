# Cloud Reservation System (Next.js React client)

### ⛅ [View the website here.](https://cloud-reservation-nextjs.vercel.app/)

* A mostly-static **[Next.js](https://nextjs.org/)** site which enables users to buy and sell products/services in a democratic manner. The system is primitive in the sense that 'payments' are made at the click of a button lol. Users are also able to chat with one another privately.
* **[*Firebase*](https://firebase.google.com/)** is the backend for authentication and user data.
* **[Cloudinary](https://cloudinary.com/)** is used to store any uploaded images or videos.

***
![Home](https://i.imgur.com/ACSstAG.png)

***

## Development

* `npm run dev` to run the Next.js server in development.
* When deploying to production, make sure the production site domain is **whitelisted** in Firebase. **[Vercel](https://vercel.com)** is currently the most optimal hosting platform for Next.js in my opinion.

* The Firebase rules can be found **[here](https://pastebin.com/dvQnAHkf)**.

***

* `env.local` must be in the **root** directory and should contain the following environment variables:

    <details>
        <summary><b>View</b> list of environment variables</summary>
        <br>
        <ul>
            <li> NEXT_PUBLIC_FIREBASE_API_KEY </li>
            <li> NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN </li>
            <li> NEXT_PUBLIC_FIREBASE_PROJECT_ID </li>
            <li> NEXT_PUBLIC_FIREBASE_DATABASE_URL </li>
            <li> NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET </li>
            <li> NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID </li>
            <li> NEXT_PUBLIC_FIREBASE_APP_ID </li>
            <li> NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID </li>
            <li> FIREBASE_PRIVATE_KEY (Optional) </li>
            <li> FIREBASE_CLIENT_EMAIL (Optional) </li>
            <li> NEXT_PUBLIC_CLOUDINARY_NAME </li>
            <li> NEXT_PUBLIC_CLOUDINARY_API_KEY </li>
            <li> CLOUDINARY_API_SECRET </li>
            <li> CLOUDINARY_ENV_VAR (Optional) </li>
        </ul>
    </details>


* Some of the parameters above are currently optional, but may be required if analytics or Firebase storage are integrated in the future.
* For Next.js, the prepend **NEXT_PUBLIC** refers to public keys.