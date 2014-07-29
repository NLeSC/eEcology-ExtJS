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
describe('NLeSC.eEcology.form.field.TrackerCombo', function() {
    'use strict';

    var instance = null, esj = ExtSpec.Jasmine;

    beforeEach(function() {
        this.addMatchers(esj.Matchers);
        Ext.StoreManager = jasmine.createSpyObj('StoreManager', ['lookup']);
        Ext.create = jasmine.createSpy('create');
        instance = ExtSpec.create('NLeSC.eEcology.form.field.TrackerCombo', function() {
            this.callParent = jasmine.createSpy('callParent');
            ExtSpec.Jasmine.createConfigSpies(this);
        });
    });

    it('initComponent', function() {
        instance.initComponent();

        expect(Ext.StoreManager.lookup).toHaveBeenCalledWith('trackers');
        expect(Ext.create).toHaveBeenCalledWith('NLeSC.eEcology.store.Trackers');
        expect(instance.callParent).toHaveBeenCalled();
    });

    it("fieldLabel", function() {
        expect(instance.fieldLabel).toEqual('Tracker');
    });

    it('display field', function() {
        expect(instance.displayField).toEqual('id');
    });

    it("store", function() {
        expect(instance.store).toEqual('trackers');
    });
});
