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
describe('NLeSC.eEcology.form.field.TrackerGrid', function() {
    'use strict';

    var instance = null, esj = ExtSpec.Jasmine;
    var model = null, selection = null, store = null;

    beforeEach(function() {
        this.addMatchers(esj.Matchers);
        instance = ExtSpec.create('NLeSC.eEcology.form.field.TrackerGrid', function() {
            ExtSpec.Jasmine.createConfigSpies(this);
        });
        model = {
                hasSelection: function() {return selection !== null;},
                getSelection: function() {return selection;},
                select: function(value) {selection = value;},
                getStore: function() {return store;}
        };
        instance.grid.selModel = model;
    });

    it("fieldLabel", function() {
        expect(instance.fieldLabel).toEqual('Tracker');
    });

    it('name', function() {
        expect(instance.name).toEqual('id');
    });

    it("getSelectionModel", function() {
        instance.grid.selModel = 'mymodel';
        expect(instance.getSelectionModel()).toEqual('mymodel');
    });

    describe('getValue', function() {

       it('no selection', function() {
          var result = instance.getValue();

          expect(result).toBeNull();
       });

       it('one selected', function() {
           selection = [{
               getId: function() {return 1234;}
           }];

           var result = instance.getValue();

           expect(result).toBe(1234);
       });
    });
});
