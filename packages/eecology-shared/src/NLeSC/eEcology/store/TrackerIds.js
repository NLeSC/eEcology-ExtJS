Ext.define('NLeSC.eEcology.store.TrackerIds', {
    extend: 'Ext.data.Store',
    fields: [{name: 'id', type: 'int'}],
    proxy: {
        type: 'ajax',
        url : '../../trackers.json',
        reader: {
            root: 'trackers',
            type: 'json'
        },
        writer: 'json'
    },
    sorters: [{
         property: 'id',
         direction: 'ASC'
    }],
    autoLoad: true
});
