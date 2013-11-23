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
 * Grid of trackers as form field. Must select a tracker to be valid.
 */
Ext.define('NLeSC.eEcology.form.field.TrackerGrid', {
    extend: 'Ext.form.FieldContainer',
    requires: ['NLeSC.eEcology.grid.Trackers'],
    mixins: {
        field: 'Ext.form.field.Field'
    },
    /**
     * Grid to show.
     */
    grid: {
        xtype: 'trackersgrid'
    },
    alias: 'widget.trackergridfield',
    fieldLabel: 'Tracker',
    name: 'id',
    /**
     * @cfg {blankText} string
     *
     * Error text to display if no tracker is selected.
     */
    blankText: 'No tracker selected',
    msgTarget: 'under',
    defaults: {flex: 1},
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    autoWidth: true,
    height: 300,
    initComponent: function() {
        this.grid.selModel = Ext.create('Ext.selection.CheckboxModel', {
            mode: 'SINGLE',
            showHeaderCheckbox: false
        });
        this.grid.selModel.on('selectionchange', this.onSelectionChange, this);
        this.items = [this.grid];
        this.callParent();
        this.initField();
    },
    getSelectionModel: function() {
        return this.grid.selModel;
    },
    getValue: function() {
        var model =  this.getSelectionModel();
        if (model.hasSelection()) {
            return model.getSelection()[0].getId();
        }
        return null;
    },
    setValue: function(value) {
        var model =  this.getSelectionModel();
        var store = model.getStore();
        if (store === undefined) {
            // Unable to setValue, store not initiated yet
            return;
        }
        var record = store.getById(value);
        model.select(record);
        this.mixins.field.setValue.call(this, value);
    },
    getErrors: function() {
        var value = this.getValue();
        if (value === null) {
            return [this.blankText];
        }
        return [];
    },
    reset: function() {
        var model =  this.getSelectionModel();
        model.deselectAll();
    },
    onSelectionChange: function(model, selections) {
        if (selections.length > 0) {
            this.setValue(selections[0].getId());
        }
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
     * @private
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
    }
});
