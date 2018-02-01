# -*- coding: utf-8 -*-
from odoo import fields
from odoo import models


class PosConfig(models.Model):
    _inherit = 'res.users'

    allow_decrease_kitchen_only = fields.Boolean('Allow change Qty for kitchen orders', default=False)
