# Search Predictive Text

Ever wanted to search a record by two fields but only return the most relevant field value? This is the use case for Apex’s Levenshtein method. (You could always just return both fields to display in the dropdown, but what is the fun in that? ;) ).

![screen-gif](https://cdn-images-1.medium.com/max/1200/1*0LNSlMdE5WExxXpZpsCnkg.gif)

Full credit for the drop down component to: https://github.com/choudharymanish8585/AutoComplete-Lightning-Component. I have updated the component to a LWC.

## Use Case

A user would like to type a search term and have predictive options drop down based on what is being typed. The user would like to be able to search via fields interchangeably. For this use case it will be searching for Product records by either Product Name or Product Code fields. The predictive options should be a single value per record with the highest similarity to the search term.

This means for each record returned from search deciding between displaying Product Name or Product Code.

## Implementation Overview

The fun happens in the Apex Controller and javascript file of the LWC. The User types in the search bar which sends the search term to a SOSL query in the Apex Controller. The SOSL query searches byboth Product Code and Product Name fields. As we don’t force the User to choose in the search bar which field they are searching by the SOSL query doesn’t know to return the Product Code or Product Name value, it just returns the record with both fields. This is where the LevenshtienDistance method comes into play.
Levenshtein Distance is an algorithm used to score the similarity between two text strings. From our SOSL result we have two text strings, Product Code and Product Name, that we need to compare against the search term. The LevenshteinDistance Apex method produces this score enabling us to drop the lower scored Field from our search results.

Finally, we need to make sure that we don’t return both a Product Code and Product Name of the same Product, even if both score high. This is implemented in the searchPrectiveText.js file.

## searchPrectiveTextController.apxc

```soslSearchResult sr = new soslSearchResult();                    sr.SearchResultString = pd2.Name;
sr.Score = (Double)pd2.Name.getLevenshteinDistance(searchKeyword) / (Double)pd2.Name.length();                    sr.alternativeSearchResultString = pd2.ProductCode;                    searchResultsList.add(sr);                    
soslSearchResult sr2 = new soslSearchResult();                    sr2.SearchResultString = pd2.ProductCode;                    sr2.Score  = (Double)pd2.ProductCode.getLevenshteinDistance(searchKeyword) / (Double)pd2.ProductCode.length();                    sr2.alternativeSearchResultString = pd2.Name;                    searchResultsList.add(sr2);
```

## searchPrectiveText.js

```
getProducts({searchKeyword: this.searchString, maxRecords: 10})                .then((result) => {
const results = [];                    
result.forEach(element => {                        
const result = {queryString : element["SearchResultString"], value : element["Score"], alternate : element["alternativeSearchResultString"]};                        results.push(result);                    
});                    
const sortedresults = results.sort((a,b) => a.value - b.value);                 const slicedresults = sortedresults.slice(0,10);                 const filteredresults = [];                 
for(let i = slicedresults.length-1; i > -1; i--){                        var addResult = true;                        
for(let j = i-1; j > -1; j--) {                            if(slicedresults[i]["queryString"] == slicedresults[j]["alternate"]) {                                
addResult = false;                            }                        }                     
if(addResult) {                        filteredresults.push(slicedresults[i]);                    }             }
```
