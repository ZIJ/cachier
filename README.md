cachier
=======

LocalStorage cache for scripts

#### Usage

1. Add config script to `head`:

```javascript
<script id="cachier-config" type="application/json">
{
  "main": "js/main.js",
  "dependencies": {
    "jquery-2.1.1": "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"
  }
}
</script>
```

2. Add init script to `body`:

```html
<script src="js/cachier.js"></script>
```

In production it's better to inline minified version (coming soon) rather than linking a script.
