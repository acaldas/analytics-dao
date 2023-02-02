// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./UserFileAccess.sol";

contract ERC721UserFile is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    UserFileAccess
{
    constructor() ERC721("LytUserFile", "LytF") {}

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    mapping(uint256 => uint64) private _tokenDealIds;

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mint(address to, string memory _tokenURI) public onlyOwner {
        _safeMint(to, _tokenIdTracker.current());
        _setTokenURI(_tokenIdTracker.current(), _tokenURI);
        _tokenIdTracker.increment();
    }

    function tokenDealId(uint256 tokenId) public view returns (uint64) {
        _requireMinted(tokenId);

        return _tokenDealIds[tokenId];
    }

    function _setDealId(uint256 tokenId, uint64 _tokenDealId) public onlyOwner {
        require(_exists(tokenId), "DealId set of nonexistent token");
        _tokenDealIds[tokenId] = _tokenDealId;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function _distributeEarnings(
        uint256 _tokenId,
        uint256 _price
    ) internal override(UserFileAccess) {
        require(msg.value >= _price);
        address payable _owner = payable(ownerOf(_tokenId));
        _owner.transfer(_price);

        // TREASURY FEE
        // STORAGE PROVIDER FEE
    }

    function _withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
