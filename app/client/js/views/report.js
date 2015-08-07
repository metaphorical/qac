var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');

var template = require('../../views/report/report.jade');

var ReportItemView = Backbone.View.extend({
    init: function(options) {
        this.options = options;
        if(typeof options.collection !== 'undefined') {
            this.collection = options.collection;
        }
    },
    render: function() {
        this.collection.addCategory();

        var data = {
            errors: {
                a: this.collection.getErrors('A'),
                aa: this.collection.getErrors('AA'),
                aaa: this.collection.getErrors('AAA')
            },
            warnings: {
                a: this.collection.getWarnings('A'),
                aa: this.collection.getWarnings('AA'),
                aaa: this.collection.getWarnings('AAA')
            },
            notices: {
                a: this.collection.getNotices('A'),
                aa: this.collection.getNotices('AA'),
                aaa: this.collection.getNotices('AAA')
            },
            reportList: this.collection.toJSON()
        };

        console.log(data);

        return template(data);
    }
});

module.exports = ReportItemView;