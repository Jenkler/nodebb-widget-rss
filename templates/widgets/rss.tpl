<style>
#nyheter .date { float: right; }
#nyheter h1 { font-size: 20px; }
#nyheter h2, #nyheter h3 { font-size: 15px; }
#nyheter img { display: block; height: auto; margin: 10px 0px; max-width: 100%;  }
#nyheter iframe { max-width: 100%; }
#nyheter td { border-top: 1px solid #ddd; padding: 8px; }
#nyheter tr:nth-of-type(odd) { background-color: #f9f9f9; }
.rss-widget-card {overflow: hidden; overflow-wrap: break-word; }
</style>

<div class="card mb-3 rss-widget-card">
  <div class="card-header text-bg-info">{title}</div>
  <div class="card-body">{body}</div>
</div>