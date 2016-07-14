import Utils from "../../src/utils.js";

describe('VisSense.Utils', () => {

    it('should verify certain properties for backwards compatibility to >v1.0.0', () => {
        expect(Utils).to.be.ok;
        expect(Utils).to.have.property('now');
        expect(Utils).to.have.property('identity');
    });

});
