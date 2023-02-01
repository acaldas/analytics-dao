// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CloneFactory.sol";
import "./UserFile.sol";

contract UserFileFactory is CloneFactory, Ownable {
    address masterContract;
    mapping(address => UserFile[]) public userFileAddresses;

    event UserFileCreated(UserFile userFile, address user);

    constructor(address _masterContract) {
        masterContract = _masterContract;
    }

    function createUserFile(
        address _user
    ) external onlyOwner returns (UserFile) {
        UserFile userFile = UserFile(createClone(masterContract));
        userFile.init(_user);

        userFileAddresses[_user].push(userFile);

        emit UserFileCreated(userFile, _user);
        return userFile;
    }

    function getUserFiles(
        address _user
    ) external view returns (UserFile[] memory) {
        return userFileAddresses[_user];
    }

    function getMasterContract() external view returns (address) {
        return masterContract;
    }
}
