import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, sum } from 'firebase/firestore';
import { database, auth } from "../firebase/firebaseSetup";
import Colors from '../styles/Colors';
import * as Animatable from 'react-native-animatable';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CategoryForHome = ({ selectedMonth }) => {
  const userUid = auth.currentUser.uid;
  const [budgetLimit, setBudgetLimit] = useState(0);

  // Get budgetLimit
  useEffect(() => {
    const budgetsQuery = query(
      collection(database, 'Budgets'),
      where('user', '==', userUid)
    );

    const unsubscribeBudgets = onSnapshot(budgetsQuery, (budgetSnapshot) => {
      if (!budgetSnapshot.empty) {
        const latestBudget = budgetSnapshot.docs[budgetSnapshot.docs.length - 1].data();
        setBudgetLimit(latestBudget.limit || 0);
      } else {
        setBudgetLimit(0);
      }
    });

    return () => {
      unsubscribeBudgets();
    };
  }, [userUid]);

  // Assuming we only want the current month, format it to 'YYYY-MM' string
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Define your categories here
  const categories = [
    { name: 'Category 1' },
    { name: 'Category 2' },
    { name: 'Category 3' },
    { name: 'Category 4' },
    { name: 'Category 5' },
    { name: 'Category 6' },
    { name: 'Category 7' },
    { name: 'Category 8' },
    // Add more categories as needed
  ];

  const firstRowCategories = categories.slice(0, 4);
  const secondRowCategories = categories.slice(4);

  return (
    <Animatable.View
      style={styles.container}
      animation="flipInX"
    >
      <View style={styles.rowContainer}>
        {firstRowCategories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View style={styles.circle}></View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.rowContainer}>
        {secondRowCategories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View style={styles.circle}></View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        ))}
      </View>
    </Animatable.View>
  );
};

export default CategoryForHome;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '90%',
    height: windowHeight * 0.23,
    backgroundColor: Colors.summaryBackground,
    borderRadius: 18,
    padding: 15,
    justifyContent: 'center',
    shadowColor: 'gray',
    shadowOffset: { width: 5, height: 5 }, // Shadow offset
    shadowOpacity: 0.8, // Shadow opacity
    shadowRadius: 8, // Shadow radius
    elevation: 10, // Android shadow elevation
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  categoryContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    marginBottom: 5,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  budgetRemainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  budgetRemainingText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  negativeRemaining: {
    color: Colors.darkRed,
  },
});
