import React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase/firebaseSetup";
import { onAuthStateChanged } from "firebase/auth";

import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Search from "./screens/Search";
import Home from "./screens/Home";
import ShoppingList from "./screens/ShoppingList";
import Profile from "./screens/Profile";
import Feedback from "./screens/Feedback";
import EditProfile from "./screens/EditProfile";
import WatchList from "./screens/WatchList";
import Map from "./screens/Map";
import MyContributions from "./screens/MyContributions";
import Notification from "./screens/Notification";
import ProductDetail from "./screens/ProductDetail";
import SearchHeader from "./components/SearchHeader";
import PressableButton from "./components/PressableButton";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "./styles/Colors";
import * as Notifications from "expo-notifications";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { PaperProvider } from 'react-native-paper';
import { ShoppingListProvider } from "./utils/ShoppingListContext";
import Toast from 'react-native-toast-message';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch';

const searchClient = algoliasearch("6TSZQ8JRSK", "20a8e1b328ca1d34db9af5d50c7eb07d");

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async function (notification) {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    };
  },
});

// Auth Screens
const AuthStack = (
  <>
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{ title: "Sign Up" }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ title: "Log In" }}
    />
  </>
);

// Tab Screens
function TabNavigator() {
  const options = {
    headerStyle: {
      backgroundColor: Colors.header,
    },
    headerTintColor: Colors.headerText,
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 20,
    },
    tabBarActiveTintColor: Colors.iconFocused,
    tabBarInactiveTintColor: Colors.headerText,
    tabBarLabelStyle: {
      fontSize: 11,
    },
    tabBarStyle: { backgroundColor: Colors.header, borderTopWidth: 0}, // remove default gap    
  }
  const homeOptions = {
    header: () => (
      <SearchHeader />
    ),
    tabBarIcon: ({ focused }) => (
      <FontAwesome5 name="home" size={24} color={focused ? Colors.iconFocused : Colors.headerText}/>
    ),
  }
  const listOptions = () => ({
    tabBarIcon: ({ focused }) => (
      <FontAwesome5 name="list" size={24} color={focused ? Colors.iconFocused : Colors.headerText}/>
    ),
  })

  const profileOptions = () => ({
    tabBarIcon: ({ focused }) => (
      <FontAwesome5 name="user" size={24} color={focused ? Colors.iconFocused : Colors.headerText}/>
    ),
    headerRight: () => (
      <PressableButton
        customStyle={{margin: 5}}
        pressedFunction={() => auth.signOut()}
      >
        <FontAwesome5 name="sign-out-alt" size={24} color={Colors.headerText}/>
      </PressableButton>
    ),
    headerStyle: {
      backgroundColor: Colors.header,
    },
    headerTintColor: Colors.headerText,
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    }
  });

  return (
    <Tab.Navigator screenOptions={options}>
      <Tab.Screen name="Home" component={Home} options={homeOptions}/>
      <Tab.Screen name="Shopping List" component={ShoppingList} options={listOptions}/>
      <Tab.Screen name="Profile" component={Profile} options={profileOptions}/>
    </Tab.Navigator>
  );
}

// App Stack Screens
const AppStack = (
  <>
    <Stack.Screen name="Tabs" component={TabNavigator}/>
    <Stack.Screen name="Shopping List Stack" component={ShoppingList} // for convenience to navigate from product detail
      options={{ 
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitle: 'Shopping List'
      }}
    />
    <Stack.Screen name="Edit Profile" component={EditProfile}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Search"
      component={Search}
      options={{
        headerShown: true,
        animation: 'fade'
      }}
    />
    <Stack.Screen
      name="Product Detail"
      component={ProductDetail}
      options={{
        headerShown: true,
        headerBackTitleVisible: false
      }}
    />
    <Stack.Screen
      name="Feedback"
      component={Feedback}
      options={{
        headerShown: true,
        headerBackTitleVisible: false
      }}
    />
    <Stack.Screen
      name="Watch List"
      component={WatchList}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Map"
      component={Map}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="My Contributions"
      component={MyContributions}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Notification"
      component={Notification}
      options={{
        headerShown: true,
      }}
    />
  </>
);

// Default Header Options
const defaultHeaderOptions = {
  headerShown: false,
  headerStyle: {
    backgroundColor: Colors.header,
  },
  headerTintColor: Colors.headerText,
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 20,
  },
};

// App
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <ShoppingListProvider>
        <PaperProvider>
          <ActionSheetProvider>
            <InstantSearch searchClient={searchClient} indexName="product_name">
              <Stack.Navigator screenOptions={defaultHeaderOptions}>
                {loggedIn ? AppStack : AuthStack}
              </Stack.Navigator>
            </InstantSearch>
          </ActionSheetProvider>
        </PaperProvider>
      </ShoppingListProvider>
      <Toast />
    </NavigationContainer>
  );
}