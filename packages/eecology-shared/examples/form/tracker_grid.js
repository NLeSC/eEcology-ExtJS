Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': '../../../../ext/src/ux',
    }
});

Ext.require(['Ext.ux.grid.FiltersFeature', 'NLeSC.eEcology.store.Trackers',
        'NLeSC.eEcology.form.field.TrackerGrid']);

Ext.onReady(function() {
    Ext.QuickTips.init();

    var tracker_store = Ext.create('NLeSC.eEcology.store.Trackers');
    tracker_store.proxy.url = '../data/trackers.json';

    var species_store = Ext.create('NLeSC.eEcology.store.Species');
    species_store.proxy.url = '../data/species.json';

    var project_store = Ext.create('NLeSC.eEcology.store.Projects');
    project_store.proxy.url = '../data/projects.json';

    Ext.create('Ext.form.Panel', {
        renderTo: 'grid-example',
        height: 350,
        width: 800,
        bodyPadding: '5 5 0',
        items: [{
            xtype: 'trackergridfield',
            width: 400
        }],
        buttons: [{
            text: 'Submit',
            handler: function() {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    console.log(form.getValues());
                } else {
                    console.log('Invalid form');
                }
            }
        },{
            text: 'Reset',
            handler: function() {
                this.up('form').getForm().reset();
            }
       },{
            text: 'Select 355',
            handler: function() {
                this.up('form').getForm().setValues({id:355});
            }
        }]
    });

    tracker_store.load();
});
