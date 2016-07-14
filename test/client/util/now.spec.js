import now from '../../../src/util/now.js';

describe('utils/now', () => {

    it('should verify that now() returns a timestamp', () => {
        expect(now()).to.be.at.least(0);
    });

});
