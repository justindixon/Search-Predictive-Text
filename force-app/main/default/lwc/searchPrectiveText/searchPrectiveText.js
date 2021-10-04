import { LightningElement } from 'lwc';
import getProducts from '@salesforce/apex/searchPrectiveTextController.getProducts';

export default class SearchPrectiveText extends LightningElement {
    records;
    error;
    searchString;
    selectedOption;
    inputTimer;
    openDropDownClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    changeDropDownClass(openDropDown) {
        this.openDropDownClass =  openDropDown ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    }
    // Typing Search Handler
    searchHandler(event) {
        try{
        if (event.target.value.length >= 3) {
            //Ensure that not many function execution happens if user keeps typing
            if (this.inputTimer) {
                clearTimeout(this.inputTimer);
            }
            this.searchString = event.target.value;
            this.inputTimer = setTimeout(() => {
                getProducts({searchKeyword: this.searchString, maxRecords: 10})
                .then((result) => {
                    const results = [];
                    result.forEach(element => {
                        const result = {queryString : element["SearchResultString"], value : element["Score"], alternate : element["alternativeSearchResultString"]};
                        results.push(result);
                    });
                    const sortedresults = results.sort((a,b) => a.value - b.value);
            	    const slicedresults = sortedresults.slice(0,10);
            	    const filteredresults = [];
            	    for(let i = slicedresults.length-1; i > -1; i--){
                        var addResult = true;
                        for(let j = i-1; j > -1; j--) {
                            if(slicedresults[i]["queryString"] == slicedresults[j]["alternate"]) {
                                addResult = false;
                            }
                        }

                    if(addResult) {
                        filteredresults.push(slicedresults[i]);
                    }
            	}
            	this.records = filteredresults;
                this.changeDropDownClass(true);
                this.error = undefined;

            })
            .catch((error) => {
                this.error = error;
                this.records = [];
            });
                }, 1000);
        } else {
            if (this.inputTimer) {
                clearTimeout(this.inputTimer);
            }
            this.records = [];
            this.changeDropDownClass(false);
        }
    } catch(e) {console.error(e);}
    }
    // Open the Search Dropdown if there are results available       
    searchFocusHandler(event) {
        try{ 
        if(this.records != null && this.records.length > 0) {
            this.changeDropDownClass(true);    
        }} catch(e) {console.error(e);}    
    }
    // When clicking off the search bar this closes the dropdown. Sets to be async to give the selector function
    // Enough time to select the choice by the User
    searchBlurHandler(event) {
        try{setTimeout(function(){ changeDropDownClass(false);}, 100); } catch(e) {console.error(e);}
    }
    // Used for when a user clicks a search option 
    optionClickHandler(event) {
        this.selectedOption = event.target.closest('li').dataset.id;
        this.searchString = event.target.closest('li').dataset.value;
        this.changeDropDownClass(false);
    }
    
}