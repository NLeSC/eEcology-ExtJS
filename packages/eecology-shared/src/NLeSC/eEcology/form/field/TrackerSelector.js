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
 * A available trackers grid and a customizable selected trackers grid.
 * Use drag/drop or doublclick or button to move trackers between grids.
 */
Ext.define('NLeSC.eEcology.form.field.TrackerSelector', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.trackergridselector',
    fieldLabel: 'Trackers',
    name: 'trackers',
    labelAttrTpl : 'data-qtip="Selected tracker identifiers with additional data"',
    mixins: {
        bindable: 'Ext.util.Bindable',
        field: 'Ext.form.field.Field'
    },
    requires: [
        'Ext.button.Button',
        'NLeSC.eEcology.grid.Trackers',
        'Ext.ux.grid.FiltersFeature'
    ],
    uses: ['Ext.grid.plugin.DragDrop'],
    /**
     * @cfg {Object} fromGrid (required)
     * Grid config object used as from Grid.
     */

    /**
     * @cfg {Object} toGrid (required)
     * Grid config object used as to Grid.
     */

    /**
     * @cfg String [dragText="{0} Item{1}"] The text to show while dragging items.
     * {0} will be replaced by the number of items. {1} will be replaced by the plural
     * form if there is more than 1 item.
     */
    dragText: '{0} Tracker{1}',
    msgTarget: 'under',
    value: [],
    /**
     * @cfg {Boolean} [allowBlank=false] `false` to require at least one item in the list to be selected, `true` to allow no
     * selection.
     */
    allowBlank: false,
    /**
     * @cfg {String} [blankText="This field is required"] Default text displayed when the control contains no items.
     */
    blankText: 'One or more selected trackers are required',
    /**
     * @cfg {Boolean} [hideNavIcons=false] True to hide the navigation icons
     */
    hideNavIcons:false,
    /**
     * @cfg {Array} buttons Defines the set of buttons that should be displayed in between the ItemSelector
     * fields. Defaults to <tt>['top', 'up', 'add', 'remove', 'down', 'bottom']</tt>. These names are used
     * to build the button CSS class names, and to look up the button text labels in {@link #buttonsText}.
     * This can be overridden with a custom Array to change which buttons are displayed or their order.
     */
    buttons: ['top', 'up', 'add', 'remove', 'down', 'bottom'],

    /**
     * @cfg {Object} buttonsText The tooltips for the {@link #buttons}.
     * Labels for buttons.
     */
    buttonsText: {
        top: "Move to Top",
        up: "Move Up",
        add: "Add to Selected",
        remove: "Remove from Selected",
        down: "Move Down",
        bottom: "Move to Bottom"
    },
    defaults: {flex: 1},
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    autoWidth: true,
    height: 300,
    initComponent: function() {
        var me = this;
        me.items = me.setupItems();
        me.callParent();
        me.initField();
    },
    createList: function(grid) {
        var me = this;

        grid.disabled = me.disabled;
        grid.margins = '0 2 0 0';

        if (!grid.viewConfig) {
            grid.viewConfig = {};
        }
        if (!grid.viewConfig.plugins) {
            grid.viewConfig.plugins = [];
        }
        if (Ext.isObject(grid.viewConfig.plugins)) {
            grid.viewConfig.plugins = [grid.viewConfig.plugins];
        }
        grid.viewConfig.plugins.push({
            ptype: 'gridviewdragdrop',
            ddGroup: me.ddGroup,
            dragText: me.dragText
        });

        var field = Ext.create('Ext.grid.Panel', grid);
        field.addListener('itemdblclick', me.onItemDblClick, me);
        field.getView().addListener('drop', me.onSelectedDrop, me);

        return field;
    },
    createButtons: function() {
        var me = this,
        buttons = [];

        if (!me.hideNavIcons) {
            Ext.Array.forEach(me.buttons, function(name) {
                buttons.push({
                    xtype: 'button',
                    tooltip: me.buttonsText[name],
                    handler: me['on' + Ext.String.capitalize(name) + 'BtnClick'],
                    cls: Ext.baseCSSPrefix + 'form-itemselector-btn',
                    iconCls: Ext.baseCSSPrefix + 'form-itemselector-' + name,
                    navBtn: true,
                    scope: me,
                    margin: '4 0 0 0'
                });
            });
        }
        return buttons;
    },
    createFromGrid: function() {
        var me  = this;
        var grid = Ext.create('NLeSC.eEcology.grid.Trackers', {
            title: 'Available',
            multiSelect: true,
            disabled: me.disabled,
            margins: '0 2 0 0',
            viewConfig: {
                plugins: [{
                    ptype: 'gridviewdragdrop',
                    ddGroup: me.ddGroup,
                    dragText: me.dragText
                }]
            }
        });
        grid.addListener('itemdblclick', me.onItemDblClick, me);
        grid.getView().addListener('drop', me.onAvailableDrop, me);

        return grid;
    },
    setupItems: function() {
        var me = this;

        me.ddGroup = 'TrackerGridSelectorDD-'+Ext.id();

        if (!me.toGrid.viewConfig) {
            me.toGrid.viewConfig = {};
        }
        me.toGrid.viewConfig.emptyText = me.blankText;
        me.toGrid.viewConfig.deferEmptyText = false;

        me.fromField = me.createFromGrid();
        me.toField = me.createList(me.toGrid);

        var toStore = me.toField.store;
        toStore.on('add', this.add2SelectedStore, this);

        return [
            me.fromField,
            {
                xtype: 'container',
                margins: '0 4',
                flex: 0,
                layout: {
                    type: 'vbox',
                    pack: 'center'
                },
                items: me.createButtons()
            },
            me.toField
        ];
    },
    /**
     * @private
     *
     * The selected model can have more fields than the available model.
     * So add missing fields and their default values to newly selected records.
     */
    add2SelectedStore: function(store, recs) {
        var defaultRec = Ext.create(store.model);

        recs.forEach(function(rec) {
            defaultRec.fields.each(function(field) {
                if (!(field.name in rec.fields.keys)) {
                    rec.fields.add(field);
                }
                if (!(field.name in rec.data)) {
                    rec.set(field.name, field.defaultValue);
                }
            });
        });
    },
    /**
     * Get the selected records from the specified list.
     *
     * Records will be returned *in store order*, not in order of selection.
     * @param {Ext.grid.Panel} list The list to read selections from.
     * @return {Ext.data.Model[]} The selected records in store order.
     *
     */
    getSelections: function(list) {
        var store = list.getStore();

        return Ext.Array.sort(list.getSelectionModel().getSelection(), function(a, b) {
            a = store.indexOf(a);
            b = store.indexOf(b);

            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        });
    },

    onTopBtnClick : function() {
        var list = this.toField,
            store = list.getStore(),
            selected = this.getSelections(list);

        store.suspendEvents();
        store.remove(selected, true);
        store.insert(0, selected);
        store.resumeEvents();
        list.getSelectionModel().select(selected);
        this.syncValue();
    },

    onBottomBtnClick : function() {
        var list = this.toField,
            store = list.getStore(),
            selected = this.getSelections(list);

        store.suspendEvents();
        store.remove(selected, true);
        store.add(selected);
        store.resumeEvents();
        list.getSelectionModel().select(selected);
        this.syncValue();
    },

    onUpBtnClick : function() {
        var list = this.toField,
            store = list.getStore(),
            selected = this.getSelections(list),
            rec,
            i = 0,
            len = selected.length,
            index = 0;

        // Move each selection up by one place if possible
        store.suspendEvents();
        for (; i < len; ++i, index++) {
            rec = selected[i];
            index = Math.max(index, store.indexOf(rec) - 1);
            store.remove(rec, true);
            store.insert(index, rec);
        }
        store.resumeEvents();
        list.getSelectionModel().select(selected);
        this.syncValue();
    },

    onDownBtnClick : function() {
        var list = this.toField,
            store = list.getStore(),
            selected = this.getSelections(list),
            rec,
            i = selected.length - 1,
            index = store.getCount() - 1;

        // Move each selection down by one place if possible
        store.suspendEvents();
        for (; i > -1; --i, index--) {
            rec = selected[i];
            index = Math.min(index, store.indexOf(rec) + 1);
            store.remove(rec, true);
            store.insert(index, rec);
        }
        store.resumeEvents();
        list.getSelectionModel().select(selected);
        this.syncValue();
    },

    onAddBtnClick : function() {
        var me = this,
            selected = me.getSelections(me.fromField);

        me.moveRec(true, selected);
        me.toField.getSelectionModel().select(selected);
    },

    onRemoveBtnClick : function() {
        var me = this,
            selected = me.getSelections(me.toField);

        me.moveRec(false, selected);
        me.fromField.getSelectionModel().select(selected);
    },
    onSelectedDrop: function() {
        this.syncValue();
    },
    onAvailableDrop: function() {
        this.syncValue();
    },
    moveRec: function(add, recs) {
        var me = this,
            fromField = me.fromField,
            toField   = me.toField,
            fromStore = add ? fromField.store : toField.store,
            toStore   = add ? toField.store   : fromField.store;

        fromStore.remove(recs);
        toStore.add(recs);
        me.syncValue();
    },

    onItemDblClick: function(view, rec) {
        this.moveRec(view === this.fromField.getView(), rec);
    },

    setValue: function(value) {
        var me = this;
        var fromStore = this.fromField.store;
        var toStore = this.toField.store;

        if (fromStore.getTotalCount()+toStore.getTotalCount() == 0) {
            // fromStore isn't loaded yet, set value after load
            fromStore.addListener('load', function() {
                me.setValue(value);
            }, me, {single: true});
            return;
        }

        // move all previously selected items back to available
        Ext.Array.forEach(toStore.getRange(), function(rec){
            toStore.remove(rec);
            fromStore.add(rec);
        });
        // add value items to selected
        Ext.Array.forEach(value, function(rec){
            if (!(rec.$className)) {
                // convert data to record
                rec = Ext.create(Ext.ModelManager.getModel(toStore.model), rec);
            }
            // If in the from store, move it over
            var fromId = fromStore.data.indexOfKey(rec.getId());
            if (fromId > -1) {
                fromStore.removeAt(fromId);
            }
            toStore.add(rec);
        });
        this.syncValue();
    },
    // Synchronizes the submit value with the current state of the toStore
    syncValue: function() {
        var me = this;
        me.mixins.field.setValue.call(me, me.setupValue(me.toField.store.getRange()));
    },

    onBindStore: function(store, initial) {
        var me = this;

        if (me.fromField) {
            me.fromField.store.removeAll();
            me.toField.store.removeAll();

            // Add everything to the from field as soon as the Store is loaded
            if (store.getCount()) {
                me.populateFromStore(store);
            } else {
                me.store.on('load', me.populateFromStore, me);
            }
        }
    },

    populateFromStore: function(store) {
        var fromStore = this.fromField.store;

        // Flag set when the fromStore has been loaded
        this.fromStorePopulated = true;

        fromStore.add(store.getRange());

        // setValue waits for the from Store to be loaded
        fromStore.fireEvent('load', fromStore);
    },

    onEnable: function(){
        var me = this;

        me.callParent();
        me.fromField.enable();
        me.toField.enable();

        Ext.Array.forEach(me.query('[navBtn]'), function(btn){
            btn.enable();
        });
    },

    onDisable: function(){
        var me = this;

        me.callParent();
        me.fromField.disable();
        me.toField.disable();

        Ext.Array.forEach(me.query('[navBtn]'), function(btn){
            btn.disable();
        });
    },

    onDestroy: function(){
        this.bindStore(null);
        this.callParent();
    },
    setupValue: function(value){
        return value.map(function(r) {
            return r.data;
        });
    },
    getValue: function(){
        return this.setupValue(this.toField.store.data.items) || [];
    },
    /**
     * Returns the value that would be included in a standard form submit for this field.
     *
     * @return {String} The value to be submitted, or `null`.
     */
    getSubmitValue: function() {
        return Ext.JSON.encode(this.getValue());
    },
    isValid : function() {
        var me = this,
            disabled = me.disabled,
            validate = me.forceValidation || !disabled;

        return validate ? me.validateValue(me.value) : disabled;
    },

    validateValue: function(value) {
        var me = this,
            errors = me.getErrors(value),
            isValid = Ext.isEmpty(errors);

        if (!me.preventMark) {
            if (isValid) {
                me.clearInvalid();
            } else {
                me.markInvalid(errors);
            }
        }
        return isValid;
    },

    markInvalid : function(errors) {
        // Save the message and fire the 'invalid' event
        var me = this,
            oldMsg = me.getActiveError();
        me.setActiveErrors(Ext.Array.from(errors));
        if (oldMsg !== me.getActiveError()) {
            me.updateLayout();
        }
    },
    /**
     * Clear any invalid styles/messages for this field.
     *
     * __Note:__ this method does not cause the Field's {@link #validate} or {@link #isValid} methods to return `true`
     * if the value does not _pass_ validation. So simply clearing a field's errors will not necessarily allow
     * submission of forms submitted with the {@link Ext.form.action.Submit#clientValidation} option set.
     */
    clearInvalid : function() {
        // Clear the message and fire the 'valid' event
        var me = this,
            hadError = me.hasActiveError();
        me.unsetActiveError();
        if (hadError) {
            me.updateLayout();
        }
    },

    getErrors: function(value) {
        var me = this;
        var errors = [];
        value = Ext.Array.from(value || me.getValue());
        numSelected = value.length;

        if (!me.allowBlank && numSelected < 1) {
            errors.push(me.blankText);
        }
        return errors;
    }
});

