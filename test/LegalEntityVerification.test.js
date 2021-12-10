const legalEntityVerification = artifacts.require("LegalEntityVerification");

contract("LegalEntityVerification",async (accounts)=>{
    let addressToBeVerified;
    let _legalEntityVerification;
    beforeEach(async ()=>{
        addressToBeVerified = accounts[1];
        _legalEntityVerification = await legalEntityVerification.new();
    })
    it("should verify an address that is not verified",async ()=>{

        assert(!(await _legalEntityVerification.isVerified(addressToBeVerified)),"Address is already verified !");

        await _legalEntityVerification.verify(addressToBeVerified);
        assert(await _legalEntityVerification.isVerified(addressToBeVerified),"The address is not verified !");
    });

    it("should correctly return that whether an address is verified or not",async ()=>{
        await _legalEntityVerification.verify(addressToBeVerified);

        assert.equal(true,await _legalEntityVerification.isVerified(addressToBeVerified),"isVerified() should have returned true!");

    });
})
