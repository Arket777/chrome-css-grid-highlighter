var port = chrome.extension.connect();

function convertHex(hex) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    
        return r+','+g+','+b;
}

var borderColor = '#00FFFF';
var boderColorRGB = '';

chrome.storage.sync.get({
  borderColor
}, (items) => {
  borderColor = items.borderColor;
  boderColorRGB = convertHex(items.borderColor);
});

window.onload = () => {
	
  port.onMessage.addListener(msg => {
    if (msg.message === 'aktif') {
      initGridInspector();
			
      window.onresize = () => {
        initGridInspector();
      }
    } else {
      $('.GridInspector').remove();
    }
  });

  function initGridInspector() {

    $.each($('body, body *'), (index, el) => {

      var elStyles = window.getComputedStyle(el)
      var elPropDisplay = elStyles.getPropertyValue('display')

      if (elPropDisplay === 'grid') {

        var $grid = $(el)
        $grid.find('.GridInspector').remove()

        $grid.css({
          position: 'relative'
        })

        var $Inspector = $('<div class=\'GridInspector\'/>')
        $Inspector.css({
          pointerEvents: 'none',
          boxSizing: 'border-box',
          position: 'absolute',
          zIndex: '9999',
          border: '1px solid '+borderColor,
          width: $grid.width(),
          height: $grid.height(),
          left: elStyles.getPropertyValue('padding-left'),
          top: elStyles.getPropertyValue('padding-top'),
          background: 'transparent'
        })
        $grid.append($Inspector)

				// GAP
        var gridRowsGap = parseFloat(elStyles.getPropertyValue('grid-row-gap').replace(/([a-z])\w+/g, ''))
        var gridColumnsGap = parseFloat(elStyles.getPropertyValue('grid-column-gap').replace(/([a-z])\w+/g, ''))

				// TEMPLATES
        var gridRows = elStyles.getPropertyValue('grid-template-rows')
        var gridColumns = elStyles.getPropertyValue('grid-template-columns')

				// ARRAY
        var arrGridRows = gridRows.replace(/([a-z])\w+/g, '').split(' ')
        var arrGridColumns = gridColumns.replace(/([a-z])\w+/g, '').split(' ')

        var arrGridRows = $.map(arrGridRows, n => parseFloat(n))
        arrGridRows.pop()
        var arrGridColumns = $.map(arrGridColumns, n => parseFloat(n))
        arrGridColumns.pop()

        var top = 0
        $.each(arrGridRows, (index, val) => {
          if (!isNaN(parseFloat(val)) && isFinite(val) && val > 0) {
            top += val - 1
            var $row = $('<div class=\'GridInspector-row\'/>')
            $Inspector.append($row)
            $row.css({
              boxSizing: 'border-box',
              position: 'absolute',
              top: top,
              left: 0,
              right: 0,
              height: gridRowsGap,
              border: 'dashed ' + borderColor,
              borderWidth: '1px 0',
              backgroundColor: 'rgba('+boderColorRGB+', 0.2)',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255, .8) 5px, rgba(255,255,255, .8) 10px)'
            })
            top += gridRowsGap
          }
        })

        var left = 0
        $.each(arrGridColumns, (index, val) => {
          if (!isNaN(parseFloat(val)) && isFinite(val) && val > 0) {
            left += val
            var $col = $('<div class=\'GridInspector-col\'/>')
            $Inspector.append($col)
            $col.css({
              boxSizing: 'border-box',
              position: 'absolute',
              top: 0,
              left: left,
              width: gridColumnsGap,
              height: '100%',
              border: 'dashed ' + borderColor,
              borderWidth: '0 1px',
              backgroundColor: 'rgba('+boderColorRGB+', 0.2)',
              backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255, .8) 5px, rgba(255,255,255, .8) 10px)'
            })
            left += gridColumnsGap
          }
        })

      }
    })
  }
}