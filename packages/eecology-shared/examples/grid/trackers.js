Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': '../../../../ext/src/ux',
    }
});

Ext.require(['NLeSC.eEcology.grid.Trackers',
             'Ext.ux.grid.FiltersFeature'
             ]);

Ext.onReady(function() {
    Ext.QuickTips.init();

    var tracker_store = Ext.create('NLeSC.eEcology.store.Trackers');
    tracker_store.proxy.url = '../data/trackers.json';

    var species_store = Ext.create('NLeSC.eEcology.store.Species');
    species_store.proxy.url = '../data/species.json';

    var project_store = Ext.create('NLeSC.eEcology.store.Projects');
    project_store.proxy.url = '../data/projects.json';

    Ext.create('NLeSC.eEcology.grid.Trackers', {
        renderTo: 'grid-example',
        height: 350,
        width: 600
    });

    tracker_store.load();
});