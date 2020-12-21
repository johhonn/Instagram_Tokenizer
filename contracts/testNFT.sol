pragma solidity ^0.6.0;

import "./openzeppelin/token/ERC721/ERC721.sol";

contract testNFT is ERC721 {
    constructor() public ERC721("MyNFT", "MNFT") {}

    uint256 public total;

    function mint(address to, string memory uri) public {
        total = total + 1;
        _mint(to, total);
        _setTokenURI(total, uri);
    }
}
