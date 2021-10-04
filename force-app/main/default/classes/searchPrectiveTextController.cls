public with sharing class searchPrectiveTextController {
    @AuraEnabled(cacheable=true)
    public static List<soslsearchResult> getProducts(String searchKeyword, Integer maxRecords) {
        System.debug(searchKeyword);
        List<soslsearchResult> searchResultsList = new List<soslSearchResult>();
        List<Product2> products = new List<Product2>();
        String queryString = 'FIND \'' + '*'+searchKeyword+'*' + '\' IN ALL Fields RETURNING Product2 (Name, ProductCode) LIMIT ' + maxRecords;
        Search.SearchResults results = search.find(queryString);
        List<Search.SearchResult> productList = results.get('Product2');
        if(productList != null) {
            for(Search.SearchResult searchResult : productList) {
                Product2 pd2 = (Product2)searchResult.getSObject();
                products.add(pd2);
            }
        }
        if(products != null) {
            for(Product2 pd2 : products){
                try{
                    soslSearchResult sr = new soslSearchResult();
                    sr.SearchResultString = pd2.Name;
                    sr.Score = (Double)pd2.Name.getLevenshteinDistance(searchKeyword) / (Double)pd2.Name.length();
                    sr.alternativeSearchResultString = pd2.ProductCode;
                    searchResultsList.add(sr);
                    soslSearchResult sr2 = new soslSearchResult();
                    sr2.SearchResultString = pd2.ProductCode;
                    sr2.Score = (Double)pd2.ProductCode.getLevenshteinDistance(searchKeyword) / (Double)pd2.ProductCode.length();
                    sr2.alternativeSearchResultString = pd2.Name;
                    searchResultsList.add(sr2);
                } catch(DmlException e) {
                    System.debug(e.getMessage());
                }
            }
        }
        return searchResultsList;
    }

    public class soslsearchResult {
        @AuraEnabled
        public String SearchResultString;
        @AuraEnabled
        public String alternativeSearchResultString;
        @AuraEnabled
        public Double Score;
        
    }
}