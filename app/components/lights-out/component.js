import Component from '@ember/component';
import ResponsiveMixin from 'lights-out/mixins/responsive';

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
});