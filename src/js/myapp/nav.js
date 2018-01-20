
// ----------------------------------------------------------------
// Nav Class

// ----------------------------------------------------------------
// Model

class NavModel extends ClipwebModel {
  constructor (
    initSetting = {
      NAME: 'Nav Object',
    }
  ) {
    super(initSetting);

    this.SELECTOR = {};

    this.SELECTOR.AREA = {};
    this.SELECTOR.AREA.NAV = '#navbar';
    this.SELECTOR.AREA.USER = 'user-area';
    this.SELECTOR.AREA.LIST = 'list-area';

    this.SELECTOR.NAV = {};
    this.SELECTOR.NAV.BAR = '.navbar-nav';
    this.SELECTOR.NAV.LOGIN = 'nav-login';
    this.SELECTOR.NAV.REGISTER = 'nav-register';
    this.SELECTOR.NAV.SETTING = 'nav-setting';
    this.SELECTOR.NAV.LOGOUT = 'nav-logout';
    this.SELECTOR.NAV.LIST = 'nav-list';
    this.SELECTOR.NAV.HELP = 'nav-help';

    this.SELECTOR.NAV.SEARCH = {};
    this.SELECTOR.NAV.SEARCH.TEXT = 'nav-seacrh-text';
    this.SELECTOR.NAV.SEARCH.BUTTON = 'nav-seacrh-button';

    this.SELECTOR.HEADER = {};
    this.SELECTOR.HEADER.CLEAR = '#header-clear';

  }
}

// ----------------------------------------------------------------
// View

class NavView extends ClipwebView {
  constructor (
    initSetting = {
      NAME: 'Nav View'
    }
  ) {
    super(initSetting);
  }

  clearNavItem () {
    $(this.MODEL.SELECTOR.AREA.NAV).empty();
    $(this.MODEL.SELECTOR.AREA.NAV).append('<ul class="navbar-nav col-md-8"></ul>');
  }

  addNavItem ({
    id = null,
    name = null,
    type = 'append',
    fa = null
  } = {}) {
    if (id == null || name == null) {
      Log.error(arguments)();
      return;
    }

    if ($(`${this.MODEL.SELECTOR.NAV.BAR} #${id}`).length > 0) {
      this.removeNavItem({
        id: this.MODEL.SELECTOR.NAV.LOGIN
      });
    }

    let _icon = '';
    if (fa != null) {
      _icon = ` <i class="${fa}"></i>`;
    }

    const _element = `<li class="nav-item"><a class="nav-link"id="${id}">${name}${_icon}</a></li>`;

    if (type == 'prepend') {
      $(this.MODEL.SELECTOR.NAV.BAR).prepend(_element);
    } else {
      $(this.MODEL.SELECTOR.NAV.BAR).append(_element);
    }
  }

  removeNavItem ({
    id = null
  } = {}) {
    if (id == null) {
      Log.error(arguments)();
      return;
    }

    $(`${this.MODEL.SELECTOR.NAV.BAR} #${id}`).each((_index, _element) => {
      $(_element).parent().remove();
    });
  }

  addNavSearch () {
    $(this.MODEL.SELECTOR.AREA.NAV).append(`<div class="col-md-4 nav-seacrh"><div class="input-group"><input class="form-control" id="${this.MODEL.SELECTOR.NAV.SEARCH.TEXT}" placeholder="${LN.get('search')}"><span class="input-group-append"><button class="btn btn-outline-info" id="${this.MODEL.SELECTOR.NAV.SEARCH.BUTTON}"><i class="fas fa-search"></i></button></span></div></div>`);
  }

  updateArea ({
    object = null,
    selector = null,
    parent = this.MODEL.COMMON.MAIN
  } = {}) {
    if (object == null || selector == null || parent == null) {
      Log.error(arguments)();
      return;
    }
    const _HTML = $(`#${selector}`)[0]['innerHTML'];
    object.VIEW.remove();
    $(parent).prepend(Content.getContent(selector));
    object.VIEW.hide({ speed: 0 });
    object.VIEW.append({ element: _HTML });
    object.VIEW.show({ scroll: true });
  }

  generateNotLogin () {
    this.clearNavItem();

    this.addNavItem({
      id: this.MODEL.SELECTOR.NAV.LOGIN,
      name: LN.get('login')
    });
    this.addNavItem({
      id: this.MODEL.SELECTOR.NAV.REGISTER,
      name: LN.get('register')
    });
    this.addNavItem({
      id: this.MODEL.SELECTOR.NAV.HELP,
      name: LN.get('help')
    });
  }

  generateLogined () {
    this.clearNavItem();
    this.addNavSearch();

    this.addNavItem({
      id: this.MODEL.SELECTOR.NAV.LIST,
      name: LN.get('clips')
    });
    this.addNavItem({
      id: this.MODEL.SELECTOR.NAV.SETTING,
      name: LN.get('setting')
    });
    this.addNavItem({
      id: this.MODEL.SELECTOR.NAV.HELP,
      name: LN.get('help')
    });
    this.addNavItem({
      id: this.MODEL.SELECTOR.NAV.LOGOUT,
      name: LN.get('logout')
    });
  }
}

// ----------------------------------------------------------------
// Event

class NavEvent extends ClipwebEvent {
  constructor (
    initSetting = {
      NAME: 'Nav Event'
    }
  ) {
    super(initSetting);
  }

  setEvent () {
    this.setClickHeaderClear();
    this.setClickNavSearch();
    this.setOpenLogin();
    this.setOpenSetting();
    this.setOpenLogout();
    this.setOpenRegister();
    this.setOpenList();
    this.setOpenHelp();
  }

  setClickHeaderClear () {
    super.setOn({
      selector: this.MODEL.SELECTOR.HEADER.CLEAR,
      func: () => {
        super.log('Click', 'Header LocalStorage Clear')();
        new Confirm({
          title: LN.get('userdata_clear'),
          content: LN.get('userdata_clear_confirm'),
          functionYes: () => {
            LocalStorage.clear();
            location.reload();
          }
        });
      }
    });
  }

  setClickNavSearch () {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR.NAV.SEARCH.BUTTON}`,
      func: () => {
        super.log('Click', 'Nav Search')();
        this.VIEW.updateArea({
          object: LIST,
          selector: this.MODEL.SELECTOR.AREA.LIST
        });
        $(LIST.MODEL.SELECTOR.SEARCH.SEARCH).val($(`#${this.MODEL.SELECTOR.NAV.SEARCH.TEXT}`).val());
        $(`#${this.MODEL.SELECTOR.NAV.SEARCH.TEXT}`).val('');
        LIST.filtering();
      }
    });

    super.setOn({
      trigger: 'keyup',
      selector: `#${this.MODEL.SELECTOR.NAV.SEARCH.TEXT}`,
      func: (event) => {
        if (event.which == 13) {
          super.trigger({
            trigger: 'click',
            selector: `#${this.MODEL.SELECTOR.NAV.SEARCH.BUTTON}`
          });
        }
      }
    });
  }

  setOpenLogin () {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR.NAV.LOGIN}`,
      func: () => {
        super.log('Login', 'Open')();
        this.VIEW.updateArea({
          object: USER,
          selector: this.MODEL.SELECTOR.AREA.USER
        });
        USER.open({ type: this.MODEL.TYPE.LOGIN });
      }
    });
  }

  setOpenSetting () {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR.NAV.SETTING}`,
      func: () => {
        super.log('User Setting', 'Open')();
        this.VIEW.updateArea({
          object: USER,
          selector: this.MODEL.SELECTOR.AREA.USER
        });
        USER.open({ type: this.MODEL.TYPE.SETTING });
      }
    });
  }

  setOpenLogout () {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR.NAV.LOGOUT}`,
      func: () => {
        super.log('Logout', 'Open')();
        this.VIEW.updateArea({
          object: USER,
          selector: this.MODEL.SELECTOR.AREA.USER
        });
        USER.open({ type: this.MODEL.TYPE.LOGOUT });
      }
    });
  }

  setOpenRegister () {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR.NAV.REGISTER}`,
      func: () => {
        super.log('Register', 'Open')();
        this.VIEW.updateArea({
          object: USER,
          selector: this.MODEL.SELECTOR.AREA.USER
        });
        USER.open({ type: this.MODEL.TYPE.REGISTER });
      }
    });
  }

  setOpenList () {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR.NAV.LIST}`,
      func: () => {
        super.log('List', 'Open')();
        this.VIEW.updateArea({
          object: LIST,
          selector: this.MODEL.SELECTOR.AREA.LIST
        });
      }
    });
  }

  setOpenHelp () {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR.NAV.HELP}`,
      func: () => {
        super.log('Help', 'Open')();
        this.VIEW.updateArea({
          object: HELP,
          selector: this.MODEL.SELECTOR.AREA.HELP
        });
        HELP.open({ type: this.MODEL.TYPE.HELP });
      }
    });
  }
}

// ----------------------------------------------------------------
// Controller

class NavController extends ClipwebController {
  constructor (
    model = {},
    initSetting = {
      NAME: 'Nav Controller',
      MODEL: new NavModel(),
      VIEW: new NavView(),
      EVENT: new NavEvent()
    }
  ) {
    super(model, initSetting);

    this.EVENT.setEvent();
    this.logout();
  }

  login () {
    this.VIEW.generateLogined();
  }

  logout () {
    this.VIEW.generateNotLogin();
  }
}
