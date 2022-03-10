// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


/**
 * @title ERC20MintToken
 *
 * @dev Standard ERC20 token with burning and optional functions implemented.
 * For full specification of ERC-20 standard see:
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 */
contract ERC20MintToken is ERC20, Initializable {

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    /**
     * @dev Constructor.
     */
    constructor(){}
    
    function initialize(
                        string memory iname, 
                        string memory isymbol, 
                        uint8 idecimals
                        ) initializer public{

       _name = iname;
      _symbol = isymbol;
      _decimals = idecimals;
    }
    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint(address to, uint amount) external onlyOwner {
      _mint(to, amount);
    }
    function burn(address tokenowner, uint256 value) external onlyOwner {
      _burn(tokenowner, value);
    }
}
