# cmpe483hw1
In this project, we developed two smart contracts based on ERC721 token.

## Legal Entity Verification Contract
First contract is LegalEntityVerification.sol for State. This contract has 2 fields:
- `mapping(address=>bool) verifiedAddresses` : This mapping returns true or false based on if given address is verified or not.
- `address public stateAuthority` : Address of the state, it's public since all manufacturers have to know and access that.

This contract has 2 functions:
- `verify(address _address)` : A void function. If `msg.sender` is the state address and given `_address` is not verified before, maps `_address` as `true` in `verifiedAddresses`.
- `isVerified(address _address)` : If `_address` is verified before, returns `true`. Else, returns `false`.

## Provenance Contract
Second contract is Provenance.sol. This contract has 5 fields:
-  `uint256 public serialId` : Serial Product id. Starts with 0. Increments by one in every mint.
-  `address public factory` : Address of the factory.
-  `address public legalEntityContractAddress` : Address of state contract.
-  `mapping(uint256=>address[]) owners` : holds information of all owners' addresses in order. First owner's address is `owners[0]`.
-  `mapping(uint256=>Product) products` : Holds the information about the product. When we mint a token, we are mapping an instance of the `Product` struct to have more information about the product.

This contract has 5 functions: 
- `mintProductToken(uint256 _zipCode)` : If address is authorized by state, mints the token by using _safeMint(msg.sender,productId) function of ERC721. Adds the factory address to the owners, and increments serialID by one.
- `getTheOriginAddress(uint256 _tokenId)` : returns the first owner of that token.
- `approveOwnership(uint256 _tokenId)` : When we transfer a token, maybe the receiver might not be aware that a token is sended to her. In depth, she might not even want to own the token, so we have to provide a solution for the receiver that she will approve or not approve the ownership of the token whenever she is aware of the transaction.
- `transferToken(address _from,address _to, uint256 _tokenId)` : Transfers the token which has given `tokenId` by using  `_transfer(_from,_to,_tokenId)` function of ERC721.


## Example Workflow
A simple flow happens as follow:

- The state contract is initiated.
- Provenance contracts are initiated with the address of the state contract deployed.
- Tokens are minted by `mintProductToken` function.
- Tokens can be transferred by `transferToken` function.
- If receiver accepts the transferred token, she approves the ownership with `approveOwnership` function and she becomes the new owner of the token. Else, the token's ownership history will not show the latest address who received the token.

# Q&A:
 - How to ensure there is only one state? : We pass the address of the deployed state authority to the Provenance constructor, meaning that only state we will listen is the one with given address.
 - How to ensure no token has two owners at the same time? : ERC721 handles it.
 - How to ensure no approved token minted? : Mint token function does not start if token is not approved. @MEETINGSUBJECT
 - How to ensure external contracts don't get the `address` - `tokenId` combination at the same time? Is it required : @MEETINGSUBJECT
// Gas fees can be written on the end of each function description. @MEETINGSUBJECT