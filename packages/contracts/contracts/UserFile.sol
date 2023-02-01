// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract UserFile {
    address private user;

    function init(address _user) external {
        user = _user;
    }

    function getUser() external view returns (address) {
        return user;
    }
}
