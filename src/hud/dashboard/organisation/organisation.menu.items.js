export const ORGANISATION_MENU_ITEMS = {

  port: [
		{name: 'Invites',             option: {isSelected: false, route: 'invitations'}, icon: 'invitations'},
    {name: 'Members',             option: {isSelected: false, route: 'members'}, icon: 'members'},
    {name: 'Skills',              option: {isSelected: false, route: 'skills'}, icon: 'skills'},
    {name: 'Services',            option: {isSelected: false, route: 'services'}, icon: 'services'},
    {name: 'Sites',               option: {isSelected: false, route: 'sites'}, icon: 'sites'}
  ],

  starboard: [
    {name: 'Interaction Log',     option: {isSelected: false, route: 'interactionlog', isInteractionLog: true}, icon: 'interactionlog'},
    {name: 'Interaction Manager', option: {isSelected: false, route: 'interactionmanager'}, icon: 'interactionmanager'},
    {name: 'Numbers',             option: {isSelected: false, route: 'numbers'}, icon: 'numbers'},
		{name: 'Teams',               option: {isSelected: false, route: 'teams'}, icon: 'teams', disabled: true},
    {name: 'Kiosks',              option: {isSelected: false, route: 'kiosks'}, icon: 'kiosks'}
//    {name: 'Account',             option: {isSelected: false, route: 'account'}, icon: ''}
  ]
};
