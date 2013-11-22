Ext.require(['NLeSC.eEcology.store.Trackers', 'NLeSC.eEcology.form.field.TrackerCombo']);

Ext.onReady(function() {
    Ext.QuickTips.init();

    var tracker_store = Ext.create('NLeSC.eEcology.store.Trackers');
    tracker_store.proxy.url = '../data/trackers.json';

    Ext.create('NLeSC.eEcology.form.field.TrackerCombo', {
        renderTo: 'grid-example'
    });
});