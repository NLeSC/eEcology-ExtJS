Ext.require(['NLeSC.eEcology.store.Trackers',
        'NLeSC.eEcology.form.field.TrackerCombo']);

Ext.onReady(function() {
    Ext.QuickTips.init();

    var tracker_store = Ext.create('NLeSC.eEcology.store.Trackers');
    tracker_store.proxy.url = '../data/trackers.json';

    Ext.create('NLeSC.eEcology.form.field.TrackerCombo', {
        renderTo: 'grid-example'
    });

    var tpl = Ext.create('Ext.XTemplate', '<tpl for=".">',
            '<div class="x-boundlist-item">{id}, {species} - {project}</div>',
    '</tpl>');

    var dtpl = Ext.create('Ext.XTemplate', '<tpl for=".">',
            '{id}, {species} - {project}',
    '</tpl>');

    Ext.create('NLeSC.eEcology.form.field.TrackerCombo', {
        renderTo: 'custom',
        width: 300,
        tpl: tpl,
        displayTpl: dtpl
    });

});