@IsTest
private class searchPrectiveTextControllerTest {
    @isTest 
    Static void testGetProducts() {
        String searchKeyword = 'Diesel';
        Integer maxRecords = 10;
        Test.startTest();
        List<searchPrectiveTextController.soslsearchResult> rt = searchPrectiveTextController.getProducts(searchKeyword, maxRecords);
        Test.stopTest();
    }    
}