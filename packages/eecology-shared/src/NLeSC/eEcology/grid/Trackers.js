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
 * Grid of filterable trackers.
 */
Ext.define('NLeSC.eEcology.grid.Trackers', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.trackersgrid',
    requires: ['NLeSC.eEcology.store.Projects', 'NLeSC.eEcology.store.Species',
            'NLeSC.eEcology.store.Trackers', 'Ext.ux.grid.FiltersFeature'],
    features: [{
        ftype: 'filters',
        local: true
    }],
    store: 'trackers',
    columns: [{
        text: "ID",
        sortable: true,
        dataIndex: 'id',
        filter: {
            type: 'numeric'
        }
    }, {
        text: "Species",
        flex: 1,
        sortable: true,
        dataIndex: 'species',
        filter: {
            type: 'list',
            store: 'species'
        }
    }, {
        text: "Project",
        flex: 1,
        sortable: true,
        dataIndex: 'project',
        filter: {
            type: 'list',
            store: 'projects'
        }
    }],
    initComponent: function() {
        if (!Ext.StoreManager.lookup('trackers')) {
            Ext.create('NLeSC.eEcology.store.Trackers');
        }
        if (!Ext.StoreManager.lookup('projects')) {
            Ext.create('NLeSC.eEcology.store.Projects');
        }
        if (!Ext.StoreManager.lookup('species')) {
            Ext.create('NLeSC.eEcology.store.Species');
        }

        // Convert store identifiers to actual stores
        this.columns.forEach(function(c) {
            if ('filter' in c && 'store' in c.filter && typeof c.filter.store === 'string') {
                c.filter.store = Ext.StoreManager.lookup(c.filter.store);
            }
        });
        this.callParent();
    }
});