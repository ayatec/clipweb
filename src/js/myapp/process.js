
class Process extends CommonProcess {
  constructor (
    _initSetting = {
      NAME: `${Project.NAME} Process`
    }
  ) {
    super(_initSetting);

    this.SELECTOR = {};
    this.SELECTOR.MAIN = 'main';
    this.SELECTOR.BODY = 'body';

    this.SELECTOR.CONTENT = {};
    this.SELECTOR.CONTENT.USER = 'user-area';
    this.SELECTOR.CONTENT.LIST = 'list-area';
    this.SELECTOR.CONTENT.CLIP = 'clip-area';
    this.SELECTOR.CONTENT.HELP = 'help-area';
    this.SELECTOR.CONTENT.HELP = 'code-area';

    this.run();
  }

  run () {
    this.generateContent();
    this.setViewContent();
    this.initController();
    this.show();
  }

  generateContent () {
    $(this.SELECTOR.MAIN).empty();
    $.each(this.SELECTOR.CONTENT, (index, selector) => {
      $(this.SELECTOR.MAIN).append(Content.getContent(selector));
    });
  }

  setViewContent () {
    $.each(this.SELECTOR.CONTENT, (index, selector) => {
      $(`#${selector}`).hide();
    });
  }

  initController () {
    NAV = new NavController();
    // HELP = new HelpController();
    USER = new UserController();
    LIST = new ListController();
    CLIP = new ClipController();
    CODE = new CodeController();
  }

  show () {
    $(this.SELECTOR.BODY).show();
    $(this.SELECTOR.MAIN).show();
  }
}
