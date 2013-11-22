Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': '../../../../ext/src/ux'
    }
});

Ext.require(['Ext.ux.grid.FiltersFeature', 'NLeSC.eEcology.store.Trackers',
        'NLeSC.eEcology.form.field.Color',
        'NLeSC.eEcology.form.field.TrackerSelector']);

Ext.onReady(function() {
    Ext.QuickTips.init();

    var tracker_store = Ext.create('NLeSC.eEcology.store.Trackers');
    tracker_store.proxy.url = '../data/trackers.json';

    var species_store = Ext.create('NLeSC.eEcology.store.Species');
    species_store.proxy.url = '../data/species.json';

    var project_store = Ext.create('NLeSC.eEcology.store.Projects');
    project_store.proxy.url = '../data/projects.json';

    Ext.define('ColoredTracker', {
        extend: 'NLeSC.eEcology.model.Tracker',
        fields: [{
            name: 'color',
            defaultValue: 'FFFF50'
        }, {
            name: 'size',
            defaultValue: 'small'
        }, {
            name: 'speed',
            defaultValue: 4
        }]
    });

    var colors = ['FFFF50', 'F7E8AA', 'FFA550', '5A5AFF', 'BEFFFF', '8CFF8C',
            'FF8CFF', 'AADD96', 'FFD3AA', 'C6C699', 'E5BFC6', 'DADADA',
            'C6B5C4', 'C1D1BF', '000000'];

    var sstore = Ext.create('Ext.data.Store', {
        model: 'ColoredTracker',
        listeners: {
            add: function(s, records) {
                // Cycle through colors when selecting a tracker
                records.forEach(function(record) {
                    if (!('color' in record.data)) {
                        record.set('color',
                                colors[record.index % colors.length]);
                    }
                });
            }
        }
    });

    var selected_trackers = {
        title: 'Selected',
        store: sstore,
        columns: [{
            text: "ID",
            flex: 1,
            sortable: true,
            dataIndex: 'id'
        }, {
            text: "Species",
            flex: 1,
            sortable: true,
            dataIndex: 'species',
            hidden: true
        }, {
            text: "Project",
            flex: 1,
            sortable: true,
            dataIndex: 'project',
            hidden: true
        }, {
            text: "Base color",
            flex: 1,
            sortable: true,
            dataIndex: 'color',
            editor: {
                xtype: 'colorfield',
                pickerCls: 'color-picker16',
                colors: colors
            },
            renderer: function(v, m) {
                m.style = 'cursor: pointer;background: #' + v;
                return v;
            }
        }, {
            text: "Size",
            flex: 1,
            sortable: true,
            dataIndex: 'size',
            editor: {
                xtype: 'combo',
                forceSelection: true,
                store: ['small', 'medium', 'large']
            }
        }, {
            text: "Speed class",
            flex: 1,
            sortable: true,
            dataIndex: 'speed',
            editor: {
                xtype: 'combo',
                forceSelection: true,
                store: [1, 2, 3, 4]
            }
        }],
        multiSelect: false, // Editing is weird with multiselect=true
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            triggerEvent: 'cellclick'
        })],
        viewConfig: {
            markDirty: false
        }
    };

    Ext.create('Ext.form.Panel', {
        renderTo: 'grid-example',
        height: 350,
        width: 800,
        bodyPadding: '5 5 0',
        items: [{
            xtype: 'trackergridselector',
            buttons: ['add', 'remove'],
            toGrid: selected_trackers
        }],
        buttons: [{
            text: 'Save',
            handler: function() {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    console.log(form.getFieldValues());
                } else {
                    console.log('Invalid form');
                }
            }
        }, {
            text: 'Cancel',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }]
    });

    Ext.create('Ext.form.Panel', {
        renderTo: 'default-selector',
        height: 350,
        width: 800,
        bodyPadding: '5 5 0',
        items: [{
            xtype: 'trackergridselector'
        }],
        buttons: [{
            text: 'Save',
            handler: function() {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    console.log(form.getFieldValues());
                } else {
                    console.log('Invalid form');
                }
            }
        }, {
            text: 'Cancel',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }]
    });

    tracker_store.load();
});