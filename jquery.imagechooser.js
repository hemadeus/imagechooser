String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
    });
};


$(document).ready(function () {
    //$.getScript("/Scripts/dockpanel/jquery.dockpanel.viewmodel.js");

    (function ($) {
        $.fn.createImageChooser = function (config) {
           // config.selectorInit();
            imageChooserInit(this, config);
        };
    }(jQuery));
});
var jcrop_api;
var imageChooserCoordonate = {

};

function imageChooserInit(mainControl, config) {
    $.ajax({
        //TODO: FIND A WAY TO GENERATE IT WITH THE FILE OF THE CURRENT JS
        url: "imagechoosertemplate.html",
        success: function(data) {
            $(mainControl).append(data);
            $(mainControl).append($('#imageChooseTemplate').html().format(config.mainImageUrl,config.mainImageId));
            $('#newImageContainer').append($('#imageContainerTemplate').html().format(config.mainImageUrl, "Current"));
            $.each(config.suggestionList, function(index, item) {
                $('#newImageContainer').append($('#imageContainerTemplate').html().format(item.url, item.title, item.id));
            });

            $('.imageChooserSave').click(function () {
                config.saveCallback({
                    coordonate: imageChooserCoordonate,
                    imageUrl: $('#currentImage').attr('src'),
                    id: $('#currentImage').attr('data-id'),
            });
                $('#imageModal').modal('toggle');
            });
          
            $('#urlChooser').on('focusout', function () {
           //     if (/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test($(this).val())) {

                    var title = "New item";
                    if ($('.imagechoice img[data-id="0"').length > 0) {
                        $('.imagechoice img[data-id="0"').attr('src', $(this).val());
                    } else {
                        $('#newImageContainer').append($('#imageContainerTemplate').html().format($(this).val(), title, 0));
                        setImageChooserSelector();
                    }
             //   }
            });

            setImageChooserSelector();
        },
        dataType: 'html'
    });

    $(config.openButtonSelector).click(function() {
        $('#imageModal').modal('toggle');
        return false;
    });
   
}


function setImageChooserSelector() {
    $('.imageselector').off('click');
    //$('.imageselector').off('focusout');
    $('.imageselector').on('click',function () {
        var img = $(this).closest('.imagechoice').find('img');
        var imageUrl = $(img).attr('src').replace('big', 'hr');
        var id = $(img).attr('data-id');
        $('#imageContainer').html($('#mainImageTemplate').html().format(imageUrl,id));
        
        createJcrop();

        return false;
    });

    createJcrop();

}

function createJcrop() {
    if (jcrop_api)
        jcrop_api.destroy();
    if ($('#currentImage').height() > 200 || $('#currentImage').width() > 200) {
        $('#currentImage').Jcrop({
            bgColor: 'black',
            bgOpacity: .4,
            aspectRatio: 1,
            setSelect: [100, 100, 0, 0],
            minSize: [100, 100],
            onSelect: saveCoords,
            onChange: saveCoords,
            addClass: "jcrop-centered"
        }, function() { jcrop_api = this; });
    }
}
function saveCoords(coords) {
    if (parseInt(coords.w) > 0) {
        imageChooserCoordonate.y = coords.y;
        imageChooserCoordonate.x = coords.x;
        imageChooserCoordonate.y2 = coords.y2;
        imageChooserCoordonate.x2 = coords.x2;
    }
}

