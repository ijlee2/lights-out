import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lights-out', 'Integration | Component | lights out', {
    integration: true
});

test('It renders', function(assert) {
    this.render(hbs`{{lights-out}}`);

    assert.equal(this.$('#message').length, 1, 'The user sees a message.');
    assert.ok(this.$('#message').text().includes('Number of Moves:'), 'The user sees the number of moves made.');

    assert.equal(this.$('#game').length, 1, 'The user sees the game.');
    assert.equal(this.$('#game .buttons > rect').length, 25, 'The user sees 25 buttons.');
});