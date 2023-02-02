pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserFileAccess is Ownable {
    struct EventCount {
        bytes host;
        uint256 count;
    }

    uint256 defaultEventPrice = 0.1 ether;
    mapping(uint256 => EventCount[]) userFileEventCount;
    mapping(bytes => uint256) hostEventPrice;

    mapping(uint256 => mapping(address => bool)) userFileAccess;

    event AddUserFileAccess(uint256 tokenId, address account, uint256 price);

    function addUserFileAccess(uint256 _tokenId) public payable {
        require(
            userFileEventCount[_tokenId].length > 0,
            "File events count not set"
        );
        uint256 _price = getUserFilePrice(_tokenId);
        require(msg.value >= _price, "Not enough funds");
        userFileAccess[_tokenId][msg.sender] = true;
        emit AddUserFileAccess(_tokenId, msg.sender, _price);

        _distributeEarnings(_tokenId, _price);
    }

    function _distributeEarnings(
        uint256 _tokenId,
        uint256 _price
    ) internal virtual {}

    function hasUserFileAccess(uint256 _tokenId) public view returns (bool) {
        return userFileAccess[_tokenId][msg.sender];
    }

    function setHostEventPrice(
        bytes memory _host,
        uint256 _price
    ) public onlyOwner {
        hostEventPrice[_host] = _price;
    }

    function getHostPrice(bytes memory _host) public view returns (uint256) {
        uint256 price = hostEventPrice[_host];
        if (price == 0) {
            return defaultEventPrice;
        } else {
            return price;
        }
    }

    function setUserFileEventCount(
        uint256 _tokenId,
        bytes[] calldata _hosts,
        uint256[] calldata _counts
    ) external onlyOwner {
        require(_hosts.length == _counts.length);
        for (uint i = 0; i < _hosts.length; i++) {
            userFileEventCount[_tokenId].push(
                EventCount(_hosts[i], _counts[i])
            );
        }
    }

    function getUserFilePrice(uint256 _tokenId) public view returns (uint256) {
        uint256 _total = 0;
        EventCount[] memory _eventsCount = userFileEventCount[_tokenId];
        for (uint i = 0; i < _eventsCount.length; i++) {
            EventCount memory _eventCount = _eventsCount[i];
            _total += _eventCount.count * getHostPrice(_eventCount.host);
        }
        return _total;
    }

    function getUserFilesPrice(
        uint256[] memory _tokenIds
    ) public view returns (uint256) {
        uint256 _total = 0;
        for (uint i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];
            _total += getUserFilePrice(_tokenId);
        }
        return _total;
    }
}
