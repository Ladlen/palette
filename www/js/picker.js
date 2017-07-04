jQuery(function ($) {
    var textExtendWithColor = ['c_text_1', 'c_text_2', 'c_text_3', 'c_text_4', 'c_text_5', 'c_text_6'];
    //var textExtendWithColor = ['colordefault', 'colordefaultfon', 'colordefaultbutton', 'colordefaulttext', 'colordefaultpk'];

    for (var inputName in textExtendWithColor) {
        var input = $("form input[name='" + textExtendWithColor[inputName] + "']");
        if (input.length) {
            var color = convertColorValue(input.val());
            if (color) {
                color = new $.jPicker.Color(color);
            } else {
                color = new $.jPicker.Color();
            }
            var span = $("<span>").insertAfter(input);
            span.jPicker(
                {
                    window: {
                        expandable: true,
                        position: {
                            y: '0px'
                        },
                        alphaSupport: true
                    },
                    images: {
                        clientPath: 'vendor/jpicker-1.1.6/images/'
                        //clientPath: 'http://your-needs.000webhostapp.com/temp/images/'
                    },
                    color: {
                        alphaSupport: true,
                        active: color
                    }
                },
                function (color, context) {
                    var all = color.val('all');
                    if (all.a != 255) {
                        $(this).prev().val('rgba(' + all.r + ', ' + all.g + ', ' + all.b + ', ' + (+(all.a / 255).toFixed(2)) + ')');
                    } else {
                        $(this).prev().val('#' + all.hex);
                    }
                }
            );

            input.data('jPicker', span);

            input.keyup(function () {
                var color = convertColorValue($(this).val());
                if (color) {
                    var cName = false;
                    for (cName in color) {
                        $(this).data('jPicker')[0].color.active.val(cName, color[cName], this);
                        if (cName == 'hex') {
                            $(this).data('jPicker')[0].color.active.val('a', '255', this);
                        }
                    }
                    // Воозможно не было прозрачности - попробуем установить
                    if (cName == 'b') {
                        $(this).data('jPicker')[0].color.active.val('a', '255', this);
                    }
                } else {
                    $(this).data('jPicker')[0].color.active.val('r', '0', this);
                    $(this).data('jPicker')[0].color.active.val('g', '0', this);
                    $(this).data('jPicker')[0].color.active.val('b', '0', this);
                    $(this).data('jPicker')[0].color.active.val('a', '0', this);
                }
            });
        }
    }

    function convertColorValue(val) {
        var colorPatterns = {
            hash: /^\s*#([0-F]{6})\s*$/i,
            shortHash: /^\s*#([0-F])([0-F])([0-F])\s*$/i,
            rgb: /^\s*rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*$/i,
            rgba: /^\s*rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d\.]{1,5})\s*\)\s*$/i
        };

        var numberDetected = false;

        for (var patternName in colorPatterns) {
            var matches = val.match(colorPatterns[patternName]);
            if (matches) {
                switch (patternName) {
                    case 'hash':
                        numberDetected = {hex: matches[1]};
                        break;
                    case 'shortHash':
                        numberDetected = {hex: matches[1] + matches[1] + matches[2] + matches[2] + matches[3] + matches[3]};
                        break;
                    case 'rgb':
                        numberDetected = {r: matches[1], g: matches[2], b: matches[3]};
                        break;
                    case 'rgba':
                        numberDetected = {r: matches[1], g: matches[2], b: matches[3], a: matches[4] * 255};
                        break;
                    default:
                        break;
                }

                break;
            }
        }

        return numberDetected;
    }
});