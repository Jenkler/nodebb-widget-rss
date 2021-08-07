<form class="rss-settings" role="form">
  <div class="row">
    <div class="col-sm-2 col-xs-12 settings-header">RSS</div>
    <div class="col-sm-10 col-xs-12">
      <p class="lead">A widget that shows your rss feeds</p>
      <div class="form-group">
        <label for="urls">Urls</label>
        <input class="form-control" id="urls" name="urls" placeholder="Comma separated list of urls to RSS feeds." title="Urls" type="text">
      </div>
      <div class="form-group">
        <label for="limit">limit</label>
        <input class="form-control" id="limit" name="limit" placeholder="Number entries form each feed url. Default is 10." title="Limit" type="text">
      </div>
    </div>
  </div>
</form>

<button class="floating-button mdl-button mdl-button--colored mdl-button--fab mdl-js-button mdl-js-ripple-effect" id="save">
  <i class="material-icons">save</i>
</button>
