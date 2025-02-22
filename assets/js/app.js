/*
 * Welcome to your app's main JavaScript file!
 *
 */
import '../css/app.css';
import $ from 'jquery';

global.$ = global.jQuery = $;
import ('popper.js');

import('bootstrap');
import('mdbootstrap');
import ('jquery-confirm');
import * as h2Button from 'h2-invent-apps';
import flatpickr from 'flatpickr'
import {Calendar} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import momentPlugin from '@fullcalendar/moment';
import listPlugin from '@fullcalendar/list';
import Chart from 'chart.js';
import autosize from 'autosize'

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}
addEventListener('load', function () {
    var url = (new URLSearchParams(window.location.search)).get('modalUrl');
    if (url !== null) {
        $('#loadContentModal').load(atob(url), function () {
            $('#loadContentModal ').modal('show');
        });
    }
});

$(document).ready(function () {
    setTimeout(function () {
        $('#snackbar').addClass('show');
        setTimeout(function () {
            $('#snackbar').removeClass('show');
        }, 3000);
    }, 500);
    if (importBBB) {
        h2Button.init();
    }

    initDropDown();

    $('#dismiss, .overlay').on('click', function () {
        // hide sidebar
        $('#sidebar').removeClass('active');
        // hide overlay
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        // open sidebar
        $('#sidebar').addClass('active');
        // fade in the overlay
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    $('.flatpickr').flatpickr({
        minDate: "today",
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });

});
$(window).on('load', function () {
    $('[data-toggle="popover"]').popover({html: true});
});

$(document).on('click', '.confirmHref', function (e) {
    e.preventDefault();
    var url = $(this).prop('href');
    var text = $(this).data('text');
    if (typeof text === 'undefined') {

        text = 'Wollen Sie die Aktion durchführen?'
    }
    console.log(text);
    $.confirm({
        title: 'Bestätigung',
        content: text,
        theme: 'material',
        buttons: {
            confirm: {
                text: 'OK', // text for button
                btnClass: 'btn-outline-danger btn', // class for the button
                action: function () {
                    window.location.href = url;
                },


            },
            cancel: {
                text: 'Abbrechen', // text for button
                btnClass: 'btn-outline-primary btn', // class for the button
            },
        }
    });

})

$(document).on('click', '.loadContent', function (e) {
    e.preventDefault();
    var url = $(this).attr('href');
    $('#loadContentModal').load(url, function () {
        $('#loadContentModal ').modal('show');

    });
});
function initServerFeatures(){
    getMoreFeature($('.moreFeatures').val())
    $('.moreFeatures').change(function (){
     getMoreFeature($(this).val());
    })
}
$('#loadContentModal').on('shown.bs.modal', function (e) {
    $('.flatpickr').flatpickr({
        minDate: "today",
        enableTime: true,
        time_24hr: true,
        defaultMinute: 0,
        minuteIncrement: 15,
        altFormat: 'd.m.Y H:i',
        dateFormat: 'Y-m-d H:i',
        altInput: true
    });
    $('.generateApiKey').click(function (e) {
        e.preventDefault();
        $('#enterprise_apiKey').val(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    })
    $('#jwtServer').change(function () {
        if ($('#jwtServer').prop('checked')) {
            $('#appId').collapse('show')
        } else {
            $('#appId').collapse('hide')
        }
    });
    initSearchUser();
    initServerFeatures();
    var ctx = document.getElementById("lineChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
});

$(".clickable-row").click(function () {
    window.location = $(this).data("href");
});
$('#ex1-tab-3-tab').on('shown.bs.tab', function (e) {
    renderCalendar();
})

function renderCalendar() {

    var calendarEl = document.getElementById('calendar');
    var calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, bootstrapPlugin, momentPlugin, listPlugin],
        themeSystem: 'bootstrap',
        events: '/api/v1/getAllEntries',
        lang: 'de',
        timeFormat: 'H(:mm)',
        displayEventEnd: true,

    });
    calendar.render();

}

function initSearchUser() {
    autosize($('#new_member_member'));
    $('#searchUser').keyup(function (e) {
        var $ele = $(this);
        var $search = $ele.val();
        var $url = $ele.attr('href') + '?search=' + $search;
        if ($search.length > 0) {
            $.getJSON($url, function (data) {
                var $target = $('#participantUser');
                $target.empty();
                for (var i = 0; i < data.length; i++) {
                    $target.append('<a class="dropdown-item chooseParticipant" data-val="' + data[i] + '" href="#">' + data[i] + '</a>');
                }

                $('.chooseParticipant').click(function (e) {
                    e.preventDefault();
                    var $textarea = $('#new_member_member');
                    var data = $textarea.val();
                    $textarea.val('').val($(this).data('val') + "\n" + data);
                    $('#searchUser').val('');
                    autosize.update($textarea);
                })
            })
        }

    })
}

function initDropDown() {
    $('.dropdownTabToggle').click(function (e) {
        e.preventDefault();
        var $ele = $(this);
        var $target = $ele.attr('href');
        $($target).tab('show');
        $ele.closest('.tabDropdown').find('button').text($ele.text());
        $ele.closest('.dropdown-menu').find('.active').removeClass('active');
        $ele.addClass('active');
    })


}
function getMoreFeature(id){
    $.getJSON(moreFeatureUrl,'id='+id,function (data){
        var feature = data.feature;
        for (var prop in feature) {
            if(feature[prop] == true){
                $('#'+prop).removeClass('d-none')
            }else {
                $('#'+prop).addClass('d-none')
            }
        }
    })
}
