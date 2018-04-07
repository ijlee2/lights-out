// Ember-related packages
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { debounce } from '@ember/runloop';

// Miscellaneous
import $ from 'jquery';

const MAX_MOBILE_SCREEN_SIZE = 600;
const MAX_TABLET_SCREEN_SIZE = 840;

export default Mixin.create({
    init() {
        this._super(...arguments);

        this.set('elementIdentifier', '#game');
    },

    didInsertElement() {
        this._super(...arguments);

        this.addResizeListener();
    },

    willDestroyElement() {
        this.removeResizeListener();
    },


    /*************************************************************************************

        Create a responsive window

    *************************************************************************************/
    // Step 1. Set the width of the container. Then, scale everything relative to the
    // width of the container.
    containerWidth: computed('elementIdentifier', function() {
        return this.$(this.get('elementIdentifier')).width();
    }),

    normalizationFactor: computed('containerWidth', function() {
        const containerWidth = this.get('containerWidth');

        if (containerWidth < MAX_MOBILE_SCREEN_SIZE) return containerWidth / 576;
        else if (containerWidth < MAX_TABLET_SCREEN_SIZE) return containerWidth / 896;
        else return containerWidth / 1280;
    }),

    // Step 2. Set the button size
    buttonSize: computed('normalizationFactor', function() {
        return 100 * this.get('normalizationFactor');
    }),

    // Step 3. Set the width and height of the board
    width: computed('numButtons.x', 'buttonSize', function() {
        return this.get('numButtons.x') * this.get('buttonSize');
    }),

    height: computed('numButtons.y', 'buttonSize', function() {
        return this.get('numButtons.y') * this.get('buttonSize');
    }),

    // Step 4. Set the margin around the board (in pixels). This is equal to the padding
    // inside the container.
    margin: computed('normalizationFactor', 'containerWidth', 'width', function() {
        const normalizationFactor = this.get('normalizationFactor');
        const remainingWidth      = this.get('containerWidth') - this.get('width');

        return {
            top   : 25  * normalizationFactor,
            right : 0.5 * remainingWidth,
            bottom: 25  * normalizationFactor,
            left  : 0.5 * remainingWidth,
        };
    }),

    // Step 5. Set the height of the container
    containerHeight: computed('height', 'margin.{top,bottom}', function() {
        return this.get('height') + this.get('margin.top') + this.get('margin.bottom');
    }),


    /*************************************************************************************

        Listen to window resize

    *************************************************************************************/
    addResizeListener() {
        const _resizeHandler = () => {
            debounce(this, this.updateContainerSize, 200);
        };

        $(window).on(`resize.${this.get('elementIdentifier')}`, _resizeHandler);
    },

    removeResizeListener() {
        $(window).off(`resize.${this.get('elementIdentifier')}`);
    },

    updateContainerSize() {
        this.notifyPropertyChange('containerWidth');
        this.drawGame();
    }
});