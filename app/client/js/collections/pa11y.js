var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');

var PallyCollection = Backbone.Collection.extend({
        url: '/api/wai/pally',
        initialize: function() {
            this.on('sync', function(){
                this.addCategory();
            });
        },
        addCategory: function() {
          this.forEach(function(model){
             var code = model.get('code');
             var category = code.split('.');
             category = category[0].replace('WCAG2', '');
             model.set('category', category);
          });
        },
        getMsg: function(typeCode, category) {
            var pick = this.where({
                'category' : category,
                'typeCode' : typeCode
            });
            var result = pick.map(function(model) {
                return model.toJSON();
            });
            return pick.map(function(model) {
                return model.toJSON();
            });
        },
        getErrors: function(category) {
            return this.getMsg(1, category);
        },
        getWarnings: function(category) {
            return this.getMsg(2, category);
        },
        getNotices: function(category) {
            return this.getMsg(3, category);
        },
        comparator: function(collection) {
            return collection.get('type');
        }
});

module.exports = PallyCollection;