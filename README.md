# cmpe483hw1
In this project, we developed two smart contracts based on ERC721 token. 
First contract is LegalEntityVerification.sol for State. This contract has 2 fields:
- mapping(address=>bool) verifiedAddresses -> This mapping returns true or false based on if given address is verified or not.
- address public stateAuthority -> Address of the state, it's public since all manufacturers have to know and access that.

This contract has 2 functions:
- verify(address _address) -> void function. If message sender is state and given address is not verified before, maps this address as true in verifiedAdresses.
- isVerified(address _address) -> If address is verified before, returns true. Else, returns false.

Second contract is Provenance.sol. This contract has 5 fields:
-  uint256 public serialId -> Unique field for every contract. Starts with 0.
-  address public factory -> address of factory.
-  address public legalEntityContractAddress -> address of contract.
-  mapping(uint256=>address[]) owners -> holds information of all owners' adresses in order. First owner's adress is owners[0].
-  mapping(uint256=>Product) products -> ...

This contract has 5 functions: 
- mintProductToken(uint256 _zipCode) -> If address is authorized by state, mints the token by using _safeMint(msg.sender,productId) function of ERC721. Adds the factory address to the owners, and increments serialID by one.
- getTheOriginAddress(uint256 _tokenId) -> returns the first owner of that token.
- approveOwnership(uint256 _tokenId) -> ..
- transferToken(address _from,address _to, uint256 _tokenId) -> Transfers the token which has given tokenId by using _transfer(_from,_to,_tokenId) function of ERC721.
- getProduct(uint productId) -> ...

A simple flow happens as follow:

- The state contract is initiated.
- Provenance contracts are initiated.
- Tokens are minted by mintProductToken function.
- Tokens can be transferred by transferToken function.
- If receiver accepts the transferred token, it becomes the new owner of the token. Else, the token will not have any owner.

// Questions !
 - How to ensure there is only one state? -> ?
 - How to ensure no token has two owners at the same time? -> transfer handles it.
 - How to ensure no approved token minted? -> Mint token function does not start if token is not approved.
 - How to ensure external contracts don't get the address - tokenId combination at the same time? Is it required -> ? 
// Gas fees can be written on the end of each function description.