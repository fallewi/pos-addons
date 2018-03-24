odoo.define('pos_mobile_restaurant.models', function (require) {
    "use strict";
    if (!odoo.is_mobile) {
        return;
    }

    var models = require('pos_mobile.models');

    var _super_posmodel = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function (session, attributes) {
            this.saved_floors_data = {};
            return _super_posmodel.initialize.call(this, session, attributes);
        },
        set_table: function(table) {
            this.table = table;
            var orders = this.get_order_list();
            if (this.table && !this.order_to_transfer_to_different_table && this.config.show_number_guests && !orders.length) {
                this.gui.screen_instances.products.action_buttons.guests.button_click();
            } else {
                _super_posmodel.set_table.call(this, table);
            }
        }
    });

    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        saveChanges: function(){
            var self = this;
            this.saved_resume = this.build_line_resume();

            function delay(ms) {
                var d = $.Deferred();
                setTimeout(function(){
                    d.resolve();
                }, ms);
                return d.promise();
            }

            var q = $.when();

            var lines = this.get_orderlines();
            lines.forEach(function(line, index){
                q = q.then(function(){
                    if (line.mp_dirty !== false) {
                        $('.order-scroller').scrollTop(133 * index);
                    }
                    line.set_dirty(false);
                    return delay(50);
                });
            });

            q.then(function(){
                self.trigger('change', self);
            });
        }
    });

    return models;
});
