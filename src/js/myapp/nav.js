
// ----------------------------------------------------------------
// Nav Class

// ----------------------------------------------------------------
// Model

class NavModel extends ContentModel {
  constructor(
    _initSetting = {
      NAME: 'Nav Object',
    }
  ) {
    super(_initSetting);

    this.SELECTOR_AREA = '#navbar';
    this.SELECTOR_NAV = '.navbar-nav';

    this.SELECTOR_NAV_LOGIN = 'nav-login';
    this.SELECTOR_NAV_REGISTER = 'nav-register';
    this.SELECTOR_NAV_SETTING = 'nav-setting';
    this.SELECTOR_NAV_LOGOUT = 'nav-logout';
    this.SELECTOR_NAV_HELP = 'nav-help';

  }
}

// ----------------------------------------------------------------
// View

class NavView extends ContentView {
  constructor(
    _initSetting = {
      NAME: 'Nav View'
    }
  ) {
    super(_initSetting);
  }

  clearNavItem() {
    $(this.MODEL.SELECTOR_AREA).empty();
    $(this.MODEL.SELECTOR_AREA).append('<ul class="navbar-nav col-md-6"></ul>');
  }

  addNavItem({
    id = null,
    name = null,
    type = 'append',
    fa = null
  } = {}) {
    if (id == null || name == null) {
      Log.logClassKey('NavView', 'addNavItem', 'Need argument');
      return;
    }

    if ($(`${this.MODEL.SELECTOR_NAV} #${id}`).length > 0) {
      this.removeNavItem({
        id: this.MODEL.SELECTOR_NAV_LOGIN
      });
    }

    const _element = `<li class="nav-item"><a class="nav-link"id="${id}"><i class="${fa}"></i> ${name}</a></li>`;
    if (type == 'prepend') {
      $(this.MODEL.SELECTOR_NAV).prepend(_element);
    } else {
      $(this.MODEL.SELECTOR_NAV).append(_element);
    }
  }

  removeNavItem({
    id = null
  }) {
    if (id == null) {
      Log.logClassKey('NavView', 'removeNavItem', 'Need argument');
      return;
    }

    $(`${this.MODEL.SELECTOR_NAV} #${id}`).each((_index, _element) => {
      $(_element).parent().remove();
    });
  }

  addNavSearch() {
    $(this.MODEL.SELECTOR_AREA).append('<div class="col-md-6 nav-seacrh"><div class="input-group"><input class="form-control" id="nav-seacrh-text" placeholder="Search"><span class="input-group-btn"><button class="btn btn-outline-info" id="nav-seacrh-button"><i class="fas fa-search"></i></button></span></div></div>');
  }

  generateNotLogin() {
    this.clearNavItem();

    this.addNavItem({
      id: this.MODEL.SELECTOR_NAV_LOGIN,
      name: 'Login'
    });
    this.addNavItem({
      id: this.MODEL.SELECTOR_NAV_HELP,
      name: 'Help'
    });
  }

  generateLogined() {
    this.clearNavItem();
    this.addNavSearch();

    this.addNavItem({
      id: this.MODEL.SELECTOR_NAV_SETTING,
      name: 'Setting'
    });
    this.addNavItem({
      id: this.MODEL.SELECTOR_NAV_HELP,
      name: 'Help'
    });
    this.addNavItem({
      id: this.MODEL.SELECTOR_NAV_LOGOUT,
      name: 'Logout'
    });
  }
}

// ----------------------------------------------------------------
// Event

class NavEvent extends ContentEvent {
  constructor(
    _initSetting = {
      NAME: 'Nav Event'
    }
  ) {
    super(_initSetting);
  }

  setEvent() {
    this.setOpenLogin();
    this.setOpenSetting();
    this.setOpenLogout();
    this.setOpenRegister();
    this.setOpenHelp();
  }

  setOpenLogin() {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR_NAV_LOGIN}`,
      func: () => {
        Log.logClassKey('Nav', 'Login', 'Open');
        PS.CONTROLLER.USER.openLogin();
      }
    });
  }

  setOpenSetting() {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR_NAV_SETTING}`,
      func: () => {
        Log.logClassKey('Nav', 'User Setting', 'Open');
        PS.CONTROLLER.USER.openSetting();
      }
    });
  }

  setOpenLogout() {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR_NAV_LOGOUT}`,
      func: () => {
        Log.logClassKey('Nav', 'Logout', 'Open');
        PS.CONTROLLER.USER.openLogout();
      }
    });
  }

  setOpenRegister() {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR_NAV_REGISTER}`,
      func: () => {
        Log.logClassKey('Nav', 'Register', 'Open');
        PS.CONTROLLER.USER.openRegister();
      }
    });
  }

  setOpenHelp() {
    super.setOn({
      selector: `#${this.MODEL.SELECTOR_NAV_HELP}`,
      func: () => {
        Log.logClassKey('Nav', 'Help', 'Open');
        PS.CONTROLLER.HELP.openHelp();
      }
    });
  }
}

// ----------------------------------------------------------------
// Controller

class NavController extends ContentController {
  constructor(
    _model = {},
    _initSetting = {
      NAME: 'Nav Controller',
      MODEL: new NavModel(),
      VIEW: new NavView(),
      EVENT: new NavEvent()
    }
  ) {
    super(_model, _initSetting);

    this.EVENT.setEvent();
    this.VIEW.generateNotLogin();
  }
}
