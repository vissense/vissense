import identity from "../../../src/util/identity.js";

describe('utils/identity', () => {

    it('should verify that identity() returns the object passed', () => {
        var a = {
            foo: 'bar'
        };
        expect(identity(a)).to.be.eql(a);
    });

});
