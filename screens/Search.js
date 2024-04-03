import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import LoadingScreen from "./LoadingScreen"
import { searchFromDB } from "../firebase/firebaseHelper";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [queryResult, setQueryResult] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryResult.length === 0) {
      setShowResult(false)
    } else {
      setShowResult(true)
    }
  }, [queryResult])

  const handleSearch = async (searchText) => {
    setSearchText(searchText)
    setSubmitted(true)
    setLoading(true)

    try {
      const productData = await searchFromDB(searchText)
      setQueryResult(productData)
    } catch (error) {
      console.error("Error fetching search results:", error);
      setQueryResult([]); // reset query result
    } finally {
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar handleSearch={handleSearch} setSubmitted={setSubmitted} autoFocus={true}/>
        {submitted && !loading && !showResult && <Text>No results</Text>}
      </View>
      {submitted && loading && <LoadingScreen />}
      {submitted && !loading && showResult && <SearchResult searchText={searchText} data={queryResult}/>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 10,
  },
  searchBar: {
    width: '90%',
    alignSelf: 'center'
  },
});
