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
 * Combo to select a tracker.
 *
 * # Example usage (requires trackers.json file in /):
 *
 *     @example
 *     var store = Ext.create('NLeSC.eEcology.store.TrackerIds', {
 *         storeId: 'TrackerIds'
 *     });
 *     store.getProxy().url = '/trackers.json';
 *     Ext.create('NLeSC.eEcology.form.field.TrackerCombo', {
 *         renderTo: Ext.getBody()
 *         labelWidth: 50,
 *         width: 110,
 *         store: 'TrackerIds',
 *         queryMode: 'remote',
 *         triggerAction: 'all',
 *         typeAhead: true
 *     });
 */
Ext.define('NLeSC.eEcology.form.field.TrackerCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.trackercombo',
    store: 'trackers',
    displayField: 'id',
    allowBlank: false,
    fieldLabel: 'Tracker',
    labelAttrTpl : 'data-qtip="Tracker identifier aka device_info_serial"',
    name: 'id',
    initComponent: function() {
        if (!Ext.StoreManager.lookup('trackers')) {
            Ext.create('NLeSC.eEcology.store.Trackers');
        }
        this.callParent();
    }
});
