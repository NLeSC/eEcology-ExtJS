Ext.define('NLeSC.eEcology.form.field.TrackerCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.trackercombo',
    displayField: 'id',
    allowBlank: false,
    fieldLabel: 'Tracker',
    labelAttrTpl : 'data-qtip="Tracker identifier aka device_info_serial"',
    name: 'id'
});
