// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import '../base/BaseBridge.sol';
contract ETHBridge is BaseBridge {
constructor(address token) BaseBridge(token) {}
}