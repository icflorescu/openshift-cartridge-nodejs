<info>
  <item each={ items }>{ name }: { value }</item>
  <style>
    info {
      display: block;
      max-width: 700px;
      margin: auto;
      font-family: 'Ubuntu Mono', monospace;
      border-radius: 4px;
      background: #1D1F21;
      box-shadow: 0 0 10px rgba(0, 0, 0 , 0.8) inset;
      padding: 20px;
      overflow-x: auto;
      margin-bottom: 10px;
    }

    info > item {
      display: block;
      white-space: nowrap;
      overflow-x: visible;
      border-top: 1px dashed #333;
      margin-top: 6px;
    }

    info > item:first-child {
      border-top: 0;
      margin-top: 0;
    }

  </style>
  <script>

    var tag = this

    tag.items = [{
      name:  'Info',
      value: 'Loading...'
    }]

    tag.on('mount', function () {
      var load = function () {
        superagent.get('/info/' + tag.opts.type, function (err, res) {
          if (err) {
            console.log(err)
            return
          }
          tag.items = res.body
          tag.update()
        })
      }

      load()
      if (tag.opts.type == 'poll') {
        setInterval(load, 3000)
      }
    })

  </script>
</info>
