describe('NLeSC.eEcology.store.TrackerIds', function() {
    'use strict';

    var instance, esj = ExtSpec.Jasmine;

    beforeEach(function() {
        this.addMatchers(esj.Matchers);
        instance = ExtSpec.create('NLeSC.eEcology.store.TrackerIds', function() {
            ExtSpec.Jasmine.createConfigSpies(this);
        });
    });

    it("fields", function() {
				expect(instance.fields).toEqual([{name: 'id', type: 'int'}]);
    });
});
