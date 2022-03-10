// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract AirdropUpgradeable is OwnableUpgradeable, ReentrancyGuardUpgradeable {
  
  mapping(address => uint) public processedAirdropAmounts;
  
  IERC20Upgradeable public token;

  uint public currentAirdropAmount;
  uint public maxAirdropAmount;
  uint public countOfAirdropped;
  mapping(address => bool) public  blockedAccounts;
  address public signerAddress;

  event AirdropProcessed(
    address recipient,
    uint amount,
    uint date
  );

  function initialize(address _signer, address _token, uint _amount) public initializer {
    __Ownable_init();
    __ReentrancyGuard_init();
    _setupToken(_token);
    maxAirdropAmount = _amount;
    signerAddress = _signer;  
  }
  function _setupToken(address _token) internal{
    require(_token != address(0), "Pool: zero address is forbidden");
    token = IERC20Upgradeable(_token);
  }
  function updateMaxAmount(uint amount) public virtual onlyOwner {
      maxAirdropAmount = amount;
  }
  //Token Claim Funciton
  function signClaimTokens(
    address recipient,
    uint amount,
    bytes calldata signature
  ) external virtual nonReentrant onlyOwner{
    
    bytes32 _message = prefixed(keccak256(abi.encodePacked(recipient, amount)));
    address reSigner = recoverSigner(_message, signature);
    require(reSigner == signerAddress , "Wrong signature");

    _claimTokens(recipient, amount);

  }
  function claimTokens(
    address recipient,
    uint amount
  ) external virtual nonReentrant onlyOwner{
    
    _claimTokens(recipient, amount);
  }
  function _claimTokens(
    address recipient,
    uint amount
  ) internal{

    require(!blockedAccounts[recipient], 'blocked address');
    require(processedAirdropAmounts[recipient] == 0, 'airdrop already processed');
    require(currentAirdropAmount + amount <= maxAirdropAmount, 'airdropped 100% of the tokens');

    processedAirdropAmounts[recipient] = amount; 
    currentAirdropAmount += amount;
    countOfAirdropped ++;

    token.transfer(recipient, amount);

    emit AirdropProcessed(
      recipient,
      amount,
      block.timestamp
    );
  }


  function prefixed(bytes32 hash) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(
      '\x19Ethereum Signed Message:\n32', 
      hash
    ));
  }

  function recoverSigner(bytes32 message, bytes memory sig)
    internal
    pure
    returns (address)
  {
    uint8 v;
    bytes32 r;
    bytes32 s;
  
    (v, r, s) = splitSignature(sig);
  
    return ecrecover(message, v, r, s);
  }

  function splitSignature(bytes memory sig)
    internal
    pure
    returns (uint8, bytes32, bytes32)
  {
    require(sig.length == 65);
  
    bytes32 r;
    bytes32 s;
    uint8 v;
  
    assembly {
        // first 32 bytes, after the length prefix
        r := mload(add(sig, 32))
        // second 32 bytes
        s := mload(add(sig, 64))
        // final byte (first byte of the next 32 bytes)
        v := byte(0, mload(add(sig, 96)))
    }
  
    return (v, r, s);
  }
}
