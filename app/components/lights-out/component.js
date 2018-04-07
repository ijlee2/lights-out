// Ember-related packages
import Component from '@ember/component';
import { computed } from '@ember/object';
import ResponsiveMixin from 'lights-out/mixins/responsive';

// D3-related packages
import { scaleLinear } from 'd3-scale';

export default Component.extend(ResponsiveMixin, {
    /*************************************************************************************

        Initialize the component

    *************************************************************************************/
    init() {
        this._super(...arguments);

        // Set game properties
        this.set('numButtons', {x: 5, y: 5});
        this.set('numMoves', 0);

        // Create an array of buttons
        //
        //        j  ->                                        (x)
        //     --------------------------------------------------------
        //  i  |          |          |          |          |          |
        //     |  (0, 0)  |  (0, 1)  |  (0, 2)  |  (0, 3)  |  (0, 4)  |
        //  |  |          |          |          |          |          |
        //  V  --------------------------------------------------------
        //     |          |          |          |          |          |
        //     |  (1, 0)  |  (1, 1)  |  (1, 2)  |  (1, 3)  |  (1, 4)  |
        //     |          |          |          |          |          |
        //     --------------------------------------------------------
        //     |          |          |          |          |          |
        //     |  (2, 0)  |  (2, 1)  |  (2, 2)  |  (2, 3)  |  (2, 4)  |
        //     |          |          |          |          |          |
        //     --------------------------------------------------------
        //     |          |          |          |          |          |
        //     |  (3, 0)  |  (3, 1)  |  (3, 2)  |  (3, 3)  |  (3, 4)  |
        //     |          |          |          |          |          |
        //     --------------------------------------------------------
        //     |          |          |          |          |          |
        // (y) |  (4, 0)  |  (4, 1)  |  (4, 2)  |  (4, 3)  |  (4, 4)  |
        //     |          |          |          |          |          |
        //     --------------------------------------------------------
        //
        let buttons = [];

        for (let i = 0; i < this.get('numButtons.y'); i++) {
            let rowsOfButtons = [];

            for (let j = 0; j < this.get('numButtons.x'); j++) {
                rowsOfButtons.push({
                    coordinates: {x: j, y: i},
                    isLightOn: false
                });
            }

            buttons.push(rowsOfButtons);
        }

        this.set('buttons', buttons);
    },

    // Place points from left to right in the physical space
    scaleX: computed('numButtons.x', 'width', function() {
        return scaleLinear()
            .domain([0, this.get('numButtons.x')])
            .range([0, this.get('width')]);
    }),

    // Place points from top to bottom in the physical space
    scaleY: computed('numButtons.y', 'height', function() {
        return scaleLinear()
            .domain([0, this.get('numButtons.y')])
            .range([0, this.get('height')]);
    }),
});