export const PROMPT_SETTINGS = {

  SELECT_ONE_ONLY: {

    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: true, multi: {enabled: false}},
    edit: {enabled: false}
  },

  SELECT_MULTI_ONLY: {

    add: {enabled: false},
    delete: {enabled: false},
    select: {multi: {enabled: true}},
    edit: {enabled: false}
  },

  SELECT_MULTI: {

    add: {enabled: true},
    delete: {enabled: false},
    select: {multi: {enabled: true}},
    edit: {enabled: false}
  },

  AUTO_SELECT_MULTI: {

    add: {enabled: true},
    delete: {enabled: false},
    select: {multi: {enabled: true}, auto: true},
    edit: {enabled: false}
  },

  EDIT_DELETE: {

    add: {enabled: false},
    delete: {enabled: true},
    select: {enabled: false},
    edit: {enabled: true}
  },

  PICTURE: {

    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit: {enabled: true}
  },

  MESSAGE: {

    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit: {enabled: false}
  },

  CALL: {

    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit: {enabled: false},
    header: {disabled: true}
  }
};
