// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

abstract contract UserFileAccess is Ownable, ERC721Enumerable {
    struct EventCount {
        string host;
        uint256 count;
    }

    uint256 defaultEventPrice = 0.001 ether;
    mapping(uint256 => EventCount[]) userFileEventCount;
    mapping(string => uint256) hostEventPrice;

    mapping(uint256 => mapping(address => bool)) userFileAccess;

    event AddUserFileAccess(uint256 tokenId, address account, uint256 price);

    function addUserFileAccess(uint256 _tokenId) external payable {
        require(
            userFileEventCount[_tokenId].length > 0,
            "File events count not set"
        );
        uint256 _price = this.getUserFilePrice(_tokenId);
        require(msg.value >= _price, "Not enough funds");
        userFileAccess[_tokenId][msg.sender] = true;
        emit AddUserFileAccess(_tokenId, msg.sender, _price);

        _distributeEarnings(_tokenId, _price);
    }

    function addMultipleUserFileAccess(
        uint256[] calldata _tokenIds
    ) external payable {
        (uint256 _totalPrice, uint256[] memory _prices) = this
            .getMultipleUserFilePrice(_tokenIds);
        require(msg.value >= _totalPrice, "Not enough funds for all files");
        for (uint i = 0; i < _tokenIds.length; i++) {
            this.addUserFileAccess{value: _prices[i]}(_tokenIds[i]);
        }
    }

    function _distributeEarnings(
        uint256 _tokenId,
        uint256 _price
    ) internal virtual {}

    function setHostEventPrice(
        string calldata _host,
        uint256 _price
    ) external onlyOwner {
        hostEventPrice[_host] = _price;
    }

    function getHostPrice(
        string calldata _host
    ) external view returns (uint256) {
        uint256 price = hostEventPrice[_host];
        if (price == 0) {
            return defaultEventPrice;
        } else {
            return price;
        }
    }

    function setUserFileEventCount(
        uint256 _tokenId,
        string[] calldata _hosts,
        uint256[] calldata _counts
    ) external onlyOwner {
        require(_hosts.length == _counts.length);
        for (uint i = 0; i < _hosts.length; i++) {
            userFileEventCount[_tokenId].push(
                EventCount(_hosts[i], _counts[i])
            );
        }
    }

    function getUserFilePrice(
        uint256 _tokenId
    ) external view returns (uint256) {
        uint256 _total = 0;
        EventCount[] storage _eventsCount = userFileEventCount[_tokenId];
        for (uint i = 0; i < _eventsCount.length; i++) {
            EventCount storage _eventCount = _eventsCount[i];
            _total += _eventCount.count * this.getHostPrice(_eventCount.host);
        }
        return _total;
    }

    function getMultipleUserFilePrice(
        uint256[] calldata _tokenIds
    ) external view returns (uint256, uint256[] memory) {
        uint256 _total = 0;
        uint256[] memory _prices = new uint256[](_tokenIds.length);
        for (uint i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];
            uint256 _price = this.getUserFilePrice(_tokenId);
            _total += _price;
            _prices[i] = _price;
        }
        return (_total, _prices);
    }

    function hasAccess(
        uint256 _tokenId,
        address _user
    ) external view returns (bool) {
        return
            userFileAccess[_tokenId][_user] || this.ownerOf(_tokenId) == _user;
    }

    function hasAccess(uint256 _tokenId) external view returns (bool) {
        return
            userFileAccess[_tokenId][msg.sender] ||
            this.ownerOf(_tokenId) == msg.sender;
    }

    function getUserFilesAccess(
        address _user
    ) external view returns (uint256[] memory) {
        uint256 _totalSupply = this.totalSupply();
        uint256[] memory _tokenIds = new uint256[](_totalSupply);
        uint256 _index = 0;
        for (uint i = 0; i < _totalSupply; i++) {
            uint256 _tokenId = this.tokenByIndex(i);
            if (
                userFileAccess[_tokenId][_user] == true ||
                this.ownerOf(_tokenId) == _user
            ) {
                _tokenIds[_index] = _tokenId;
                _index++;
            }
        }

        uint256[] memory result = new uint256[](_index);
        for (uint i = 0; i < _index; i++) {
            result[i] = _tokenIds[i];
        }
        return result;
    }
}
