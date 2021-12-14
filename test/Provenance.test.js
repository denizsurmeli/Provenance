const { assert } = require("chai");

const provenance = artifacts.require("Provenance");
const legalEntityVerification = artifacts.require("LegalEntityVerification");


contract("Provenance contract", async (accounts) =>{ 
    let _legalEntityVerification;
    let levAddress;
    let _provenance;
    let factoryAddress;
    let stateAddress;

    beforeEach(async ()=>{
        _legalEntityVerification = await legalEntityVerification.new();
        levAddress = await _legalEntityVerification.address;
        _provenance = await provenance.new("TestProvenance","TPVN",levAddress);
        factoryAddress = await _provenance.getFactoryAddress();
        stateAddress = await _legalEntityVerification.getStateAuthorityAddress();   
    })
    it("should mints a product token and assign it to factory address",
    async ()=>{
        await _provenance.mintProductToken(34357);
        assert.equal(factoryAddress,await _provenance.ownerOf(0),"Token should have been owned by the factory address.");
    });

    it("should transfer tokens to only verified addresses",async ()=>{
        const verifiedAddress = accounts[2];
        const unverifiedAddress = accounts[3];

        await _legalEntityVerification.verify(verifiedAddress);

        // mint two tokens for testing

        await _provenance.mintProductToken(34357);
        await _provenance.mintProductToken(34355);

        await _provenance.transferToken(factoryAddress,verifiedAddress,0);
        await _provenance.approveOwnership(0,{from:verifiedAddress});
        try{
            await _provenance.transferToken(factoryAddress,unverifiedAddress,1);
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it("should correctly walk the path of transferred address and correctly show the origin of the token",async ()=>{
        const path = accounts;
        path.map(async a=>await _legalEntityVerification.verify(a));

        //mint a token
        await _provenance.mintProductToken(123123);


        for(let i=0;i<path.length-1;i++){
            await _provenance.transferToken(path[i],path[i+1],0);
            await _provenance.approveOwnership(0,{from:path[i+1]});
        }

        let contractReturnedOwners = await _provenance.getAllOwners(0);
        assert.equal(path.length,contractReturnedOwners.length,"Path lengths are different !");
        for(let i =0;i<path.length;i++){
            assert.equal(path[i],contractReturnedOwners[i],"Every address at index <i> must be equal !");
        };
        assert.equal(await _provenance.getTheOriginAddress(0),path[0],"Origin addresses must be equal");

    });

    it("should not transfer a non-minted token",async () =>{
        let account = accounts[2];
        _legalEntityVerification.verify(account);
        try{
            await _provenance.transferToken(accounts[1],account,0);
            assert(false);
        }catch(err){
            assert(err)
        }
    });

    it("should only allow the factory to mint tokens and not anyone else.",async ()=>{
        try{
            await _provenance.mintProductToken(342342); // by default, the caller of the function is the deployer.
            assert(true);
        }catch(err){
            assert(false);
        }
        
        try{
            await _provenance.mintProductToken(234,{from:accounts[3]});
            assert(false);
        }catch(err){
            assert(err);
        }
    });
    it("should not show the address in owners array if the token is not approved",async()=>{
        let account = accounts[1];

        await _legalEntityVerification.verify(account);
        await _provenance.mintProductToken(123);
        await _provenance.transferToken(accounts[0],account,0);

        let lastOwner = await _provenance.getAllOwners[-1];
        assert(lastOwner != account,"account did not approve the token, it should not be seen as the last owner");
    })
})