import EmberObject from '@ember/object';
import ResponsiveMixin from 'lights-out/mixins/responsive';
import { module, test } from 'qunit';

module('Unit | Mixin | responsive');

// Replace this with your real tests.
test('It works', function(assert) {
    let ResponsiveObject = EmberObject.extend(ResponsiveMixin);
    let subject = ResponsiveObject.create();
    assert.ok(subject);
});