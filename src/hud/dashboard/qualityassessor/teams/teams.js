/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
 */
import {TEAMS_ACTIONS} from './teams.actions';
import {UserSession, SortTools} from 'zailab.common';
import {TeamsService} from './teams.service';
import {TeamsStore} from './teams.store';
/*
 */
const logger = LogManager.getLogger('Teams');
/*
 */
@inject(Router, TeamsService, TeamsStore, UserSession)
export class Teams {

  resolve;
  _pagesize = 10;
  currentPage;
  pages;
  hasSearched;
  searchText;
  allItems;
  showSearch;

  constructor(router, teamsService, teamsStore, userSession){

    this.router = router;
    this.userSession = userSession;
    this.teamsService = teamsService;
    this.teamsStore = teamsStore;
  }

  activate(){
    this.teamsService.retrieveServices();
  }

  toggleServices() {

    this.teamsService.toggleServices();
  }


  changeService() {
    this.teamsService.changeService();
  }

  acceptServiceChange(service){
		
		for(let serv of this.teamsStore.services){	
			serv.isSelected = false;		
		}
		
		service.isSelected = true;
				
    let serviceId = service.serviceId;
    this.teamsService.retrieveMembers(serviceId);
    this.teamsService.toggleServices();
    this.teamsService.selectService(service);
		
  }


  get showManageQualityAssessment(){

    return this.userSession.isQAManagerRole;
  }

  performQualityAssessment(){

    this.router.parent.parent.navigate('interactionlog');
  }

  manageQualityAssessment(){

    this.router.navigate('forms');
  }

  get pagedItems() {

    if (!this.pages) {
      return;
    }

    return this.pages[this.currentPage];
  }

  next() {

    this.currentPage++;
  }

  prev() {

    this.currentPage--;
  }

  get totalItems() {

    return this.allItems.length;
  }

  get showNext() {

    if (this.pages)
      return this.currentPage < this.pages.length - 1;
  }

  get showPrev() {

    return this.currentPage > 0;
  }

  initPages() {

    this.currentPage = 0;
    this.pages = [];

    if (!this.allItems) {
      this.pages.push([]);
      return;
    }

    let pageItems = null;

    for (let itemIndex = 0; itemIndex < this.allItems.length; itemIndex++) {
      if (itemIndex % this._pagesize === 0) {

        if (pageItems !== null) {
          this.pages.push(pageItems);
        }
        pageItems = [];
      }

      pageItems.push(this.allItems[itemIndex]);
    }

    if (pageItems !== null && pageItems.length > 0) {
      this.pages.push(pageItems);
    }
  }

  search() {

    if (!this.allItems || this.allItems.length === 0) {

      return;
    }

    if (!this.searchText || this.searchText.length === 0) {

      this.initPages();
      return;
    }

    let items = [];
    let startList = [];
    this.pages = [];

    for (let item of this.allItems) {

      if (this.startsWith(item, this.searchText)) {
        
        startList.push(item);
        item.added = true;
      } else {

        item.added = false;
      }
    }

    this.items = startList;

    let pageItems = null;

    for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {

      if (itemIndex % this._pagesize === 0) {

        if (pageItems !== null) {
          this.pages.push(pageItems);
        }
        pageItems = [];
      }

      pageItems.push(this.items[itemIndex]);
    }

    if (pageItems !== null && pageItems.length > 0) {
      this.pages.push(pageItems);
    }

    this.addPlaceholders();
    this.currentPage = 0;
    
  }

  startsWith(item, searchText) {

    let found = false;

    if (item['firstName'] && item['firstName'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    }else if(item['surname'] && item['surname'].toLowerCase().startsWith(searchText.toLowerCase())){
      found = true;
    }
    else if(item['fullName'] && item['fullName'].toLowerCase().startsWith(searchText.toLowerCase())){
      found = true;
    }

    return found;
  }

  setFocus(field) {

    let firstElement = document.getElementById(field);
    if (firstElement !== null) {
      firstElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus(field);
      }, 100);
    }
  }

  toggleSearch(){

    this.showSearch = !this.showSearch;

        setTimeout(() => {

     this.setFocus('searchText');
     }, 500);
  }

  sortList(){
    
    // Sorts list by QA roles first (alphabetical by fullName) and Agent roles last (alphabetical by fullName)
    
    let qaList = [];
    let agentList = [];
    
    for(let member of this.allItems){

      member.fullName = `${member.firstName} ${member.surname}`;;
      
      if(member.roleName === 'Quality Assessor'){
        qaList.push(member);
      }else{
        agentList.push(member);
      }
    }
    
    qaList.sort(SortTools.compareBy('fullName'));
    agentList.sort(SortTools.compareBy('fullName'));
    
    this.allItems = qaList.concat(agentList);
  }

  selectMember(member){
    
    let memberId = member.memberId;
    
    if(!memberId){
      return;
    }
    
    let memberName = `${member.firstName} ${member.surname}`;
    this.router.navigate(`forms/view/${memberId}?memberName=${memberName}`);
  }

  @handle(TEAMS_ACTIONS.RETRIEVE_MEMBERS)
  @waitFor(TeamsStore)
  handleRetrieveMembers(action, members) {
    this.allItems = members;
    this.sortList();
    this.initPages();
		this.addPlaceholders();
  }

	addPlaceholders(){
    
    for(let page in this.pages){

      let remainingSpaces = this._pagesize - this.pages[page].length;

      for(let i of remainingSpaces){
        this.pages[page].push({isPlaceholder: true});
      }
    }
  }

}
