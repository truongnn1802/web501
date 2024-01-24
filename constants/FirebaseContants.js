// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getDatabase,
  ref,
  query,
  equalTo,
  get,
  set,
  child,
  startAt,
  endAt,
  push,
  orderByChild,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import {
  getStorage,
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxV25WuX_zgokwY_9vhEK0WIygzZNGQWg",
  authDomain: "asm-web501-b40ed.firebaseapp.com",
  databaseURL:
    "https://asm-web501-b40ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "asm-web501-b40ed",
  storageBucket: "asm-web501-b40ed.appspot.com",
  messagingSenderId: "124014296310",
  appId: "1:124014296310:web:cad70b72245dc415eb80d7",
  measurementId: "G-TNH8XNTD96",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const db = getDatabase(app);

export const postData =async (collectionName, data, fn = () => {}) => {
  const dataRef = ref(db, collectionName);
  try{
    const newRecordRef =await push(dataRef, data)
    fn()
    return newRecordRef.key
  }catch{
    console.log(err);
  }
};

export const uppdateData = (collectionName, data, fn = () => {}) => {
  const dataRef = ref(db, collectionName);
  set(dataRef, data).then(() => fn("Thêm thành công"));
};

export const getData = (collectionName, fn = () => {}) => {
  const dataRef = ref(db, collectionName);
  const getAllData = get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        fn();
        return snapshot.val();
      } else {
        console.log("No matching data found.");
      }
    })
    .catch((error) => {
      console.error("Error getting data:", error);
    });
  return getAllData;
};

export const filterData = async (
  collectionName,
  fieldName,
  valueName,
  fn = () => {}
) => {
  const dataRef = ref(db, collectionName);
  // Tạo truy vấn với hàm equalTo
  const filteredQuery = query(
    dataRef,
    orderByChild(fieldName),
    equalTo(valueName)
  );
  // Thực hiện truy vấn và lấy dữ liệu
  return get(filteredQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        fn();
        return snapshot.val();
      } else {
        console.log("No matching data found.");
        return;
      }
    })
    .catch((error) => {
      console.error("Error getting data:", error);
    });
};

export const sortData = (collectionName, fieldName, s, e) => {
  const dataRef = ref(db, collectionName);
  const filteredQuery =
    Number(s) > 0
      ? query(query(dataRef, orderByChild(fieldName), startAt(s)), endAt(e))
      : query(dataRef, orderByChild(fieldName));
  return get(filteredQuery)
    .then((snapshot) => {
      const arr = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        arr.push(data);
      });
      return arr.length ? arr : null;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

export const removeData = (collectionName, id, fn = () => {}) => {
  const dataRef = ref(db, collectionName + "/" + id);
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No matching data found.");
      }
    })
    .catch((error) => {
      console.error("Error getting data:", error);
    });
  return remove(dataRef)
    .then(() => {
      fn("Xóa thành công");
    })
    .catch((err) => console.log(err));
};

export const saveFileStorage = (file) => {
  const fileName = generateRandomFileName();
  const filePath = `files/${fileName}`;
  const fileRef = refStorage(storage, filePath);
  // Đường dẫn lưu trữ tệp trên Firebase Storage
  return uploadBytes(fileRef, file)
    .then(() => {
      return getDownloadURL(fileRef);
    })
    .then((downloadURL) => {
      return downloadURL;
    })
    .catch((error) => {
      console.error("Lỗi khi tải lên và lấy đường dẫn:", error);
    });
};

// Hàm tạo tên ngẫu nhiên cho tệp
function generateRandomFileName() {
  const randomChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let fileName = "";
  for (let i = 0; i < 10; i++) {
    fileName += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return fileName;
}
