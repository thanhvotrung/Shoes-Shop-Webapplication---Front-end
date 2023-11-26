import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, deleteObject } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCKz0ryt8nXymkbHt6e6WrVgSdpTZfRwsE",
    authDomain: "shoesimagesapi.firebaseapp.com",
    projectId: "shoesimagesapi",
    storageBucket: "shoesimagesapi.appspot.com",
    messagingSenderId: "69206562140",
    appId: "1:69206562140:web:ecb90b204f64d3e2435d99",
    measurementId: "G-CT80K3QQPQ"
};
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);
class FirebaseConfig {
    DeleteImage = (imgUrl) => {
        // Create a reference to the file to delete
        function getFileNameFromURL(url) {
            const partsWithoutQuery = url.split('?')[0];
            const parts = partsWithoutQuery.split('/');
            const fileName = parts[parts.length - 1];
            return fileName;
        }
        const desertRef = ref(storage, getFileNameFromURL(imgUrl));

        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log("Image deleted successfully");
        }).catch((error) => {
            console.error("Error deleting image:", error);
        });
    };
}

export default  new FirebaseConfig;