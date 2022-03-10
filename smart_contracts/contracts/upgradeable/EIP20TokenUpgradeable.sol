// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";


/**
 * @title BEP20MintToken
 *
 * @dev Standard BEP20 token with burning and optional functions implemented.
 * For full specification of ERC-20 standard see:
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 */
contract EIP20TokenUpgradeable is Initializable , ERC20Upgradeable, ERC20BurnableUpgradeable, OwnableUpgradeable {
    /**
     * @dev Constructor.
     */
    function initialize(
                        string memory name_, 
                        string memory symbol_
                        ) public initializer {

        __ERC20_init(name_, symbol_);
        __ERC20Burnable_init();
        __Ownable_init();
    }
    function mint(address to, uint amount) public {
      _mint(to, amount);
    }
}
