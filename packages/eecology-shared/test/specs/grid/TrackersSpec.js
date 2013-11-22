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
describe('NLeSC.eEcology.grid.Trackers', function() {
    'use strict';

    var instance = null, esj = ExtSpec.Jasmine;

    beforeEach(function() {
        this.addMatchers(esj.Matchers);
        instance = ExtSpec.create('NLeSC.eEcology.grid.Trackers', function() {
            this.callParent = jasmine.createSpy('callParent');
            Ext.StoreManager = jasmine.createSpyObj('StoreManager', ['lookup']);
            ExtSpec.Jasmine.createConfigSpies(this);
        });
    });

    it("store", function() {
        expect(instance.store).toEqual('trackers');
    });

    it("initComponent", function() {
        instance.initComponent();

        expect(Ext.StoreManager.lookup).toHaveBeenCalledWith('species');
        expect(Ext.StoreManager.lookup).toHaveBeenCalledWith('projects');
        expect(instance.callParent).toHaveBeenCalled();
    });
});