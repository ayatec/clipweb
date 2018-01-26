
// ----------------------------------------------------------------
// List Class

// ----------------------------------------------------------------
// Model

class ListModel extends ClipwebModel {
  constructor (
    initSetting = {
      NAME: 'List Object'
    }
  ) {
    super(initSetting);

    // ----------------------------------------------------------------
    // エラーコード

    // ----------------------------------------------------------------
    // 識別子
    this.KEY = 'list';

    // ----------------------------------------------------------------
    // ステータス
    this.STATUS.GET = false;

    // ----------------------------------------------------------------
    // LocalStorageキー
    this.LS.SEARCH = 'list.search';
    this.LS.SEARCH_OP = 'list.search.op';
    this.LS.GROUP = 'list.group';
    this.LS.SORT = 'list.sort';
    this.LS.ORDER = 'list.order';

    // ----------------------------------------------------------------
    // 情報

    // 検索文字列
    this.SEARCH = '';
    this.SEARCH_OP = 'or';
    this.GROUP = 'type';
    this.SORT = 'name';
    this.ORDER = 'asc';

    // クリップ
    this.DOWNLOADED_CLIPS = {};
    this.FILTERED_CLIPS = {};
    this.GROUPED_CLIPS = {};
    this.SORTED_CLIPS = {};

    // ----------------------------------------------------------------
    // テンプレート
    this.TEMPLATE.SEARCH = '#list-search-template';
    this.TEMPLATE.SEARCH_CLIP = '#list-search-clips-template';

    // ----------------------------------------------------------------
    // オフセット
    this.COMMON.OFFSET = -8;

    // ----------------------------------------------------------------
    // セレクタ

    // エリア
    this.SELECTOR.AREA = '#list-area';

    // 検索
    this.SELECTOR.SEARCH = {};
    this.SELECTOR.SEARCH.NEW = '#list-search-new';
    this.SELECTOR.SEARCH.REFRESH = '#list-search-refresh';
    this.SELECTOR.SEARCH.SEARCH = '#list-search-search';
    this.SELECTOR.SEARCH.SEARCH_OP = '#list-search-search-op';
    this.SELECTOR.SEARCH.SEARCH_CLEAR = '#list-search-search-clear';
    this.SELECTOR.SEARCH.GROUP = '#list-search-group';
    this.SELECTOR.SEARCH.SORT = '#list-search-sort';
    this.SELECTOR.SEARCH.SORT_ASC = '#list-search-sort-asc';
    this.SELECTOR.SEARCH.SORT_DESC = '#list-search-sort-desc';
    this.SELECTOR.SEARCH.CLIPS = '#list-search-clips';

    // グループ
    this.SELECTOR.SEARCH.GROUPS = '#list-search-groups';

    // クリップ
    this.SELECTOR.SEARCH.CLIP = {};
    this.SELECTOR.SEARCH.CLIP.AREA = '#list-search-clip-area';
    this.SELECTOR.SEARCH.CLIP.EDIT = '#list-search-clip-edit';
    this.SELECTOR.SEARCH.CLIP.DELETE = '#list-search-clip-delete';
    this.SELECTOR.SEARCH.CLIP.SETTING = '#list-search-clip-setting';
  }
}

// ----------------------------------------------------------------
// View

class ListView extends ClipwebView {
  constructor (
    initSetting = {
      NAME: 'List View'
    }
  ) {
    super(initSetting);
  }

  generateGroups () {
    super.log('Groups', 'Generate')();
    this.clear({ selector: this.MODEL.SELECTOR.SEARCH.CLIPS });
    this.append({
      selector: this.MODEL.SELECTOR.SEARCH.CLIPS,
      template: this.MODEL.TEMPLATE.SEARCH_CLIP,
      model: {
        clips: this.MODEL.SORTED_CLIPS
      }
    });
  }
}

// ----------------------------------------------------------------
// Event

class ListEvent extends ClipwebEvent {
  constructor (
    initSetting = {
      NAME: 'List Event'
    }
  ) {
    super(initSetting);
  }

  setEvent () {
    this.setOnHide();
    this.setOnSearch();
  }

  // ----------------------------------------------------------------
  // hide

  setOnHide () {
    super.setHeaderButton({
      func: () => {
        this.trigger({ trigger: this.MODEL.TRIGGER.VIEW.HIDE });
      }
    });
  }

  // ----------------------------------------------------------------
  // type

  setOnSearch () {
    super.setOn({
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.NEW}`,
      func: () => {
        super.log('Search', 'New')();
        CLIP.VIEW.move({ target: LIST.MODEL.SELECTOR.AREA, mode: this.MODEL.COMMON.TYPE.BEFORE });
        CLIP.open({ type: this.MODEL.TYPE.NEW });
      }
    });

    super.setOn({
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.REFRESH}`,
      func: () => {
        super.log('Search', 'Refresh')();
        this.CONTROLLER.loadList();
      }
    });

    super.setOn({
      trigger: 'change',
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.GROUP}`,
      func: () => {
        super.log('Search', 'Group')();
        this.CONTROLLER.grouping();
      }
    });

    super.setOn({
      trigger: 'change',
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.SORT}`,
      func: () => {
        super.log('Search', 'Sort')();
        this.CONTROLLER.sorting({ type: 'asc' });
      }
    });

    super.setOn({
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.SORT_ASC}`,
      func: () => {
        super.log('Search', 'Sort Asc')();
        this.CONTROLLER.sorting({ type: 'asc' });
      }
    });

    super.setOn({
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.SORT_DESC}`,
      func: () => {
        super.log('Search', 'Sort Desc')();
        this.CONTROLLER.sorting({ type: 'desc' });
      }
    });

    super.setOn({
      trigger: 'change',
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.SEARCH_OP}`,
      func: () => {
        super.log('Search', 'OP')();
        this.CONTROLLER.filtering();
      }
    });

    super.setOn({
      trigger: 'change',
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.SEARCH}`,
      func: () => {
        super.log('Search', 'Filter')();
        this.CONTROLLER.filtering();
      }
    });

    super.setOn({
      selector: `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.SEARCH_CLEAR}`,
      func: () => {
        super.log('Search', 'Filter Clear')();
        $(this.MODEL.SELECTOR.SEARCH.SEARCH).val('');
        this.CONTROLLER.filtering();
      }
    });
  }

  setOnClip (
    hash = null
  ) {
    if (hash == null) {
      Log.error(arguments, 'need hash of argument X(')();
      return;
    }
    const _SELECTOR = `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.CLIPS} ${hash}`;
    super.setOn({
      selector: `${_SELECTOR} ${this.MODEL.SELECTOR.SEARCH.CLIP.EDIT}`,
      func: () => {
        super.log(`clip ${hash}`, 'Edit')();
        this.CONTROLLER.edit({ hash: hash });
      }
    });
    super.setOn({
      selector: `${_SELECTOR} ${this.MODEL.SELECTOR.SEARCH.CLIP.DELETE}`,
      func: () => {
        super.log(`clip ${hash}`, 'Delete')();
        this.CONTROLLER.delete({ hash: hash });
      }
    });
    super.setOn({
      selector: `${_SELECTOR} ${this.MODEL.SELECTOR.SEARCH.CLIP.SETTING}`,
      func: () => {
        super.log(`clip ${hash}`, 'Setting')();
        this.CONTROLLER.setting({ hash: hash });
      }
    });
  }

  setOffClip (
    hash = null
  ) {
    if (hash == null) {
      Log.error(arguments, 'need hash of argument X(')();
      return;
    }
    const _SELECTOR = `${this.MODEL.SELECTOR.AREA} ${this.MODEL.SELECTOR.SEARCH.CLIPS} ${hash}`;
    super.setOff({
      selector: `${_SELECTOR} ${this.MODEL.SELECTOR.SEARCH.CLIP.EDIT}`
    });
    super.setOff({
      selector: `${_SELECTOR} ${this.MODEL.SELECTOR.SEARCH.CLIP.DELETE}`
    });
    super.setOff({
      selector: `${_SELECTOR} ${this.MODEL.SELECTOR.SEARCH.CLIP.SETTING}`
    });
  }
}

// ----------------------------------------------------------------
// Controller

class ListController extends ClipwebController {
  constructor (
    model = {},
    initSetting = {
      NAME: 'List Controller',
      MODEL: new ListModel(),
      VIEW: new ListView(),
      EVENT: new ListEvent()
    }
  ) {
    super(model, initSetting);
    this.init();
  }

  init () {
    this.EVENT.setEvent();
    // データを取得
    // 前回の検索文字列
    if (LocalStorage.getItem(this.MODEL.LS.SEARCH) != null) {
      this.MODEL.SEARCH = LocalStorage.getItem(this.MODEL.LS.SEARCH);
    }
    // 前回の検索タイプ
    if (LocalStorage.getItem(this.MODEL.LS.SEARCH_OP) != null) {
      this.MODEL.SEARCH_OP = LocalStorage.getItem(this.MODEL.LS.SEARCH_OP);
    }
    // 前回のグループ
    if (LocalStorage.getItem(this.MODEL.LS.GROUP) != null) {
      this.MODEL.GROUP = LocalStorage.getItem(this.MODEL.LS.GROUP);
    }
    // 前回のソート
    if (LocalStorage.getItem(this.MODEL.LS.SORT) != null) {
      this.MODEL.SORT = LocalStorage.getItem(this.MODEL.LS.SORT);
    }
    // 前回のオーダー
    if (LocalStorage.getItem(this.MODEL.LS.ORDER) != null) {
      this.MODEL.ORDER = LocalStorage.getItem(this.MODEL.LS.ORDER);
    }
  }

  // ----------------------------------------------------------------
  // data shape

  grouping () {
    const _SELECTOR = this.MODEL.SELECTOR.SEARCH.GROUP;
    const _VALID = $(_SELECTOR)[0].validity.valid;

    if (_VALID) {
      this.MODEL.GROUP = $(`${_SELECTOR} option:selected`).val();
    } else {
      Log.error(arguments, 'select is invalid X(')();
      return;
    }

    // Grouping
    super.log('Grouping', this.MODEL.GROUP)();
    LocalStorage.setItem(this.MODEL.LS.GROUP, this.MODEL.GROUP);

    this.sorting({ type: this.MODEL.ORDER });
  }

  sorting ({
    type = null
  } = {}) {
    if (type == null) {
      Log.error(arguments)();
      return;
    }
    const _SELECTOR = this.MODEL.SELECTOR.SEARCH.SORT;
    const _VALID = $(_SELECTOR)[0].validity.valid;

    if (_VALID) {
      this.MODEL.SORT = $(`${_SELECTOR} option:selected`).val();
    } else {
      Log.error(arguments, 'select is invalid X(')();
      return;
    }

    switch (type) {
      case 'asc':
        this.MODEL.ORDER = 'asc';
        $(this.MODEL.SELECTOR.SEARCH.SORT_ASC).addClass('active');
        $(this.MODEL.SELECTOR.SEARCH.SORT_DESC).removeClass('active');
        break;
      case 'desc':
        this.MODEL.ORDER = 'desc';
        $(this.MODEL.SELECTOR.SEARCH.SORT_DESC).addClass('active');
        $(this.MODEL.SELECTOR.SEARCH.SORT_ASC).removeClass('active');
        break;
      default:
        Log.error(arguments, 'unknown type X(')();
    }

    // Sorting
    super.log('Sorting', `${this.MODEL.SORT} ${this.MODEL.ORDER.capitalize()}`)();
    LocalStorage.setItem(this.MODEL.LS.SORT, this.MODEL.SORT);
    LocalStorage.setItem(this.MODEL.LS.ORDER, this.MODEL.ORDER);

    this.VIEW.generateGroups();
  }

  filtering () {
    const _SELECTOR = this.MODEL.SELECTOR.SEARCH.SEARCH;
    const _SELECTOR_OP = this.MODEL.SELECTOR.SEARCH.SEARCH_OP;
    const _VALID = $(_SELECTOR)[0].validity.valid;

    if (_VALID) {
      this.MODEL.SEARCH = $(_SELECTOR).val();
      this.MODEL.SEARCH_OP = $(`${_SELECTOR_OP} option:selected`).val();
    } else {
      Log.error(arguments, 'input is invalid X(')();
      return;
    }

    // Filtering
    super.log('Filtering', `${this.MODEL.SEARCH}`)();
    LocalStorage.setItem(this.MODEL.LS.SEARCH, this.MODEL.SEARCH);
    LocalStorage.setItem(this.MODEL.LS.SEARCH_OP, this.MODEL.SEARCH_OP);

    this.MODEL.FILTERED_CLIPS = {};
    Log.obj(this.MODEL.DOWNLOADED_CLIPS)();
    let _clips = this.MODEL.DOWNLOADED_CLIPS;
    for (let index of Object.keys(_clips)) {
      if (_clips[index]['clip_name'].indexOf(this.MODEL.SEARCH) >= 0) {
        this.MODEL.FILTERED_CLIPS[_clips[index]['clip_hash']] = _clips[index];
        break;
      }
    }
    Log.obj(this.MODEL.FILTERED_CLIPS)();

    this.grouping();
  }

  // ----------------------------------------------------------------
  // clip

  edit ({
    hash = null
  } = {}) {
    if (hash == null) {
      Log.error(arguments)();
      return;
    }
  }

  delete ({
    hash = null
  } = {}) {
    if (hash == null) {
      Log.error(arguments)();
      return;
    }
  }

  setting ({
    hash = null
  } = {}) {
    if (hash == null) {
      Log.error(arguments)();
      return;
    }
  }

  // ----------------------------------------------------------------
  // ajax

  loadList () {
    const _TYPE = this.MODEL.TYPE.SEARCH;
    const _FAILED = 'failed_to_get_clip_list';
    this.MODEL.STATUS.GET = false;

    this.EVENT.setOnLoading({
      type: _TYPE,
      successFunction: () => {
        if (typeof this.getAjaxData({ key: 'result' }) == 'undefined') {
          // resultが取得できない
          this.open({
            type: _TYPE,
            model: super.getErrorModel('result', _FAILED)
          });
        } else {
          if (this.getAjaxData({ key: 'result' }) == false) {
            // 新規登録できていない(clipweb user error)
            if (typeof this.getAjaxData({ key: 'error' })[`${Project.NAME} ${this.MODEL.KEY} error`] != 'undefined') {
              const _ERROR = this.getAjaxData({ key: 'error' })[`${Project.NAME} ${this.MODEL.KEY} error`];
              this.open({
                type: _TYPE,
                model: super.getErrorModel('clipweb', _FAILED, _ERROR)
              });
            }
          } else {
            if (typeof this.getAjaxData({ key: 'clips' })['flex sqlite3 error'] != 'undefined') {
              // Flex SQLite3 エラー
              const _ERROR = this.getAjaxData({ key: 'clips' })['flex sqlite3 error'];
              this.open({
                type: _TYPE,
                model: super.getErrorModel('fsql', _FAILED, _ERROR)
              });
            } else {
              // 取得成功
              this.MODEL.STATUS.GET = true;
              this.CONTROLLER.applyReceiveModel(_TYPE);
              this.open({
                type: _TYPE,
                model: {
                  alertMessage:
                    View.element({ content: LN.get('clip_list_got') })
                },
              });
              this.filtering();
            }
          }
        }
      },
      errorOpenType: _TYPE,
      errorModel: super.getErrorModel('server', _FAILED)
    });

    // Post
    this.post({
      type: _TYPE,
      data: this.getSendModel(_TYPE)
    });
  }

  // ----------------------------------------------------------------
  // model

  getAreaModel (
    type = null
  ) {
    if (type == null) {
      Log.error(arguments)();
      return;
    }
    let _result = {};
    switch (type) {
      case this.MODEL.TYPE.SEARCH:
        // SEARCH
        _result = {
          search: this.MODEL.SEARCH,
          group: this.MODEL.GROUP,
          sort: this.MODEL.SORT,
          order: this.MODEL.ORDER,
          op: this.MODEL.SEARCH_OP
        };
        break;
      default:
        Log.error(arguments, 'unknown type X(')();
        return;
    }
    return _result;
  }

  applyReceiveModel (
    type = null
  ) {
    super.log(type.capitalize(), 'Apply')();
    if (type == null) {
      Log.error(arguments);
      return;
    }
    if (type != this.getAjaxData({ key: 'type' })) {
      Log.error(arguments, 'type mismatch X(')();
      return;
    }

    switch (type) {
      case this.MODEL.TYPE.SEARCH:
        // SEARCH
        this.MODEL.DOWNLOADED_CLIPS = this.getAjaxData({ key: 'clips' });
        break;

      default:
        Log.error(arguments, 'unknown type X(')();
        return;
    }
  }

  clearModel () {
    this.MODEL.CLIPS = null;
  }

  getSendModel (
    type = null
  ) {
    if (type == null) {
      Log.error(arguments)();
      return;
    }
    let _model = {};
    _model['hash'] = USER.MODEL.HASH.USER;
    _model['password_hash'] = USER.MODEL.HASH.PASSWORD;
    switch (type) {
      case this.MODEL.TYPE.SEARCH:
        // SEARCH
        break;

      default:
        Log.error(arguments, 'unknown type X(')();
        return;
    }
    return _model;
  }
}
