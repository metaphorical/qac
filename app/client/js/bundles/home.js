var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');

var Pa11yCollection = require('../collections/pa11y.js');

var ReportView = require('../views/report.js');

var HomeView = Backbone.View.extend({
    el: 'body',
    events: {
        'click .js-perform-test' : 'performTest',
        'click .js-tab-head' : 'tabSwitch',
        'change .js-need-auth': 'openAuth',
        'click .js-context' : 'toggleContext',
        'click .js-filter .js-trig' : 'filterStandard'
    },
    initialize: function() {
    },
    useAuth: false,
    openAuth: function() {
        $('.js-auth-form').toggle();
        this.useAuth = this.useAuth === false;
    },
    performTest: function(e) {
        var address = $('.js-address').val();
        var pa11yCollection = new Pa11yCollection();
        var data = {
            address: address
        };
        if (this.useAuth) {
            data.username = $('.js-auth-name').val(),
            data.password = $('.js-auth-pass').val()
        }
        $(e.currentTarget).hide();
        $('.js-loader').show();
        pa11yCollection.fetch({
            data: data,
        }).done(function(){
            var reportView = new ReportView({
                collection: pa11yCollection
            });
            $('.js-report-list').html(reportView.render());
            $('.js-loader').hide();
            $(e.currentTarget).text('Test again').show();
        });
    },
    tabSwitch: function(e) {
        var tabHeader = $(e.currentTarget);
        $('.js-tab-head').removeClass('active');
        tabHeader.addClass('active');
        $('.js-tab-container').removeClass('active');
        $('.' + tabHeader.data('aim')).addClass('active');
    },
    toggleContext: function(e) {
        var contextTitle = $(e.currentTarget);
        contextTitle.siblings('.content').toggle();
    },
    filterStandard: function(e) {
        var type = $(e.currentTarget).parents('.js-filter').data('target');
        var standard = $(e.currentTarget).data('target');

        $('.js-' + type + '-list .js-holder').each(function() {
           $('.js-filter .js-trig').removeClass('active');
           $(e.currentTarget).addClass('active');
           if($(this).data('standard') === standard) {
               $(this).show();
           } else {
               $(this).hide();
           }
        });
    }
});

module.exports = new HomeView();