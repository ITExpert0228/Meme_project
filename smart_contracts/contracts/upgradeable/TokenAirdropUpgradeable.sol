// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './AirdropUpgradeable.sol';


contract TokenAirdropUpgradeable is AirdropUpgradeable {
  function addRecipients(address[] memory _recipients) external onlyOwner {
    for(uint i = 0; i < _recipients.length; i++) {
      processedAirdropAmounts[_recipients[i]] = 1;
    }
  }

  function removeRecipients(address[] memory _recipients) external onlyOwner {
    for(uint i = 0; i < _recipients.length; i++) {
      processedAirdropAmounts[_recipients[i]] = 0;
    }
  }
  function blockAccounts(address[] memory addresses) public onlyOwner {
      for(uint i = 0; i < addresses.length; i++) {
      blockedAccounts[addresses[i]] = true;
    }
  }
  function unblockAccounts(address[] memory addresses) public onlyOwner {
      for(uint i = 0; i < addresses.length; i++) {
      blockedAccounts[addresses[i]] = false;
    }
  }
  function isBlocked(address addr) public view returns(bool){
      return blockedAccounts[addr];
  }
}
