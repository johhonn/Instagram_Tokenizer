pragma solidity ^0.6.0;

contract purchase {
    event purchase(address from, string data);

    function createNFT(string memory link) public payable {
        emit purchase(msg.sender, link);
    }
}
