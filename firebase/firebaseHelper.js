import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { database } from "./firebaseSetup";

// support searching products by name
export async function searchFromDB(keyword) {
  try {
    // create a reference to products collection
    const productsRef = collection(database, "products");

    // perform a query of full-text match (use Typesense for more usable search functionality)
    const q = query(productsRef, where("name", "==", keyword));
    const querySnapshot = await getDocs(q);
    const productData = [];
    querySnapshot.forEach((doc) => {
      productData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return productData;
  } catch (error) {
    console.log(error)
  }
}

// get all prices given a product id
export async function getPricesFromDB(productId) {
  try {
    // create a reference to prices subcollection
    const pricesRef = collection(database, `products/${productId}/prices`);

    // query prices and order from newest to oldest
    const q = query(pricesRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const priceData = [];
    querySnapshot.forEach((doc) => {
      priceData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return priceData;
  } catch (error) {
    console.log(error)
  }
}

export const writeToUsersDB = async (userData) => {
  try {
    const { email, uid } = userData;
    await setDoc(doc(database, "users", uid), { email: email, uid: uid });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export async function updateToUsersDB(entryId, updateEntry) {
  try {
    const entryRef = doc(database, "users", entryId);
    await setDoc(entryRef, updateEntry, { merge: true });
    console.log("Updated To Users DB Successfully");
  } catch (err) {
    console.log("error in updateToUsersDB: ", err);
  }
}

export async function searchCategoriesFromDB(category) {
  try {
    const productsRef = collection(database, "products");
    const q = query(productsRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const productData = [];
    querySnapshot.forEach((doc) => {
      productData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return productData;
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}

export async function addToShoppingList(userId, productData) {
  try {
    // Get a reference to the shoppinglist
    const listRef = collection(database, `users/${userId}/shopping_list`);
    const itemRef = doc(listRef, productData.productId)
    const itemDoc = await getDoc(itemRef);

    // Check if the item exists in the shopping list
    if (itemDoc.exists()) {
      if (itemDoc.data().store_name === productData.store_name) {
        // update its quantity
        await updateDoc(itemRef, { quantity: increment(1) });
      } else {
        // update its store_name
        await updateDoc(itemRef, { store_name: productData.store_name });
      }
      
    } else {
      // create a new doc and set quantity to 1
      await setDoc(doc(database, `users/${userId}/shopping_list/${productData.productId}`), 
        { ...productData, quantity: 1 });
    }
  } catch (error) {
    console.log(error);
  }
};

export async function addToContributionList(userId, updatedPrice) {
  try {
    await addDoc(collection(database, `users/${userId}/contribution_list`), updatedPrice)
  } catch (error) {
    console.log(error);
  }
}