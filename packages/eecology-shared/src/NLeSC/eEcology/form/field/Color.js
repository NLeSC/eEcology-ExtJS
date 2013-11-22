/*
 * Copyright 2013 Netherlands eScience Center
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A color picker as form field. Can be used inside a editable grid.
 */
Ext.define('NLeSC.eEcology.form.field.Color', {
    extend:'Ext.form.field.Picker',
    alias: 'widget.colorfield',
    requires: ['Ext.picker.Color'],
    triggerCls : Ext.baseCSSPrefix + 'form-date-trigger',
    matchFieldWidth: false,
    allowBlank: false,
    maskRe: /[0-9A-F]/,
    colors: [
         '000000', '993300', '333300', '003300', '003366', '000080', '333399', '333333',
         '800000', 'FF6600', '808000', '008000', '008080', '0000FF', '666699', '808080',
         'FF0000', 'FF9900', '99CC00', '339966', '33CCCC', '3366FF', '800080', '969696',
         'FF00FF', 'FFCC00', 'FFFF00', '00FF00', '00FFFF', '00CCFF', '993366', 'C0C0C0',
         'FF99CC', 'FFCC99', 'FFFF99', 'CCFFCC', 'CCFFFF', '99CCFF', 'CC99FF', 'FFFFFF'
    ],
    pickerCls: Ext.baseCSSPrefix + 'form-color-picker',
    createPicker: function() {
        var me = this;

        return Ext.create('Ext.picker.Color', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            colors: me.colors,
            cls: me.pickerCls,
            listeners: {
                select: me.onSelect,
                scope: me
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    },
    onSelect: function(m, d) {
        var me = this;

        me.setValue(d);
        me.setFieldStyle({background: '#'+d});
        me.fireEvent('select', me, d);
        me.collapse();
    },
    /**
     * @private
     * Sets the Date picker's value to match the current field value when expanding.
     */
    onExpand: function() {
        var d = this.getValue();
        this.picker.select(d, true);
    },
    validator: function() {
        var d = this.getValue();
        if (/^[0-9A-F]{6}$/.test(d)) {
            return true;
        }
        return 'Color format is RRGGBB-digit hex code';
    }
});