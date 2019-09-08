<h1>RSS</h1>
<form>
  <p>A widget that shows your rss feeds</p><br/>
  <p>
    <label for="URL prefix">RSS urls</label>
    <textarea class="form-control" data-field="rss:urls" placeholder="Comma separated list of urls to RSS feeds"></textarea><br/>
  </p>
</form>

<button class="btn btn-lg btn-primary" id="save">Save</button>

<script>
  require(['admin/settings'], function(Settings) {
    Settings.prepare();
  });
</script>
