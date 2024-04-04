import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { database, auth } from "./firebaseSetup";

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

export async function addToShoppingList(userId, productId, name, image_url) {
  try {
    // Get a reference to the shoppinglist
    const listRef = collection(database, `users/${userId}/shopping_list`);
    const itemRef = doc(listRef, productId)
    const itemDoc = await getDoc(itemRef);

    // Check if the item exists in the shopping list
    if (itemDoc.exists()) {
      // update its quantity
      await updateDoc(itemRef, { name: name, image_url: image_url, quantity: increment(1) });
    } else {
      // create a new doc and set quantity to 1
      await setDoc(doc(database, `users/${userId}/shopping_list/${productId}`), 
        { name: name, image_url: image_url, quantity: 1 });
    }
  } catch (error) {
    console.log(error)
  }
};

export const updatePriceInDatabase = async (updatedPrice) => {
  try {
    const q = query(
      collection(database, "prices"),
      where("product_id", "==", updatedPrice.product_id) &&
        where("store_name", "==", updatedPrice.store_name)
    );
    const querySnapshot = await getDocs(q);
    let priceId;
    querySnapshot.forEach((doc) => {
      priceId = doc.id;
    });
    console.log("NewpriceId:", priceId);
    if (!priceId) {
      console.error("No matching price documents found in the subset");
      throw new Error("No matching price documents found in the subset");
    }
    await updateDoc(doc(collection(database, "prices"), priceId), updatedPrice);
    console.log("Price updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating price:", error);
  }
};
